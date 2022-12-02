
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
String lora_address = "71";      //enter Lora address //CHANGE LINE AFTER PULL
String lora_RX_address = "35";   //enter Lora RX address // CHANGE LINE AFTER PULL
String lora_baud = "9600";
String byte_length;
String message;
String garbage;

//
unsigned long processingTimeStart = 0;
unsigned long processingTimeEnd = 0;
unsigned long totalProcessingTime = 0;
String lengthofProcessingTime;


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

// function used to send a respone back to the tof sender
void response_back() {
  // send a response back once we receive one from tof sender
  processingTimeEnd = millis();
  totalProcessingTime = processingTimeStart - processingTimeEnd;
  lengthofProcessingTime = String(totalProcessingTime).length();
  for (int i = 0; i < 5; i++) {
    mySerial.println("AT+SEND=" + lora_RX_address + ",1,X"); // send one byte response back
    delay(75);
  }
  Serial.println(totalProcessingTime);
  while (!mySerial.available()) {

  }
  if (mySerial.available()) {

    incoming_string = mySerial.readString();

    Serial.println(incoming_string);
  }

  Serial.println("Existing transmit function");

}



int ok_counter = 0; // count number of +OKs on startup
void loop()
{

  processingTimeStart = 0;
  processingTimeEnd = 0;
  totalProcessingTime = 0;
  lengthofProcessingTime = "";

  // print any received data
  if (mySerial.available()) {
    // the moment serial is available record millis
    processingTimeStart = millis();


    incoming_string = mySerial.readString();

    Serial.println(incoming_string);

    ok_counter++;

    // ---- determine if response from module or "+OK" here
    if (ok_counter > 1) {
      response_back();
    }
    // -----------------------------------------------------



  }
}


// PROGRAM OVERVIEW:
// 1. CHECK FOR RESPONSE
// 2. REMOVE PROCESSING DELAY
//
