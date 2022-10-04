// simple test program to confirm both modules are sending and receiving data
// upload code to arduino, use button on breadboard to send data to second module


String lora_band = "915000000"; //enter band as per your country
String lora_networkid = "5";    //enter Lora Network ID
String lora_address = "1";      //enter Lora address
String lora_RX_address = "2";   //enter Lora RX address

#define button1 10  

   
void setup()
{
  delay(1000);
  Serial.begin(115200);

  
  
  Serial.println("AT+BAND=" + lora_band);
  delay(1000);
  Serial.println("AT+ADDRESS=" + lora_address);
  delay(1000);
  Serial.println("AT+NETWORKID=" + lora_networkid);
  delay(1500);


  pinMode(button1, INPUT);

}

void loop()
{
  // when button one goes high; send data
   if (digitalRead(button1) == HIGH){
    Serial.println("AT+SEND="+ lora_RX_address +",2,hi");
    delay(50);
   } 
}
