import serial 
import string
from time import sleep





class Communications():



    def __init__(self, key: int, byte_length:int=None, message: str=None):

        # set up the arduino, make sure port # is correct
        self.arduino = serial.Serial(port='COM6', baudrate=115200, timeout=.1)
        self.key = key
        self.key_decrypt = key * -1
        self.byte_length = byte_length
        self.message = message
        self.received_message = ''

    # select and send number of bytes to arduino to transmit
    def send_byte_length(self):
        ''' function that selects the number of bytes in each message '''
        # loop through until arduino is ready for input
        while True:
            # print the serial data from the py to the terminal
            serial_data = str(self.arduino.readline())
            print(serial_data) # print serial data to know where arduino is at 
            # if arduino is ready for input, send input to arduino
            if (serial_data == "b'ready 0\\r\\n'"):
                self.arduino.write(bytes(self.byte_length, 'utf-8'))
                print(f"The length of the message is {self.byte_length}")
                sleep(0.1)
            # make sure arudino has received byte length before returning
            if (serial_data == "b'confirm\\r\\n'"):
                print("received byte confirm")
                return

        # what to do if we never receive confirm ?
        # what to do if wrong input is recieved ?

    # select and send message to arduino to transmit
    def send_message(self):
        '''function used to send the message to the arduino 
        that will be transmitted to the Rx module'''
        # loop through until arduino is ready for input
        while True:
            serial_data = str(self.arduino.readline())
            print(serial_data) # print serial data to know where arduino is at 
            # wait for arduino to be ready for input
            if (serial_data == "b'ready 1\\r\\n'" ):
                self.message = input(" Enter the message to send: ")
                self.byte_length = str(len(self.message)) # get length of the message
                # add encryption here:
                message_encrypted = self.encryption([string.ascii_lowercase, string.ascii_uppercase, string.punctuation])
                # next, write encrpyted message to the arduino
                self.arduino.write(bytes(message_encrypted.encode()))
                sleep(0.1)
            # once confirmation: return
            if (serial_data == "b'confirm\\r\\n'"):
                print("received message confirm")
                return

            # what to do if we never receive confirm ?
            # what to do if wrong input is received ?


    def encryption(self, alphabet):

        print("in encryption method")

        def shift_alphabet(alphabet):
            return alphabet[self.key:] + alphabet[:self.key]
    
        shifted_alphabet = tuple(map(shift_alphabet, alphabet))
        final_alphabet = ' '.join(alphabet)
        final_shifted_alphabet = ' '.join(shifted_alphabet)
        table = str.maketrans(final_alphabet, final_shifted_alphabet)

        print("encypted message", self.message.translate(table))
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


        # need to split received transmission until various parts:
        # print("the value in the string is:", self.received_message)
        # split the string at each ,
        received_list = self.received_message.split(",")
        self.received_message = received_list[2]
        encrypted_received_message = self.received_message
        received_rssi_value = received_list[3]
        received_snr_value = received_list[4]

        # decrypt the received message:
        self.received_message = self.decrpytion([string.ascii_lowercase, string.ascii_uppercase, string.punctuation])
        print(f"The received Encrypted message is: {encrypted_received_message}")
        print(f"The decryped message is: {self.received_message}" )
        print(f"The signal-to-noise Ratio is {received_snr_value}")
        print(f"The received rssi value is {received_rssi_value}")

    def reply(self):
        '''function replys back to the transmitter after receiving a message'''
        reply = 'y' # send simple 1 byte string back
        # at_send_reply = ""
        # self.arduino.write(bytes(message_encrypted.encode()))

    def read_serial_monitor(self):
        ''' function continously reads in the serial monitor 
            from the arduino'''
        while True:
            serial_data = str(self.arduino.readline()) # read in line from arduino serial monitor
            print(serial_data)
            sleep(0.05)
            # check to see if we received a transmission:
            check_if_transmission_received = serial_data.rfind("+RCV") #look for "+RCV" to know we received a transmission
            if (check_if_transmission_received != -1):
                # will enter conditional on confirmation of transmission
                self.received_message = serial_data 
                self.split_reception() # call split reception to extract data
                # Next, now that we have received a message we need to send a confirmation back

                return
                
            # enter conditional once confirmation of sent transmission
            if (serial_data == "b'confirm 3\\r\\n'"):
                # successfully sent transmission: return
                print(f"Successfully sent message {self.message}")
                return
            


