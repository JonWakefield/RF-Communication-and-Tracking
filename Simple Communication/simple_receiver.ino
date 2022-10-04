// simple receiver program: 
// module will print any received data to serial monitor
 
String lora_band = "915000000"; // check this lines up with TX program
String lora_networkid = "5";    //enter Lora Network ID
String lora_address = "2";      //enter Lora address
String lora_RX_address = "1";   //enter Lora RX address (for sending)

String incomingString;

void setup()
{
  
  Serial.begin(115200);
  delay(1500);
  Serial.println("AT+BAND=" + lora_band);
  delay(500);
  Serial.println("AT+NETWORKID=" + lora_networkid);
  delay(500);
  Serial.println("AT+ADDRESS=" + lora_address);
  delay(1000);
  
}

void loop()
{ 
    if(Serial.available()) {
    incomingString = Serial.readString();
    Serial.println(incomingString);
    
    }
}
