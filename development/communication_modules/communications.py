import serial 
import serial.threaded
import string
from time import sleep
import re
import pandas as pd




class Communications():


    def __init__(self, key: int):

        # set up the arduino, make sure port # is correct
        self.arduino = serial.Serial(port='COM4', baudrate=9600, timeout=.1)
        self.arduino1 = serial.threaded.LineReader
        self.key = key
        self.key_decrypt = key * -1
        self.byte_length = ''
        self.message = ''
        self.received_message = ''
        self.message_confirmation = 'y+' # sent back to arduino on successful reception of message
        self.received_snr_value = ''

    
    # V2 of send_message:
    def send_message(self, message_to_transmit):
        '''function used to send the message to the arduino 
        that will be transmitted to the Rx module'''
        # make sure message is not empty
        if (not message_to_transmit):
            return

        self.message = message_to_transmit

        # So we want to transmit a message;
        # first we need to send an 'alert' to the arduino to let it know we want to send a message
        send_message_alert = "^T"
        self.arduino.write(bytes(send_message_alert.encode()))

        # now that we've sent our alert to the arduino, let's wait for arduino to be ready
        # read in serial monitor until arduino says its ready for transmission
        while True:
            serial_data = str(self.arduino.readline())

            # print serial data to know where arduino is at 
            if (serial_data != "b''") and (serial_data != "b'\\r\\n'") and (serial_data != "b'\\n'"):
                # remove b' and \r\n' from string:
                print(f"{serial_data}")

            # wait for arduino to be ready for input
            if (serial_data == "b'^T\\r\\n'" ):

                # add encryption here:
                message_encrypted = self.encryption([string.ascii_lowercase, string.ascii_uppercase, string.punctuation])
                
                # next, write encrpyted message to the arduino
                self.arduino.write(bytes(message_encrypted.encode()))
                sleep(0.1)
            # once confirmation: return
            if (serial_data == "b'confirm\\r\\n'"):
                print("received transmit message confirm")
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
            self.received_snr_value = received_list[4]
            self.received_snr_value = re.sub("[^0-9]","", self.received_snr_value)
        except:
            print("no SNR value received")
            self.received_snr_value = False

        # check if message or tracking update:
        # check if recieved message starts with left bracket ([) indicating a tracking update
        # if (self.received_message[0] == "["):
        #     return "tracking"

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
            print(f"{a:<5}The signal-to-noise Ratio is: {self.received_snr_value}" )
            print(f"{a:<5}The received rssi value is: {received_rssi_value}")
            print(f"{a:<5}Returning To Serial Monitor:")
        # Next, now that we have received a message we need to send a confirmation back
        # inform arduino we received a message and we should send one back:
        #self.send_confirmation()

        return

    def send_confirmation(self):
        '''function replys back to the transmitter after receiving a message'''
        
        self.arduino.write(bytes(self.message_confirmation.encode()))
        return

    # V2 of toggling the communication beacon (on or off):
    def communication_beacon_setup(self, beacon_state):
        ''' function allows for the add or removal of communication beacon addressing'''

        # inform arduino we want to setup the communication beacon
        send_message_alert = "^B"
        self.arduino.write(bytes(send_message_alert.encode()))

        # now that we've sent our alert to the arduino, let's wait for the 
        # arduino to be ready for our state change:
        while True:
            
            serial_data = str(self.arduino.readline())

             # print serial data to know where arduino is at 
            if (serial_data != "b''") and (serial_data != "b'\\r\\n'") and (serial_data != "b'\\n'"):
                # remove b' and \r\n' from string:
                print(f"{serial_data}")
           
            # wait for arduino to be ready for input
            if (serial_data == "b'^B\\r\\n'" ):

                # right to arduino updating comms beacon state:
                self.arduino.write(bytes(beacon_state.encode()))
   

                # once confirmation: return
            if (serial_data == "b'confirm\\r\\n'"):
                print("Beacon state has been updated:")
                return


    def read_serial_monitor(self):
        ''' function continously reads in the serial monitor 
            from the arduino'''

        a = ""
        while True:
            
            # read data in from the serial monitor
            serial_data = str(self.arduino.readline())
            sleep(0.05)
            if (serial_data != "b''") and (serial_data != "b'\\r\\n'") and (serial_data != "b'\\n'"):
                # remove b' and \r\n' from string:

                print(f"{serial_data}")

            # check to see if we received a transmission:
            check_if_transmission_received = serial_data.rfind("+RCV") #look for "+RCV" to know we received a transmission
            # will enter conditional on confirmation of transmission
            if (check_if_transmission_received != -1):
                
                print(f"\n{a:<10}Reception Incoming:\n")
                self.received_message = serial_data # set serial data to received_message variable
                # print(self.received_message)
                self.split_reception() # call split reception to extract data

                return self.received_message, self.received_snr_value


            #check if data is available in messages.csv: (aka when we want to send a message)
            try:
                messages_df = pd.read_csv("development\documents\messages.csv", header=None)
                message_list = messages_df.values.tolist()
                message = str(message_list[0])
                message = message.lstrip(message[0]).rstrip(message[-1])
                message = message.lstrip(message[0]).rstrip(message[-1])
                prev_message = message
                print(f"found message: {message}")
                print(f"found message: {type(message)}")
                print(f"found message: {len(message)}")

                # clear the file
                try:
                    file_to_delete = open("development\documents\messages.csv",'w')
                    file_to_delete.close()
                except:
                    print("unable to open file to clear:")

                # next, call send_message to transmit to arduino
                self.send_message(message)


            except pd.errors.EmptyDataError:
                pass

            # check if user wants to change state of the beacon:    
            try:
                beacon_state_df = pd.read_csv("development\documents\\beaconstate.csv", header=None)

                # extract and convert data to a python string:
                beacon_state_list = beacon_state_df.values.tolist()
                beacon_state = str(beacon_state_list[0])

                # next, clear the file
                try:
                    file_to_delete = open("development\documents\\beaconstate.csv",'w')
                    file_to_delete.close()
                except:
                    print("unable to open file to clear:")

                #finally, pass value to arduino:
                self.communication_beacon_setup(beacon_state)
            except pd.errors.EmptyDataError:
                pass



# private_key = 5 # private key used for encryption and decryption
# communication_RF = Communications(private_key)