

`timescale 1ns / 1ps
module statemachine (

    // ---- INPUTS -------
    input clock, // BASYS CLOCK
    input TX_trig, // WIRE FROM TX lINE ON LORA 
    input startButton, // RESET BUTTON (ButtonDown) ON BASYS
    input arduino_signal, // START / STOP WIRE FROM ARDUINO
    input resetParams, //RESET WIRE FROM ARDUINO 

    // ---- OUTPUTS ------
    output reg LED1 = 0, // ACTIVATED WHEN RESPONSE BACK IS RECEIVED (STOP TIMER)
    output reg LED3 = 0, // WHEN TX DELAY IS STARTED
    output reg LED5 = 0, // FINISHED TX DELAY COUNTER
    output reg LED10 = 0, // WHEN TX LINE IS ACTIVATED (ACTIVE LOW)
    output reg LED11 = 0, // INDICATES WHEN RESET BUTTON WAS HIT (POINTLESS)
    output reg LED15 = 0, // WHEN ENTIRE TIME IS SENT TO THE ARDUINO
    output reg start_wire = 0,
    output reg data_wire = 0



);


// ---- STATE MACHINE PARAMETERS ----
reg[2:0] state = 0;
parameter start = 3'b000;
parameter reset = 3'b001; // state 0: reset / in between transmission
parameter tof_timer = 3'b010; // state 1: wait for transmit -> start counter on transmit 
parameter send_bits = 3'b011; // state 3: send bits to the arduino
parameter wait_for_reset = 3'b100; // wait until arduino is done to resest state machine 
// ----------------------------------

// registers
reg[31:0] tof_value = 0;
reg[31:0] delay_counter = 10000000; // decremete this counter to ensure TX transmit line is back to steady state HIGH
reg[31:0] tof_counter = 0; // 32 bit register to increament time of flight every posedge clock pulse
reg[31:0] tof_testing_value = 32'b1010101010101010101010101010101; // random value for testing (to ensure bits are getting sent to arduino in correct order)
reg start_delay_counter = 0; // start delay_counter after TX line goes low
reg[7:0] bit_shift_counter = 0; // count number of bits transmitted
reg done_transmit_flag = 0; // 
reg transmit_flag = 0; // this will start high
reg receiving_flag = 0;
reg arduino_prev_state = 0; // start at 0
reg bit_mask = 1'b1; // shift this left (<<) every cycle to get correct value from time_length; (masking)
reg binary_transmit_value = 0;

// ----- case: send_bits registers ----
reg start_shift_delay = 1;
reg[27:0] shift_counter = 28'd100000000;



always @ (posedge clock) begin


    case(state)
    
        start: begin
            if(startButton) begin
                state <= reset;
            end
        end

        // RESET PARAMETERS STATE:
        reset: begin
            //  ----LEDS---
            LED1 <= 0;
            LED3 <= 0;
            LED5 <= 0;
            LED10 <= 0;
            LED11 <= 1; //indicate reset button was hit
            LED15 <= 0;
            // -----OUTPUTS-----
            tof_value <= 0;
            start_wire <= 0;
            data_wire <= 0;
            // -----REGISTERS-----
            delay_counter <= 10000000;
            start_delay_counter <= 0;
            done_transmit_flag <= 0;
            transmit_flag <= 0;
            receiving_flag <= 0;
            arduino_prev_state <= 0;
            tof_counter <= 0;
            bit_mask <= 1'b1;
            binary_transmit_value <= 0;
            bit_shift_counter <= 0;
            tof_testing_value = 32'b1010101010101010101010101010101; //COMMENT OUT IF NOT TESTING
            start_shift_delay = 1;
            shift_counter = 28'd100000000;

            // AFTER RESET: CHANGE STATE TO start_counter
            state <= tof_timer;
            

        end

        // START COUNTER ON TRANSMITE STATE:
        tof_timer: begin
            // this conditional will start the tof_counter (TX pin is HIGH (3.3 until transmitting))
            if (!TX_trig && !done_transmit_flag) begin // once TX goes low, enter next conditional
                transmit_flag <= 1; // set flag to true, indicating we should start counting:
            end
            if (transmit_flag) begin
                // If here, start counting
                tof_counter <= tof_counter + 1; // at every posedge, count++ (every 1ns)
                
                LED10 <= 1; // activate LED for visual indication
        
                // after TX goes high: set receiving_flag high (for now...)
                start_delay_counter <= 1;
            
                done_transmit_flag <= 1;
            end
            // delay block:
            if(start_delay_counter) begin
                LED3 <= 1;
                delay_counter = delay_counter - 1;
            end
            if(delay_counter == 0) begin
                receiving_flag <= 1;
                LED5 <= 1;
            end
            if (receiving_flag) begin // could probably get rid of receiving_flag
            
                // will enter once a transmission has been received:
                if (!TX_trig) begin
                
                    //if here, we want to stop counting:
                    
                    transmit_flag <= 0; // senting this to zero will stop the counter
        
                    // create a wire to the bit shifter module:
                    tof_value <= tof_counter; // assign final value to tof_counter 
                    
                    // for now , set LED10 to low (off)
                    LED10 <= 0;
                    LED1 <= 1;
                    receiving_flag <= 0;
                    state <= send_bits;
                end
            end
            if(resetParams) begin
                state <= reset;
            end
        end

        // SEND BITS TO THE ARDUINO HERE
        send_bits: begin
        
            // clock pulse delay:
            if (start_shift_delay) begin
                shift_counter = shift_counter - 1;
            end   
            if (shift_counter == 0) begin
            
                shift_counter = 28'd10000; // smaller value, half second now
                
            
                // --- create bit shifter here ---
//                binary_transmit_value = tof_value & bit_mask;
                binary_transmit_value = tof_testing_value & bit_mask; // 
            
               //data_wire <= 0;
                if(binary_transmit_value) begin
                    data_wire = 1;
                end
                else begin
                    data_wire = 0;
                end

                // shift time value right 1 now:
//                tof_value = tof_value >> 1; // shift time of flight value
                // ---- TESTING SECTIONS ----
                tof_testing_value = tof_testing_value >> 1;
                /// -------------------------------
                
                start_shift_delay = 1;


                bit_shift_counter = bit_shift_counter + 1;
                
                if(bit_shift_counter > 30) begin
                // once all bits have been shifted end loop:
                    start_wire <= 0;
                    state <= wait_for_reset;
                end 
            
            end
            
            if(resetParams) begin
                state <= reset;
            end
        end
        wait_for_reset: begin
            if(resetParams) begin
                state <= reset;
            end
        end
        default: begin
                // if in default state, something is wrong
                // return to idle
                state <= start;
        end
    endcase
end

endmodule