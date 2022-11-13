// upload code to arduino, use button on breadboard to send data to second module
// Have RF modules communicate through software serial
// communicate from python to arduino using regular serial
#include <SoftwareSerial.h>

// location of software serial pins:
// set up softwareserial
SoftwareSerial mySerial(2, 3);



// ---- LORA VARIABLES ------
String lora_band = "915000000"; //enter band as per your country
String lora_networkid = "5";    //enter Lora Network ID
String lora_address = "1";      //enter Lora address
String lora_beacon1_address = "60";
String lora_beacon2_address = "61";
String lora_beacon3_address = "62";
String lora_beacon4_address = "63";

String lora_baud = "9600";
// -------------------------

// ------ GLOBAL VARIABLES --------
int timeValues[32]; // array to store tof values from basys
String incoming_string_myserial; // read in serial data from mySerial


// --------------------------

// ------ I/O PINS ----------------
#define arduino_signal 5 // response back to verilog that we successfully received the data bit
#define verilog_start_stop_wire 6 // verilog start and stop wire
#define verilog_data_wire 7 // tof bits from verilog
#define transmit_button 8
#define reset_basys_pin 12
// -----------------------------

void setup()
{
  Serial.println("setting up module");
  Serial.begin(9600);
  mySerial.begin(9600);

  delay(100);
  // set-up the lora here:
  Serial.println("starting lora setup");
  mySerial.println("AT+BAND=" + lora_band);
  delay(100);
  mySerial.println("AT+ADDRESS=" + lora_address);
  delay(100);
  //  mySerial.println("AT+IPR=" + lora_baud);
  delay(100);
  mySerial.println("AT+NETWORKID=" + lora_networkid);
  delay(100);
  pinMode(transmit_button, INPUT);
  pinMode(arduino_signal, OUTPUT);
  pinMode(verilog_start_stop_wire, INPUT);
  pinMode(verilog_data_wire, INPUT);
  pinMode(reset_basys_pin, OUTPUT);
  digitalWrite(arduino_signal, LOW); // start at 0
  digitalWrite(reset_basys_pin, LOW);


}


// transmit message:
void transmit() {

  Serial.println("transmitting in 2 seconds...");
  delay(2005);
  mySerial.println("AT+SEND=4,1,y"); //send data string
  delay(105);

  // wait here until we get the "+OK" out of the system
  while (!mySerial.available()) {
  }
  if (mySerial.available()) {

    incoming_string_myserial = mySerial.readString();

    Serial.println(incoming_string_myserial);

  }

}

int response() {
  // get response back from beacon:
  // Need to factor in chance we get no response

  // first: get current millis time:
  unsigned long currentMillis = millis();
  unsigned long currentDelay = 3000; // how long we will wait for a response from a beacon before moving on:

  while (true) {
    // if we receive a response, enter:
    if (mySerial.available()) {

      // read in and print value:
      incoming_string_myserial = mySerial.readString();

      Serial.println(incoming_string_myserial);

      return 1;
    }
    // if we don't receive a response in 3 seconds, enter:
    if (millis() > (currentDelay + currentMillis)) {
      Serial.println("Did not get a response");
      return 0;
    }


  }


}

int get_data_from_basys() {

  int prev_state = 0; // starts 0 bc start_wire starts at 1
  int counter = 0;
  int verilog_state = 0;
  int outOfSync = 0;
  String bit_from_verilog;

  // assume verilog beats us here:
  // have verilog wait until arduino_signal is high
  digitalWrite(arduino_signal, 1);

  while (true) {

    // once start wire goes high, this signals that we will start to receive data
    verilog_state = digitalRead(verilog_start_stop_wire);
//    Serial.println("Verilog state is " + verilog_state);

    if (verilog_state != prev_state) {

      if (digitalRead(verilog_data_wire) == HIGH) {
        timeValues[counter] = 1;
      }
      else if (digitalRead(verilog_data_wire) == LOW) {
        timeValues[counter] = 0;
      }
      else {
        Serial.println("Received not recognized");
      }

      counter = counter + 1; // increate the counter  (locatio in the array)

      prev_state = !prev_state; // just invert the previous state

      // just send 32 bits:: then exist loop
      if (counter > 31) {

        Serial.println("returning...");
        return 1;
      }

      if (prev_state) {
        digitalWrite(arduino_signal, 0);
      }
      else {
        digitalWrite(arduino_signal, 1);
      }


    } else {

      outOfSync++;
      // if clocks get out of sync currently just abort:
      if (outOfSync > 5) {
        Serial.println("Clocks out of sync...Done");
        // for testing print what values we do have:
        return 1;
      }


    }

  }
}


// reset parameters on basys_board
void reset_basys() {

  // set reset pin high to reset all parameters on basys board:
  // ---- TESTING SECTION -------
  Serial.println("Resting Basys Params in 2 seconds");
  delay(2000);
  digitalWrite(reset_basys, 1);
  delay(10);
  digitalWrite(reset_basys, 0);
  delay(300);

}

//
void print_and_reset_tof() {

  for (int i = 0; i < 32; i++) {
    Serial.print(timeValues[i]);
    timeValues[i] = 0;
  }
  Serial.println("\n");
  
}


// --- GLOBAL VARIABLES: GENERAL ---

// ------------------------

void loop()
{

  //  1. RESET BASYS
  reset_basys();

  int received_response = 0;
  int done_reading_basys = 0;

  //  2. TRANSMIT
  transmit();

  //  3. GET RESPONSE BACK
  received_response = response();

  //  4. READ IN TOF VALUE
  if (received_response) {
    done_reading_basys = get_data_from_basys();
  }

  //  5. PRINT & RESET TOF ARRAY:
  if (done_reading_basys) {
    print_and_reset_tof();
  }
    
}


// GOAL OF PROGRAM:
// Program should be an automatic data retrieval and storage process
// 1. transmit message
// 2. Get TOF  from basys
