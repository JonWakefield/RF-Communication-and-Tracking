# RF-Communication-and-Tracking

RF communication and tracking project using C++, Python, and JavaScript for communication, data processing, and user interface.

### Hardware:

###### The following list of hardware devices are used in conjuction with the Software.

- Arduino Uno: https://store-usa.arduino.cc/products/arduino-uno-rev3
- Raspberry Pi 4 b: https://www.raspberrypi.com/products/raspberry-pi-4-model-b/
- Sparkfun Bi-Directional Logic Level Shifters: https://www.sparkfun.com/products/12009
- Reyax RYLR998 Lora Transceiver: https://reyax.com/products/rylr998/
- PROTO-boards (bread boards)

### Software:

###### The software consists of three main languages:

- C++
- Python
- JavaScript

![image](https://github.com/JonWakefield/RF-Communication-and-Tracking/assets/67289517/c568bc47-1505-483c-8a2c-340e5bc4529b)

#### C++:

- C++ handles communication with the LoRa RF transciever and passes incoming serial data to Python via the USB Serial port.

#### JavaScript:

- JavaScript handles user input and passes all data to Python in standard JSON format.

#### User-Interface Photos

##### Full-User interface (not the prettiest :) )

![user-interface](photos/ui.png)

##### Example chat messages

![chat](photos/chat.jpg)

#### Python:

- Python handles communications between both UI and the Arduino Uno.
- Incoming data is processed, converted to JSON, and displayed on the UI.
- Out going data is serialized and sent to the Arduino for transmission.

![image](https://github.com/JonWakefield/RF-Communication-and-Tracking/assets/67289517/94a5096f-7382-4470-8065-1af1615b8f69)

## Communication Beacon:

The Communication beacon is a portable RF extension, used to increase the total reception and transmission range for RF communication.

#### Hardware:

Communication Beacon Hardware

![beacon](https://github.com/JonWakefield/RF-Communication-and-Tracking/assets/67289517/6c051aa0-5ef3-4143-be89-c61db153209e)

     - Raspberry Pi 4b
     - Reyax RYLR998 Lora Transceiver

#### Software:

Communication Beacon Flowchart:
![beacon_software](https://github.com/JonWakefield/RF-Communication-and-Tracking/assets/67289517/c668935e-2f6d-41d0-8b50-4c536bad6ba9)

## Tracking Beacon:

The tracking beacons are used to get RSSI measurements relative to the rovers position and send this data back to the basecamp for RF location
based tracking.

#### Hardware:

![tracking_beacon](https://github.com/JonWakefield/RF-Communication-and-Tracking/assets/67289517/455d63ca-7635-4a6b-96fe-d66a14003d52)

     - Arduino Uno (any arduino based uC would work).
     - Level Shifter
     - RF transceiver

#### Software:

![image](https://github.com/JonWakefield/RF-Communication-and-Tracking/assets/67289517/ee2af4c3-a843-4917-9193-35ac9e44910d)

     - C++

If you have any additional questions or comments regarding this project, please feel free to reach out to me at jonwakefield.mi@gmail.com
