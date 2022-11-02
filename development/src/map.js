// move file to modules.js once finish setting it up
// ---- How the Plot Works ----
// Red Dots ==> Beacons
// Blue dot / line==> Rover
// Purple dot ==> Home base (?)

// Cool features to add:
// When communication beacon goes live, add dot to map



// lets use example data from tracking.py for now:
// furthest point x: 2.36 km -> 2360
// furthest point y: 1.55 km -> 1550

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


export var trackingBeaconDots = {
    // x: [1st beacon, 2nd beacon, 3rd beacon]
    // y: [1st beacon, 2nd beacon, 3rd beacon]
    x: [1250, 1280, 2000], //1979.493
    y: [550, 1080, 700], //708.1
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

// function updateBeaconMap(beaconNum, )

// export function updateBeaconLocation() {
//     // get DOM elements:
//     const beacon1Button = document.getElementById('beacon1Update');
//     const beacon2Button = document.getElementById('beacon2Update');
//     const beacon3Button = document.getElementById('beacon3Update');

//     // add event listeners:
//     beacon1Button.addEventListener('click', () => )
//     beacon2Button.addEventListener('click', () =>)
//     beacon3Button.addEventListener('click', () =>)

// }