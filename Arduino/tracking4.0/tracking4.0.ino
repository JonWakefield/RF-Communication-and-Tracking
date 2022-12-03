// ---------------- Program About -------------
// Name: Rover Tracker
// Author: Jon Wakefield
// Program Description: Cycle through tracking beacons,
//                      Once three responses have been received back,
//                      Send RSSI + beacon # back to base station (python)


#include <SoftwareSerial.h>

// location of software serial pins:
// set up softwareserial
SoftwareSerial mySerial(2, 3);



// ---- LORA VARIABLES ------
String lora_band = "915000000"; //enter band as per your country
String lora_networkid = "5";    //enter Lora Network ID
String lora_address = "35";      //enter Lora address
String lora_baud = "9600";
// -------------------------


// ------ GLOBAL VARIABLES --------
int timeValues[32]; // array to store tof values from basys
String incoming_string_myserial; // read in serial data from mySerial
String beacon1_address = "70";
String beacon2_address = "71";
String beacon3_address = "72";
String beacon4_address = "73";
String beacon5_address = "74";
String beacon6_address = "75";
String home_base_address = "36";
String beacon_order [6] = {beacon1_address, beacon2_address, beacon3_address, beacon4_address, beacon5_address, beacon6_address};
//String beacon_order [3] = {beacon1_address, beacon2_address, beacon3_address};
String beacon_rssi [6] = {"0", "0", "0", "0", "0", "0"}; // stores RSSI of beacon that gave us a response back
String beacon_received_number [6] = {"0", "0", "0", "0", "0", "0"}; // stores beacon # that gave us a response back
String received_rssi = "";
// --------------------------


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
  //  mySerial.println("AT+IPR=" + lora_baud);
  delay(100);
  mySerial.println("AT+NETWORKID=" + lora_networkid);
  delay(100);

}

/*
  void beacon_order_optimization() {
    // Decide which beacons to ping:
    // Assumptions & Rules:
    // 1. The previous 3 beacons we got a response from will be first
    // 2.


  } */


int check_if_pinged(int beacons_responded[6], int next_ping) {
  // Ensures we don't get two responses from the same beacon
  // Need to ensure next_ping is not in beacons_responded


  while (true) {
    for (int i = 0; i < 5; i++ ) {

      Serial.println(beacons_responded[i]);

      if (next_ping == beacons_responded[i]) {
        // this means we've already received a response from that beacon:
        if (next_ping < 5) {
          next_ping++;
          next_ping = check_if_pinged(beacons_responded, next_ping);
        }
        else {
          next_ping = 0;
          next_ping = check_if_pinged(beacons_responded, next_ping);
        }
      }
    }
    return next_ping;
  }
}


// transmit message:
int ping_beacons() {

  // ------ Local Variables ---------
  int ping_num = 0; // index num for beacon_order
  int received_response = 0;
  int sent_counter = 0; // Counts # of times a beacon is pinged. Reset on successfully response or if >= 2
  int total_responses_received = 0; // count tell 3 ->
  int cur_beacon_responded [6] = { -99, -99, -99, -99, -99, -99};
  int finished_cycle = 0;
  // --------------------------------

  for ( int i ; i < 5; i ++) {
    Serial.println(String(beacon_rssi[i]));
  }

  while (true) {
    // transmit message
    // Serial.println("transmitting in 2 seconds...");
    delay(1005);
    for (int i = 0; i < 5; i++) {
      mySerial.println("AT+SEND=" + beacon_order[ping_num] + ",1,y"); //send data string
      delay(50);
    }

    // wait here until we get the "+OK" out of the system
    while (!mySerial.available()) {
    }
    if (mySerial.available()) {

      incoming_string_myserial = mySerial.readString();

      //Serial.println(incoming_string_myserial);
    }


    // increment send counter:
    sent_counter++;

    // see if we get a response back
    received_response = response();


    // if we get a response back, enter:
    if (received_response) {

      // debug & testing:
      Serial.println("Received a Response from beacon: " + beacon_order[ping_num]);

      // store beacon number:
      beacon_received_number[total_responses_received] = beacon_order[ping_num];
      // store recieved rssi:
      beacon_rssi[total_responses_received] = received_rssi;

      // store current iteration so we don't reach out to same beacon twice if we have to loop back thru
      cur_beacon_responded[total_responses_received] = ping_num;

      total_responses_received++;

      // once we get three responses, exit
      if ((total_responses_received >= 3) & (finished_cycle)) {
        Serial.println("Recieved three responses...");
        //        return 1;
      }
      else {

        //Serial.println("contacting next beacon...");

        // reset and increment local variables:
        if ( ping_num < 5) {
          ping_num++;
          ping_num = check_if_pinged(cur_beacon_responded, ping_num);
          received_response = 0;
          sent_counter = 0;

        }
        else {
          // check if we should return here:
          if (total_responses_received >= 3) {
            Serial.println("Recieved three responses...");
            return 1;
          }
          else {
            ping_num = 0;
            finished_cycle = 1;
            received_response = 0;
            sent_counter = 0;
          }

        }
      }
    }
    // if we pinged same station >= 2:
    else if (sent_counter >= 2 ) {
      // could not connect to station, try new one
      Serial.println("Did not get a response from " + beacon_order[ping_num]);
      Serial.println("Trying next beacon");
      if ( ping_num < 5) {
        ping_num++;
        ping_num = check_if_pinged(cur_beacon_responded, ping_num);
        received_response = 0;
        sent_counter = 0;

      }
      else {
        // check if we should return here:
        if (total_responses_received >= 3) {
          Serial.println("Recieved three responses...");
          return 1;
        }
        else {
          ping_num = 0;
          finished_cycle = 1;
          received_response = 0;
          sent_counter = 0;
        }
      }


    }
    else {
      sent_counter++;
    }
  }
}


String parse_response(String response) {
  // Function Description: Parse recived response for the RSSI value:

  String trimed_response = "";

  //+RCV=70,10,4294966278,-47,10

  //Serial.println("Response:" + response);

  trimed_response = response.substring(12, 15);

  Serial.println("trimed:" + trimed_response);

  return trimed_response;

}


int response() {
  // get response back from beacon:
  // Need to factor in chance we get no response (asynchrounously)

  // first: get current millis time:
  unsigned long currentMillis = millis();
  unsigned long currentDelay = 1200; // how long we will wait for a response from a beacon before moving on:

  String reponse_RSSI = "";

  while (true) {

    // if we receive a response, enter:
    if (mySerial.available()) {

      // read in and print value:
      incoming_string_myserial = mySerial.readString();
      //Serial.println(incoming_string_myserial);

      // Need to parse response for RSSI value here:
      received_rssi = parse_response(incoming_string_myserial);



      return 1;
    }

    // if we don't receive a response in currentDelay seconds, enter:
    if (millis() > (currentDelay + currentMillis)) {
      // Serial.println("Did not get a response");
      return 0; // return 0;
    }
  }
}


void transmit_home() {
  // Function Description: Once we have received three responses from beacons,
  // Send Beacon # and RSSI values back to home base,

  String values_to_transmit = "";
  String values_length = "";
  String delimiter = "[";

  // DEBUG & TESTING:: CHECK VALUES ARE CORRECT:
  //  for(int i = 0; i < 3; i++) {
  //    Serial.println("Recieved RSSI value " + beacon_rssi[i] + " from beacon " + beacon_received_number[i] );
  //  }


  Serial.println("In transmit_home");
  // To help speed up transmission process, store all RSSI & beacon #'s in single string:
  for (int i = 0; i < 5; i++) {
    if (beacon_rssi[i] != "0") {
      values_to_transmit = values_to_transmit + beacon_rssi[i] + delimiter + beacon_received_number[i] + delimiter;
    }
  }

  Serial.println("Values to transmit:" + values_to_transmit);

  values_length = values_to_transmit.length(); // get length of transmission

  // Send to home base:
  Serial.println("transmitting home in 1 seconds...");
  delay(1005);
  mySerial.println("AT+SEND=" + home_base_address + "," + values_length + "," + values_to_transmit); //send data string
  delay(105);

  // wait here until we get the "+OK" out of the system
  while (!mySerial.available()) {
  }
  if (mySerial.available()) {

    incoming_string_myserial = mySerial.readString();

    Serial.println(incoming_string_myserial);
  }

}

void reset_arrays() {

  for (int i = 0; i < 5; i ++) {
    beacon_rssi[i] = "0";
    beacon_received_number[i] = "0";
  }

}


// --- GLOBAL VARIABLES: GENERAL ---
int transmit_to_hb = 0;
// ------------------------

void loop()
{

  //  1. Decide which Beacons to Ping (1 thru n)


  //  2. Ping Beacon
  transmit_to_hb = ping_beacons();

  //  3. Send RSSI + BEACON #'s back to home base:
  if (transmit_to_hb) {

    transmit_home();

    transmit_to_hb = 0; // reset


  }

  // 4. Reset:
  reset_arrays();

  // 7. Repeat Process:


}



// To-Do:
// Ensure we don't reach out to same beacon twice
//




// Program Process:

//  1. Decide which Beacons to ping (1 through n)

//  2. Ping Beacon [DONE]

//  3. Wait n seconds for resposne [DONE]

//  4. Parse Response for address & RSSI value [DONE]

//  5. Repeat steps 2 - 5 until we have three responses. [DONE]

//  6. Send RSSI + address back to base station. [DONE]

//  7. Restart Program [DONE]
