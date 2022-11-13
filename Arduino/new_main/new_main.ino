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
String message_byte_length;
String beacon_state;
String message;
int first_transmit_message = 0;
String incoming_string_serial;
String incoming_string_myserial;
String check_reception_string = "d:";
String check_reception_length = "2";
#define transmit_button 11
#define everything_button 12
int x = 0;

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
  mySerial.println("AT+IPR=" + lora_baud);
  delay(100);
  mySerial.println("AT+NETWORKID=" + lora_networkid);
  delay(100);
  pinMode(transmit_button, INPUT);
  pinMode(everything_button, INPUT);
}

void transmit(String message, String message_length) {

  Serial.println("transmitting...");
  mySerial.println("AT+SEND=" + lora_RX_address + "," + message_length + "," + message); //send data string
  delay(75);

}

// function receives user input from python
String message_input() {
  //
  Serial.println("^T"); // inform python we are ready to receive the message
  // wait here until we send data from python:
  while (!Serial.available()) {
  }
  // enter here once data has been successful been sent from python
  while (Serial.available())
  {
    if (Serial.available() > 0)
    {
      message = Serial.readString();
      Serial.println("message = " + message);
      //      Serial.println("confirm : " + message); //in future use this line to confirm that the correct data was received
      Serial.println("confirm"); //let python know we received data
      return message;
    }
  }

}

// change RX address of transmission
void beacon_setup() {

  // write back to python confirming we are ready for beacon state change
  Serial.println("^B");

  while (!Serial.available()) {
  }
  // enter here once data has been successful been sent from python
  while (Serial.available()) {
    if (Serial.available() > 0) {
      beacon_state = Serial.readString();
      Serial.println("beacon state is = " + beacon_state);
      Serial.println("confirm"); //let python know we received data
    }
  }
  // determine if we need to change the lora address:
  if (beacon_state == "[True]") {
    // activate beacon:
    Serial.println("Activating Communication Beacon!");
    lora_RX_address = "3"; // can change these values before d-day
  }
  else if (beacon_state == "[False]") {
    // deactivate beacon:
    Serial.println("Deactivating Communication Beacon!");
    lora_RX_address = "2"; // can change these values before d-day
  }
  Serial.println("Sending to RX address: " + lora_RX_address );
}
void menu(String serial_data) {
  // if myserial recieved any data, pass it to python:

  // conditional checks in order:
  // ^T : User wants to transmit a message
  // ^B : User wants to activate or deativate the beacon


  if (serial_data == "^T") {
    // transmit message conditional:

    // send alert back to python, confirming we received the "^T":
    message = message_input();

    // get the byte length of the message
    message_byte_length = message.length();

    // transmit the message
    transmit(message, message_byte_length);
  }
  else if (serial_data == "^B") {
    // call beacon_setup()
    beacon_setup();

  }



}



void loop()
{
  if (Serial.available()) {
    // read in the string
    Serial.println("Serial available");
    incoming_string_serial = Serial.readString();

    //    Serial.println(incoming_string_serial);
    // call menu to decide what's next
    menu(incoming_string_serial);

  }
  if (mySerial.available()) {
    // if mySerial avaiable, it is a transmission from an rf unit, so send it to python
    Serial.println("transmission available");
    incoming_string_myserial = mySerial.readString();

    Serial.println(incoming_string_myserial);

  }
}

// data in mySerial should be:
// 1 A Message
// 2 An error message

// data in serial channel could be:
// python input
