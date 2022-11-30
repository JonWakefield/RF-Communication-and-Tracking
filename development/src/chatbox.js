import { updateRoverLocation } from './index';
export class Chatbox {
    constructor() {
        this.args = {
            chatBox: document.querySelector('.chatbox-container'),
            submitButton: document.querySelector('.submit-message'),
            toggleLoraState: document.querySelector('.toggle-lora-button'),
            toggleSerialMonitor: document.querySelector('.toggle-serial-monitor-button'),
            toggleCommsBeacon: document.querySelector('.toggle-comms-beacon-button')
        }

        this.loraState = false;
        this.commsBeaconState = false; // false = off, true = on
        this.messages = []; // stores message


    }


    // display function to display messages entered by user
    display() {

        const {chatBox, submitButton, toggleSerialMonitor, toggleLoraState, toggleCommsBeacon} = this.args;

        // add an event listener for the submit button
        submitButton.addEventListener('click', () => this.onSubmitButton(chatBox))

        // toggle lora active state:
        toggleLoraState.addEventListener('click', () => this.toggleLora(chatBox))


        // call toggleSerial if "activate lora is true":
        toggleSerialMonitor.addEventListener('click', () => this.getSerial(chatBox))

        // toggle (activate or deactive) the communication beacon:
        toggleCommsBeacon.addEventListener('click', () => this.activateCommsBeacon(chatBox))


        // allow user to send message from pressing enter key
        const node = chatBox.querySelector('input');
        // event listener for pressing enter
        node.addEventListener("keyup", ({key}) => {
            if (key == "Enter") {
                this.onSubmitButton(chatBox);
            }
        })

    }

    
    async getSerial(chatbox) {

        while (true) {

            // make sure lora is active first:
            if (this.loraState) {
                // wait here until we get a response
                const response = await fetch("http://127.0.0.1:5000/read-serial");
                
                // Once we get the response, execute this code:
                const jsonMessageResponse = await response.json();
                
                let jsStateObj = {state: jsonMessageResponse.state };
                const jsState = jsStateObj.state;

                if (jsState === 2) {
                    console.log("Received Tracking Data")
                    let messageResponse = { xCord: jsonMessageResponse.xvalue, yCord: jsonMessageResponse.yvalue};
                    console.log("X-cord is: " + messageResponse.xCord);
                    console.log("Y-cord is: " + messageResponse.yCord);
                    updateRoverLocation(messageResponse.xCord, messageResponse.yCord);

                } else {
                    console.log("Recieved Comms transmission")
                    let messageResponse = { name: "Rover", message: jsonMessageResponse.response , snr: jsonMessageResponse.snr, time: jsonMessageResponse.time };
                    console.log("messageresponse is " + messageResponse.message);
                    console.log("messageResponseTime is " + messageResponse.time);
                    console.log("The received SNR value is: " + messageResponse.snr);
                    this.messages.push(messageResponse);
                    this.updateChatText(chatbox);
                }
            }
            else {
                return 0;
            }
        }
    }

    // toggle the state of the lora (appearances only)
    toggleLora(chatbox) {
        this.loraState = !this.loraState;
    }

    // method used to activate or deactivate the communication beacon:
    activateCommsBeacon(chatbox) {
        // pass 1 or 0 to the backend (pyhton):
        this.commsBeaconState = !this.commsBeaconState // change beacon state with each function call, python will take care of the rest:

        fetch( 'http://127.0.0.1:5000/toggle-beacon', {
            method: 'POST',
            body: JSON.stringify(this.commsBeaconState),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        // get response back from python confirming everything was successful:
        .then(response => response.json())
        .then( response => {
            console.log(response);
        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
        });

    }

   

    // function grabs user inputted data, converts data to json -> passes to backend (python)
    onSubmitButton(chatbox) {

        var textField = chatbox.querySelector('.message_input');
        console.log(textField);
        let userTextInput = textField.value
        
        // check if entered text is empty:
        if (userTextInput === "") {
            return;
        }
        
        // send a post request to:  http://127.0.0.1:5000/receive
        fetch( 'http://127.0.0.1:5000/transmit', {
            method: 'POST',
            body: JSON.stringify( {message: userTextInput }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        }) 
        // // after sending post request, wait for response back:
        .then(r => r.json())
        .then(r => {
            let messageResponse = {message: r.sent , time: r.time};
            console.log("messageResponse Sent item base station is: " + messageResponse.message);
            console.log("messageResponseTime base station is: " + messageResponse.time);
            this.messages.push(messageResponse);
            this.updateChatText(chatbox)
            textField.value = ''
        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
        });
    }

    // function to update the text in the text box:
    updateChatText(chatbox) {
        var html = '';
        // let html_time = '';
        // go through all the messages we've stored:
        this.messages.slice().reverse().forEach(function(item) {

            // check who sent message (base or rover?)
            if (item.name === "Rover") {
                html += '<div class="messages__item messages__item--rover">' + 'Rover:&ensp;' + item.message + 
                '<div class="messages__time--rover">' + '[SNR:' + item.snr + '&ensp;' + item.time  + ']' + '</div>' + '</div>'
            }
            else {
                html += '<div class="messages__item messages__item--baseStation">' + 'Base Station:&ensp;' + item.message + 
                '<div class="messages__time--baseStation">' + item.time +  '</div>' + '</div>'
            }
        });
        // console.log(html_time);
        const chatmessage = chatbox.querySelector('.chatbox-chatlog'); // need to add this html element
        //console.log(html)
        chatmessage.innerHTML = html;

        

    }

}

// // creaet object to use the class:
// const chatbox = new Chatbox();
// chatbox.display();



// need to add method that gets response from python and automaticcally calls updateChatText:












// OLD METHODS:
 // toggleSerial(chatbox) {
    //     // function determines the state of the lora module.
    //     // passes value (1 or 0) to python
    //     // this.loraState = !this.loraState;
    //     const loraOnState = 1;
    //     const loraOffState = 0;
    
    //     // activate or deactivate lora module: Need to pass 1 or 0 to python
    //     if (this.loraState) {
    //         // if lora is active we need to re-enter this condition until this.loraState is false:

    //         fetch( 'http://127.0.0.1:5000/activate-serial', {
    //             method: 'POST',
    //             body: JSON.stringify( {state: loraOnState }),
    //             mode: 'cors',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //         })
    //         .then(r => r.json())
    //         .then(r => {
    //             let messageResponse = { name: "Rover", message: r.response , time: r.time };
    //             console.log("messageresponse is " + messageResponse.message);
    //             console.log("messageResponseTime is " + messageResponse.time);
    //             this.messages.push(messageResponse);
    //             this.updateChatText(chatbox)
    //             textField.value = ''
    //             // finally call toggleSerial again?
    //             //this.toggleSerial(chatbox) // is it that easy ? 
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //             this.updateChatText(chatbox)
    //             textField.value = ''
    //         }); 
    
    //     } else {
    //         // deactivate the module by passing a 0 to python
    //         fetch( 'http://127.0.0.1:5000/activate-lora', {
    //             method: 'POST',
    //             body: JSON.stringify( {state: loraOffState }),
    //             mode: 'cors',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //         }) 
    
    //     } 
    // }