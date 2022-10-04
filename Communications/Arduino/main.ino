// upload code to arduino, use button on breadboard to send data to second module


String lora_band = "915000000"; //enter band as per your country
String lora_networkid = "5";    //enter Lora Network ID
String lora_address = "1";      //enter Lora address
String lora_RX_address = "2";   //enter Lora RX address
String byte_length;
String message;
String garbage;
int transmit_message = 0;
String incoming_string;
#define transmit_button 10  

   
void setup()
{
  delay(1000);
  Serial.begin(115200);
  pinMode(transmit_button, INPUT);

}

void setup_lora() {
  // set-up the lora here:
  Serial.println("starting lora setup");
 
  Serial.println("AT+BAND=" + lora_band);
  delay(1000);
  Serial.println("AT+ADDRESS=" + lora_address);
  delay(1000);
  Serial.println("AT+NETWORKID=" + lora_networkid);
  delay(1500);
}

// function receives the length of the message
String message_length() {
 
  Serial.println("ready 0"); //inform python we are ready to receive data
  // wait here tell we are ready 
  while(!Serial.available()) {
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
  while(!Serial.available()) {
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
void loop()
{
  // enter conditional when we want to transmit the message
  if (transmit_message == 0 ) {
    message = message_input(); // 
    byte_length = message_length(); // 
    transmit_message = 1; // change to one -> return to 0 on button press(?)
    // for now, pause module allowing operator to give power to the lora
    Serial.println("pausing");
    delay(6000);
    setup_lora(); // setup the lora module after it has received power
  }
  delay(50);

  
  // when button one goes high; send data
   if (digitalRead(transmit_button) == HIGH){
    Serial.println("AT+SEND="+ lora_RX_address +"," + byte_length + "," + message); //send data string
    delay(50);
    Serial.println("confirm 3");
   }
   
   // print any received data
   if (Serial.available()){

//     garbage = Serial.readString();
     
     incoming_string = Serial.readString();
     Serial.println(incoming_string);
   }
}
