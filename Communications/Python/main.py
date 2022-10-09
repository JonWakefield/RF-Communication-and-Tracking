# main module used to interact with arduino 
import serial 
from communication_modules import Communications

'''Program defaults to reading in serial monitor, 
    this will display any received messages,
    can change to transmit messsage by press of button.'''
    
def main():

    private_key = 5 # change private key to prevent theft
    
    #setup RF object:
    communication_RF = Communications(private_key)
    # default to read_serial_monitor
    # main juice of program will take place in read_serial_monitor method
    print("reading in serial monitor:")
    communication_RF.read_serial_monitor()





if __name__ == '__main__':

    # arduino = serial.Serial(port='COM6', baudrate=115200, timeout=.1)
    # For now, on start up; send byte length and message to arduino through
    # serial communications
    # sent the key for the encryption and decryption:
    while True:
        main()
