import serial 
import string
from time import sleep
import re




class Communications():


    def __init__(self, key: int, byte_length:int=None, message: str=None):

        # set up the arduino, make sure port # is correct
        self.arduino = serial.Serial(port='COM6', baudrate=9600, timeout=.1)
        self.key = key
        self.key_decrypt = key * -1
        self.byte_length = byte_length
        self.message = message
        self.received_message = ''
        self.message_confirmation = 'y+' # sent back to arduino on successful reception of message

    # select and send number of bytes to arduino to transmit
    def send_byte_length(self):
        ''' function that selects the number of bytes in each message '''
        # loop through until arduino is ready for input
        while True:
            # print the serial data from the py to the terminal
            serial_data = str(self.arduino.readline().decode('UTF-8')).strip()
            serial_data = str(self.arduino.readline())
            #print(serial_data) # print serial data to know where arduino is at 
            # if arduino is ready for input, send input to arduino
            if (serial_data == "b'ready 0\\r\\n'"):
                #self.arduino.write(bytes(self.byte_length, 'UTF-8'))
                self.arduino.write(bytes(self.byte_length.encode()))
                print(f"The length of the message is {self.byte_length}")
                sleep(0.1)
            # make sure arudino has received byte length before returning
            if (serial_data == "b'confirm\\r\\n'"):
                # print("received byte confirm")
                return

        # what to do if we never receive confirm ?
        # what to do if wrong input is recieved ?

    # select and send message to arduino to transmit
    def send_message(self):
        '''function used to send the message to the arduino 
        that will be transmitted to the Rx module'''
        # loop through until arduino is ready for input
        while True:
            #serial_data = str(self.arduino.readline().decode('UTF-8')).strip()
            serial_data = str(self.arduino.readline())
            print(serial_data) # print serial data to know where arduino is at 
            # wait for arduino to be ready for input
            if (serial_data == "b'ready 1\\r\\n'" ):
                self.message = input(" Enter the message to send: ").strip()
                self.byte_length = str(len(self.message)) # get length of the message
                # add encryption here:
                message_encrypted = self.encryption([string.ascii_lowercase, string.ascii_uppercase, string.punctuation])
                # next, write encrpyted message to the arduino
                self.arduino.write(bytes(message_encrypted.encode()))
                sleep(0.1)
            # once confirmation: return
            if (serial_data == "b'confirm\\r\\n'"):
                # print("received message confirm")
                return

            # what to do if we never receive confirm ?
            # what to do if wrong input is received ?


    def encryption(self, alphabet):

        def shift_alphabet(alphabet):
            return alphabet[self.key:] + alphabet[:self.key]
    
        shifted_alphabet = tuple(map(shift_alphabet, alphabet))
        final_alphabet = ' '.join(alphabet)
        final_shifted_alphabet = ' '.join(shifted_alphabet)
        table = str.maketrans(final_alphabet, final_shifted_alphabet)

        print("The Encypted Message Is:", self.message.translate(table))
        return str(self.message.translate(table))


    def decrpytion(self, alphabet):
        

        def shift_alphabet(alphabet):
            return alphabet[self.key_decrypt:] + alphabet[:self.key_decrypt]
    
        shifted_alphabet = tuple(map(shift_alphabet, alphabet))
        final_alphabet = ' '.join(alphabet)
        final_shifted_alphabet = ' '.join(shifted_alphabet)
        table = str.maketrans(final_alphabet, final_shifted_alphabet)

        return str(self.received_message.translate(table))

    def split_reception(self):
        ''' function splits the received transmission into a list with format:
            +RCV=<Address>,<Length>,<Data>,<RSSI>,<SNR>,'''

        a = ""
        # need to split received transmission until various parts:
        # print("the value in the string is:", self.received_message)
        # split the string at each ,
        received_list = self.received_message.split(",")
        # since the received message should be formated the same everytime, hardcode the location of the saved values
        self.received_message = received_list[2]
        encrypted_received_message = self.received_message
        received_rssi_value = received_list[3]
        try:
            received_snr_value = received_list[4]
            received_snr_value = re.sub("[^0-9]","", received_snr_value)
        except:
            print("no SNR value received")
            received_snr_value = False
        # decrypt the received message:
        self.received_message = self.decrpytion([string.ascii_lowercase, string.ascii_uppercase, string.punctuation])
        # check if message was confirmation message:
        if (self.received_message == self.message_confirmation):
            print("Confirmation Received")
            print("Message was successfully transmitted and Received")
            print("Returning to Serial Monitor...\n")
        else:
            # print(f"{a:<20} Home Team Points Multiplier: {a:<4} {home_multiplier:.2f}")
            print(f"{a:<5}The received Encrypted message is: {encrypted_received_message}")
            print(f"{a:<5}The decryped message is: {self.received_message}" )
            print(f"{a:<5}The signal-to-noise Ratio is: {received_snr_value}" )
            print(f"{a:<5}The received rssi value is: {received_rssi_value}")
            print(f"{a:<5}Returning To Serial Monitor:")
        # Next, now that we have received a message we need to send a confirmation back
        # inform arduino we received a message and we should send one back:
        self.send_confirmation()

        return

    def send_confirmation(self):
        '''function replys back to the transmitter after receiving a message'''
        
        self.arduino.write(bytes(self.message_confirmation.encode()))
        return

    def communication_beacon_setup(self):
        ''' function allows for the add or removal of communication beacon addressing'''
        # print("Which beacon would you like to setup?")
        # first, wait for arduino to be ready:
        wrong_input = "N"
        while True:
            #serial_data = str(self.arduino.readline().decode('UTF-8')).strip()
            serial_data = str(self.arduino.readline())
            print(serial_data) # print serial data to know where arduino is at 
            # wait for arduino to be ready for input
            if (serial_data == "b'ready B\\r\\n'" ):
                print("Beacon Menu Selection:")
                print("1. Activate Beacon:")
                print("2. Deactivate Beacon")
                beacon_user_selection = input("Enter Action: ")
                if (beacon_user_selection == '1' or beacon_user_selection == '2'):
                    # if user inputed valid beacon action: write value to serial
                    self.arduino.write(bytes(beacon_user_selection.encode()))
                    return
                else:
                    print("invalid beacon action!")
                    self.arduino.write(bytes(wrong_input.encode()))
                    return

    def everything_menu(self):
        ''' everything menu: triggered when user presses the 'everything button'
            # CURRENT OPTIONS:
            # 1. transmit a message
            # 2. Select communication beacon on / off '''
        wrong_input = "N"
        # list options to user, get user input
        print("Welcome to the Everything menu, Please make a selection:")
        print("1. Transmit a message")
        print("2. Setup Communication Beacon")
        user_action = input("Enter a menu option:")
        if user_action == '1':
            # transmit message conditional:
            # send user action selection to arduino here:
            self.arduino.write(bytes(user_action.encode()))
            self.send_message() 
            self.send_byte_length()
            return
        elif user_action == '2':
            # communication beacon setup conditional:
            # send user action selection to arduino here:
            self.arduino.write(bytes(user_action.encode())) # sending it in conditional confirms valid menu selection
            self.communication_beacon_setup()
            return
        else:
            print("action not recognized, try again.")
            self.arduino.write(bytes(wrong_input.encode()))
            return
            # allow user to re-enter a command here:

    def read_serial_monitor(self):
        ''' function continously reads in the serial monitor 
            from the arduino'''
        # enter inf. loop:
        a = ""
        while True:
            #serial_data = str(self.arduino.readline().decode('latin-1')).strip() # read in line from arduino serial monitor. convert to string for comparision checks       
            serial_data = str(self.arduino.readline())
            sleep(0.05)
            if (serial_data != "b''") and (serial_data != "b'\\r\\n'") and (serial_data != "b'\\n'"):
                # remove b' and \r\n' from string:
                print(f"{serial_data}")
            # check to see if we received a transmission:
            check_if_transmission_received = serial_data.rfind("+RCV") #look for "+RCV" to know we received a transmission
            if (check_if_transmission_received != -1):
                # will enter conditional on confirmation of transmission
                print(f"\n{a:<10}Reception Incoming:\n")
                self.received_message = serial_data # set serial data to received_message variable
                # print(self.received_message)
                self.split_reception() # call split reception to extract data

            # if everything button pressed enter this conditional:    
            if (serial_data == "b'every\\r\\n'"):
                self.everything_menu()

            # enter conditional once confirmation of sent transmission
            # check if we receive the return message here:
            if (serial_data == "b'confirm 3\\r\\n'"):
                # successfully sent transmission: return
                print(f"Successfully sent message {self.message}")

            


            
            


       


