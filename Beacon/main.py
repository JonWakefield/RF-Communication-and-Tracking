import serial
from beacon_modules import Beacon



                                                                                                   
def main():

    beacon_1 = Beacon() # create a beacon

    beacon_1.read_serial_monitor() # read in serial data


if __name__ == '__main__':

    main()