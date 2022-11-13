import Plotly from 'plotly.js-basic-dist'

// move file to modules.js once finish setting it up
// ---- How the Plot Works ----
// Red Dots ==> Beacons
// Blue dot / line==> Rover
// Purple dot ==> Home base (?)


// Cool features to add:
// When communication beacon goes live, add dot to map



// lets use example data from tracking.py for now:
// furthest point x: 2.36 km -> 2360
// furthest point y: 3.55 km -> 1550



// could hard code location of beacons into javascript:
export var maxAndMinDots = {
    x: [0, 2360],
    y: [0, 1550],
    mode: 'markers',
    markers: {
        color: 'rgba(0,0,0,0)',
        size: 0.5
    }
};

// global vars for beacon location
let beacon1X = 1280;
let beacon1Y = 1080;
let beacon2X = 1250;
let beacon2Y = 550;
let beacon3X = 2000;
let beacon3Y = 700;

export let trackingBeaconDots = {
    // x: [1st beacon, 2nd beacon, 3rd beacon]
    // y: [1st beacon, 2nd beacon, 3rd beacon]
    x: [beacon2X, beacon1X, beacon3X], //1979.493
    y: [beacon2Y, beacon1Y, beacon3Y], //708.1
    mode: 'markers',
    marker: {
        color: 'rgb(255, 153, 0)',
        size: 12
    },
    name: "TrackingBeacon"
};

export var homeBaseDot = {
    x: [1947.3],
    y: [958],
    mode: "markers",
    marker: {
        color: 'rgb(128, 0, 128)',
        size: 12
    },
    name: "HomeBase"
};

export var roverLocation = {
    // need the data from arduino 
    // need to turn into an aync get HTTP method
    x: [1],
    y: [2],
    mode: 'lines+markers',
    markers: {
        color: 'rgb(135, 206, 235)',
        sizes: 8
    },
    line: {
        color: 'rgb(135, 206, 235)', // 
	    width: 1
    },
    name: "Rover"
};


export var data = [maxAndMinDots, homeBaseDot, trackingBeaconDots, roverLocation];

export var layout = {
    images: [
        {
            "source": "https://raw.githubusercontent.com/JonWakefield/RF-Communication-and-Tracking/main/images/campus_map.png",
            "xref": "x",
            "yref": "y",
            "x": 0,
            "y": 1550,
            "sizex": 2360,
            "sizey": 1550,
            "sizing": "stretch",
            "opacity": 1,
            "layer": "below"
        },
      ],
    xaxis: {
        zeroline: false,
        visible: false
    },
    yaxis: {
        zeroline: false,
        visible: false
    },
    showlegend: false,
    margin: {
        t: 25, //top margin
        l: 0, //left margin
        r: 0, //right margin
        b: 0 //bottom margin
    },
    title: 'Rover Tracking',
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
};

// Plotly.newPlot('map-body', data, layout);


// update beacons:




function updateBeaconMap(beaconNum, xLocation, yLocation) {
    // find which beacon to update

    // console.log("made it into update beacon map");

    if(beaconNum === 1) {
        // update beacon locations:
        beacon1X = xLocation;
        beacon1Y = yLocation;

        let trackingBeaconDots = {
            // x: [1st beacon, 2nd beacon, 3rd beacon]
            // y: [1st beacon, 2nd beacon, 3rd beacon]
            x: [beacon2X, beacon1X, beacon3X], //1979.493
            y: [beacon2Y, beacon1Y, beacon3Y], //708.1
            mode: 'markers',
            marker: {
                color: 'rgb(255, 153, 0)',
                size: 12
            },
            name: "TrackingBeacon"
        };

        let data = [maxAndMinDots, homeBaseDot, trackingBeaconDots];
        // update map here:
        Plotly.react('map-body', data, layout);
        return

    } else if (beaconNum === 2) {
        // update beacon locations:
        beacon2X = xLocation;
        beacon2Y = yLocation;

        let trackingBeaconDots = {
            // x: [1st beacon, 2nd beacon, 3rd beacon]
            // y: [1st beacon, 2nd beacon, 3rd beacon]
            x: [beacon2X, beacon1X, beacon3X], //1979.493
            y: [beacon2Y, beacon1Y, beacon3Y], //708.1
            mode: 'markers',
            marker: {
                color: 'rgb(255, 153, 0)',
                size: 12
            },
            name: "TrackingBeacon"
        };

        let data = [maxAndMinDots, homeBaseDot, trackingBeaconDots];
        // update map here:
        Plotly.react('map-body', data, layout);
        return

    } else if(beaconNum === 3) {
        // update beacon locations:
        beacon3X = xLocation;
        beacon3Y = yLocation;

        let trackingBeaconDots = {
            // x: [1st beacon, 2nd beacon, 3rd beacon]
            // y: [1st beacon, 2nd beacon, 3rd beacon]
            x: [beacon2X, beacon1X, beacon3X], //1979.493
            y: [beacon2Y, beacon1Y, beacon3Y], //708.1
            mode: 'markers',
            marker: {
                color: 'rgb(255, 153, 0)',
                size: 12
            },
            name: "TrackingBeacon"
        };

        let data = [maxAndMinDots, homeBaseDot, trackingBeaconDots];
        // update map here:
        Plotly.react('map-body', data, layout);
        return

    }

    
    
}

export function updateBeaconLocation() {
    // get DOM elements:
    const beacon1Button = document.getElementById('beacon1Update');
    const beacon2Button = document.getElementById('beacon2Update');
    const beacon3Button = document.getElementById('beacon3Update');

    // add event listeners:
    beacon1Button.addEventListener('click', () => {
        // get values from input boxes:
        let beacon1X = document.getElementById('beacon1x');
        let beacon1Y = document.getElementById('beacon1y');
        let beacon1XValue = beacon1X.value;
        let beacon1YValue = beacon1Y.value;
        console.log(beacon1XValue);
        console.log(beacon1YValue);

        // updateBeaconMap
        updateBeaconMap(1, beacon1XValue, beacon1YValue);
        // clear values on DOM
        beacon1X.value = '';
        beacon1Y.value = '';



    })

    beacon2Button.addEventListener('click', () => {
        // get values from input boxes:
        let beacon2X = document.getElementById('beacon2x');
        let beacon2Y = document.getElementById('beacon2y');
        let beacon2XValue = beacon2X.value;
        let beacon2YValue = beacon2Y.value;
        console.log(beacon2XValue);
        console.log(beacon2YValue);

        // updateBeaconMap
        updateBeaconMap(2, beacon2XValue, beacon2YValue);
        beacon2X.value = '';
        beacon2Y.value = '';


    })

    beacon3Button.addEventListener('click', () => {
        // get values from input boxes:
        let beacon3X = document.getElementById('beacon3x');
        let beacon3Y = document.getElementById('beacon3y');
        let beacon3XValue = beacon3X.value;
        let beacon3YValue = beacon3Y.value;
        console.log(beacon3XValue);
        console.log(beacon3YValue);

        // updateBeaconMap
        updateBeaconMap(3, beacon3XValue, beacon3YValue);
        beacon3X.value = '';
        beacon3Y.value = '';


    })

}