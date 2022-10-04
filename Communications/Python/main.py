# main module used to interact with arduino 
import serial 
from communication_modules import Communications


def main():

    private_key = 5
    communication_RF = Communications(private_key)

    # receiver function
    def receive():
        ''' function sets up module as a receiver
            waits until recieves message -> action'''
        # read serial monitor until we receive the transmission
        communication_RF.read_serial_monitor()

    # transmit function:
    def transmit():
        ''' transmit function: asks user for byte length 
            and message to be transmitted'''

        # call send message to get user input: 
        communication_RF.send_message()
        # call send byte length to get user input:
        communication_RF.send_byte_length()
        # read serial monitor:
        communication_RF.read_serial_monitor()

    # ask user if they want to start as a transmitter or a receiver:
    transmit_or_receive = input("Transmit or Receive? (T/R)")

    if transmit_or_receive.upper() == "T":
        # call transmit:
        transmit()
    elif transmit_or_receive.upper() == "R":
        # call receive
        receive()
    
    # else user entered unknown character
    else:
        # unknwon character
        print("Not a valid option")
        print("Please try again")
        return





if __name__ == '__main__':

    # arduino = serial.Serial(port='COM6', baudrate=115200, timeout=.1)
    # For now, on start up; send byte length and message to arduino through
    # serial communications
    # sent the key for the encryption and decryption:
    while True:
        main()


   

