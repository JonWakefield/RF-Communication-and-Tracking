import serial
from time import sleep
import re







class Beacon():

    def __init__(self):

        self.beacon = serial.Serial(port="/dev/ttyS0", baudrate=115200, timeout=0.1)
        self.received_message = '' # string to hold any received transmissions
        self.received_address = '' #stores address from the received transmission
        self.payload_length = ''
        self.received_rssi_value = '' # stores received rssi value for later processing
        self.received_snr_value  = '' # stores SNR value received for later processing
        self.lora_band = "AT+BAND=915000000\r\n" # LoRa Band
        self.lora_networkid = "AT+NETWORKID=5\r\n" # network ID: can / will change later on
        self.lora_address = "AT+ADDRESS=3\r\n" # address of module
        self.rover_address = "2" # sending data here
        self.base_station_address = "1"
        # initlize the beacon:
        self.beacon.write(bytes(self.lora_band.encode()))
        sleep(0.5)
        self.beacon.write(bytes(self.lora_networkid.encode()))
        sleep(0.5)
        self.beacon.write(bytes(self.lora_address.encode()))

    def process_and_transmit_received_transmission(self):
        '''function process the received transmission and send message to next rf module'''

        #conditional for messages sent from base station"
        if(self.received_address == "1"):
            # prep data to send to rover:
            print("Message sent from base station...")
            print("Sending message to Rover...")
            transmit_message = f"AT+SEND={self.rover_address},{self.payload_length},{self.received_message}\r\n"
            print(f" Sending string: {transmit_message}")
            self.beacon.write(bytes(transmit_message.encode()))
            print("Message sent...")
        
        elif (self.received_address == "2"):
            # prep data to send to base station:
            print("Message sent from Rover...")
            print("Sending message to Base Station...")
            transmit_message = f"AT+SEND={self.base_station_address},{self.payload_length},{self.received_message}\r\n"
            print(f" Sending string: {transmit_message}")
            self.beacon.write(bytes(transmit_message.encode()))
            print("Message sent...")


    def split_received_transmission(self):
        ''' function called when beacon receives a transmission
            function will: split reception, determine sender address'''

        try:
            reception_list = self.received_message.split(",") # split string at commas:
        except:
            print("message does not contain commas")
            # TAKE ACTION HERE:

        # maybe check length of recption_list, if not 5 -> we know the message is fragmented, have sender send a new one:

        try:
            self.received_address = reception_list[0]
            # Next, take out +RCV from self.received_address:
            # remove all non-numbers from tranmission:
            self.received_address = re.sub("[^0-9]","", self.received_address)
            print(f"Received Message from Address {self.received_address}")
        except:
            print("no receiver address found...")
            # NEED TO TAKE ACTION HERE:
        try:
            self.payload_length = reception_list[1]
        except:
            print("No payload length received")
        try:
            self.received_message = reception_list[2]
        except:
            print("list index out of range. no message received")
            # HERE WE NEED TO SEND MESSAGE BACK TO RF TO SEND DATA BACK TO BEACON
        try:
            self.received_rssi_value = reception_list[3]
        except:
            print("no rssi value received...")
        try:
            self.received_snr_value = reception_list[4]
            self.received_snr_value = re.sub("[^0-9]","", self.received_snr_value)
            print(f"Received SNR value is: {self.received_snr_value}")
        except:
            print("no SNR value received")

        self.process_and_transmit_received_transmission() # send message back



    def read_serial_monitor(self):
        ''' read in serial data, program remains here until prompted to take action'''

        while True:
            serial_data = str(self.beacon.readline()) #read serial port
            sleep(0.05)
            if serial_data != "b''":
                print(serial_data)                   #print received data

            check_if_transmission_received = serial_data.rfind("+RCV")
            if (check_if_transmission_received != -1):
                print("recieved transmission...")
                self.received_message = serial_data
                print(f"Received Transmission: {self.received_message}")
                self.split_received_transmission()





