import Plotly from 'plotly.js-basic-dist'
import { Chatbox } from './chatbox';
import { maxAndMinDots, trackingBeaconDots, homeBaseDot, layout, updateBeaconLocation} from './map';


// create chatbox object:
const chatbox = new Chatbox();
chatbox.display();

// create inital dataset:
let data = [maxAndMinDots, homeBaseDot, trackingBeaconDots];
// Rover tracking:
Plotly.newPlot('map-body', data, layout);



// TEMPORARY: UPDATE MAP BASED UPON USER-INPUT -> give to python
const timeSubmitButton = document.querySelector('.submit-times');


function updateRoverLocation(roverXLocation, roverYLocation) {

    // we have (x,y) location of rover... all we need to do is update map:
    var roverLocation = {
        x: [roverXLocation],
        y: [roverYLocation],
        mode: "markers",
        markers: {
            color: 'rgb(255, 153, 0)',
            sizes: 18
        },
        name: "Rover"
    };
    data = [maxAndMinDots, homeBaseDot, trackingBeaconDots, roverLocation];

    // update map here:
    Plotly.react('map-body', data, layout);


}


function submitTimes(submitButton) {

    // add event listener
    submitButton.addEventListener('click', () => {
        console.log("made it into vent listener")
        // get input values
        let timeOne = document.getElementById("beacon1time")
        let timeTwo = document.getElementById('beacon2time');
        let timeThree = document.getElementById('beacon3time');

        console.log(timeTwo);
        console.log(timeThree);

        // send fetch request to get back beacon (x,y) values:
        fetch( 'http://127.0.0.1:5000/tracker-update', {
            method: 'POST',
            body: JSON.stringify( {time1: timeOne.value, 
                time2: timeTwo.value, 
                time3: timeThree.value}),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(r => r.json())
        .then( r => {
            let locationResponse = {xvalue: r.xvalue, yvalue: r.yvalue}
            console.log(locationResponse.xvalue);
            console.log(locationResponse.yvalue);
            let roverX = locationResponse.xvalue;
            let roverY = locationResponse.yvalue;
            updateRoverLocation(roverX, roverY);
            // clear input field on DOM
            timeOne.value = '';
            timeTwo.value = '';
            timeThree.value = '';
        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
        });
    })
}

submitTimes(timeSubmitButton);



updateBeaconLocation();














// mapState = false;

// function updateRoverLocation(roverXLocation, roverYLocation) {

//     // we have (x,y) location of rover... all we need to do is update map:
//     let roverLocation = {
//         x: [roverXLocation],
//         y: [roverYLocation],
//         mode: 'lines+markers',
//         markers: {
//             color: 'rgb(135, 206, 235)',
//             sizes: 8
//         },
//         line: {
//             color: 'rgb(135, 206, 235)', // 
//             width: 1
//         },
//         name: "Rover"
//     };
//     data = [maxAndMinDots, homeBaseDot, trackingBeaconDots, roverLocation];

//     // update map here:
//     Plotly.react('map-body', data, layout);


// }

// // Update the map here:
// function updateMap() {
//     var activateMap = document.querySelector('.toggle-tracker-button');

//     // add an event listener:
//     activateMap.addEventListener('click', async () => {
//         console.log("Yup it worked");
//         mapState = !mapState; // update state of map

//         while (true) {
//             if (mapState) {
//                 // what do we want to do here?
//                 // inf. async while loop // similar to getSerial();

//                 // we will wait here until any data becomes available:
//                 const trackerUpdateResponse = await fetch("http://127.0.0.1:5000/tracker-update");

//                 // extract json data:
//                 const trackerUpdate = trackerUpdateResponse.json();
//                 let locationInfo = {name: "Rover", xLocation: trackerUpdate.x, yLocation: trackerUpdate.y}
//                 roverXLocation = locationInfo.xLocation;
//                 roverYLocation = locationInfo.yLocation;
//                 // call function here to updateMap();
//                 updateRoverLocation(roverXLocation, roverYLocation);

//             }
//             else {
//                 return 0;
//             }

//         }
        
//     });

// } 

// updateMap();

// Working plot:
// Plotly.newPlot('map-body', data, {
//     images: [
//         {
//             "source": "https://raw.githubusercontent.com/JonWakefield/RF-Communication-and-Tracking/main/images/empty/campus_map.png",
//             "xref": "x",
//             "yref": "y",
//             "x": 0,
//             "y": 1550,
//             "sizex": 2360,
//             "sizey": 1550,
//             "sizing": "stretch",
//             "opacity": 1,
//             "layer": "below"
//         },
//       ],
//       margin: {
//         t: 0, //top margin
//         l: 0, //left margin
//         r: 0, //right margin
//         b: 0 //bottom margin
//     },
//   })