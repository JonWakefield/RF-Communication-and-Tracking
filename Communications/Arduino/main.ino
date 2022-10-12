// upload code to arduino, use button on breadboard to send data to second module
// Have RF modules communicate through software serial
// communicate from python to arduino using regular serial
#include <SoftwareSerial.h>



// location of software serial pins:
// set up softwareserial
SoftwareSerial mySerial(2, 3);

// define global variables:
String lora_band = "915000000"; //enter band as per your country
String lora_networkid = "5";    //enter Lora Network ID
String lora_address = "1";      //enter Lora address
String lora_RX_address = "2";   //enter Lora RX address
String lora_baud = "9600";
String byte_length;
String message;
String garbage;
int first_transmit_message = 0;
String incoming_string;
String incoming_string_2;
String check_reception_string = "d:";
String check_reception_length = "2";
#define transmit_button 11
#define everything_button 12
int x = 0;

void setup()
{
  delay(1000);
  Serial.println("setting up module");
  Serial.begin(9600);
  mySerial.begin(9600);


  // set-up the lora here:
  Serial.println("starting lora setup");
  mySerial.println("AT+BAND=" + lora_band);
  delay(1000);
  mySerial.println("AT+ADDRESS=" + lora_address);
  delay(1000);
  mySerial.println("AT+IPR=" + lora_baud);
  delay(500);
  mySerial.println("AT+NETWORKID=" + lora_networkid);
  delay(500);
  pinMode(transmit_button, INPUT);
  pinMode(everything_button, INPUT);

}

// function receives the length of the message
String message_length() {

  Serial.println("ready 0"); //inform python we are ready to receive data
  // wait here tell we are ready
  while (!Serial.available()) {
  }
  // enter while loop once we have sent data from python
  while (Serial.available())
  {
    if (Serial.available() > 0)
    {
      byte_length = Serial.readString();
      Serial.println("byte_length = " + byte_length);
      //      Serial.println("confirm : " + byte_length); //in future use this line to confirm that the correct data was received
      Serial.println("confirm"); // let python know we received the data
      return byte_length;
    }
  }

}
// function receives user input from python
String message_input() {
  //
  Serial.println("ready 1"); // inform python we are ready to receive the message
  // wait here until we send data from python:
  while (!Serial.available()) {
  }
  // enter here once data has been successful been sent from python
  while (Serial.available())
  {
    if (Serial.available() > 0)
    {
      message = Serial.readString();  //gets one byte from serial buffer
      Serial.println("message = " + message);
      //      Serial.println("confirm : " + message); //in future use this line to confirm that the correct data was received
      Serial.println("confirm"); //let python know we received data
      return message;
    }
  }

}

void change_lora_rx_address() {
  // change lora address for add / removing comms beacon

  String beacon_1_activate;

  Serial.println("ready B");

  // wait here tell user selectes add or remove:
  while (!Serial.available()) {

  }
  while (Serial.available()) {
    // read in user decision:
    if (Serial.available() > 0) {
      beacon_1_activate = Serial.readString(); // read in user input
      Serial.println("Received option for beacon: " + beacon_1_activate); // display user selection
    }
  }
  // change lora address if neccessary:
  if (beacon_1_activate == "1") {
    // activate beacon:
    Serial.println("Activating Communication Beacon!");
    lora_RX_address = "3"; // can change these values before d-day
  }
  else if (beacon_1_activate == "2") {
    // deactivate beacon:
    Serial.println("Deactivating Communication Beacon!");
    lora_RX_address = "2"; // can change these values before d-day
  }
  else if (beacon_1_activate == "N") {
    Serial.println("Incorrect input... returning...");
    return;
  }
  Serial.println("Sending to RX address: " + lora_RX_address );
}

void everything_button_selection() {
  // function deals with the different possible user inputs from the everything_menu (python)

  // read in serial input comming ffrom python. wait here until available:
  String user_selection;
  while (!Serial.available()) {
  }
  while (Serial.available()) {
    // get user input from python,
    // take action depending on input
    if (Serial.available() > 0) {
      user_selection = Serial.readString(); // read in user input
      Serial.println("User selected option: " + user_selection); // display user selection
      // we won't send options over that are invalid, so no need to worry about it (will be taken care of in python)
      Serial.end(); // clear serial buffer
      delay(50);
    }
  }
  Serial.begin(9600); // re initilize the serial buffer
  // first option: transmit message
  if (user_selection == "1") {
    Serial.println("Getting message...");
    message = message_input();
    byte_length = message_length();
  }
  // second option: activate / deactivate comms beacon:
  else if (user_selection == "2") {
    change_lora_rx_address();
  }
  else if (user_selection == "N") {
    Serial.println("Returning to Loop...");
    return;
  }
}


void confirmation_message_transmit() {
  // function sends back a confirmation message to the sender
  Serial.println("sending confirmation back...");
  delay(1000);
  mySerial.println("AT+SEND=" + lora_RX_address + "," + check_reception_length + "," + check_reception_string);
}

void loop()
{
  // enter conditional when we want to transmit the message, by pressing button
  if (digitalRead(everything_button) == HIGH ) {
    // in process of chaning conditional to feature 'everything_button'
    // will need to change what takes place inside of here,
    // will need to change lora_RX_address depending on if comms beacon is active
    Serial.println("every");
    everything_button_selection();
    Serial.println("Exiting the Everything Menu...");
    // for now, pause module allowing operator to give power to the lora
    delay(50);
  }


  // when button one goes high; send data
  if (digitalRead(transmit_button) == HIGH) {
    Serial.println("transmitting...");
    mySerial.println("AT+SEND=" + lora_RX_address + "," + byte_length + "," + message); //send data string
    delay(50);
  }

  // print any received data
  if (mySerial.available()) {

    Serial.println("serial available");
    incoming_string = mySerial.readString();

    Serial.println(incoming_string);
    
    // after we recevied a message, send confirmation back to original transmitter:
//    if (incoming_string.startsWith("+RCV")) {
//      
//      confirmation_message_transmit();
//    }

  if (Serial.available()) {
    incoming_string_2 = Serial.readString();
    Serial.println("in serial avaiable statement");
    confirmation_message_transmit();
  }

    
  }
}