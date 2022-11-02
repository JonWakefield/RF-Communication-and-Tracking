/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/plotly.js-basic-dist/plotly-basic.js":
/*!***********************************************************!*\
  !*** ./node_modules/plotly.js-basic-dist/plotly-basic.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/***/ }),

/***/ "./src/chatbox.js":
/*!************************!*\
  !*** ./src/chatbox.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Chatbox\": () => (/* binding */ Chatbox)\n/* harmony export */ });\n\r\n\r\nclass Chatbox {\r\n    constructor() {\r\n        this.args = {\r\n            chatBox: document.querySelector('.chatbox-container'),\r\n            submitButton: document.querySelector('.submit-message'),\r\n            toggleLoraState: document.querySelector('.toggle-lora-button'),\r\n            toggleSerialMonitor: document.querySelector('.toggle-serial-monitor-button'),\r\n            toggleCommsBeacon: document.querySelector('.toggle-comms-beacon-button')\r\n        }\r\n\r\n        this.loraState = false;\r\n        this.commsBeaconState = false; // false = off, true = on\r\n        this.messages = []; // stores message\r\n\r\n\r\n    }\r\n\r\n\r\n    // display function to display messages entered by user\r\n    display() {\r\n\r\n        const {chatBox, submitButton, toggleSerialMonitor, toggleLoraState, toggleCommsBeacon} = this.args;\r\n\r\n        // add an event listener for the submit button\r\n        submitButton.addEventListener('click', () => this.onSubmitButton(chatBox))\r\n\r\n        // toggle lora active state:\r\n        toggleLoraState.addEventListener('click', () => this.toggleLora(chatBox))\r\n\r\n\r\n        // call toggleSerial if \"activate lora is true\":\r\n        toggleSerialMonitor.addEventListener('click', () => this.getSerial(chatBox))\r\n\r\n        // toggle (activate or deactive) the communication beacon:\r\n        toggleCommsBeacon.addEventListener('click', () => this.activateCommsBeacon(chatBox))\r\n\r\n\r\n        // allow user to send message from pressing enter key\r\n        const node = chatBox.querySelector('input');\r\n        // event listener for pressing enter\r\n        node.addEventListener(\"keyup\", ({key}) => {\r\n            if (key == \"Enter\") {\r\n                this.onSubmitButton(chatBox);\r\n            }\r\n        })\r\n\r\n    }\r\n\r\n    \r\n    async getSerial(chatbox) {\r\n\r\n        while (true) {\r\n\r\n            // make sure lora is active first:\r\n            if (this.loraState) {\r\n                // wait here until we get a response\r\n                const response = await fetch(\"http://127.0.0.1:5000/read-serial\");\r\n                \r\n                // Once we get the response, execute this code:\r\n                const jsonMessageResponse = await response.json();\r\n                let messageResponse = { name: \"Rover\", message: jsonMessageResponse.response , snr: jsonMessageResponse.snr, time: jsonMessageResponse.time };\r\n                console.log(\"messageresponse is \" + messageResponse.message);\r\n                console.log(\"messageResponseTime is \" + messageResponse.time);\r\n                console.log(\"The received SNR value is: \" + messageResponse.snr);\r\n                this.messages.push(messageResponse);\r\n                this.updateChatText(chatbox)\r\n\r\n            }\r\n            else {\r\n                return 0;\r\n            }\r\n        }\r\n    }\r\n\r\n    // toggle the state of the lora (appearances only)\r\n    toggleLora(chatbox) {\r\n        this.loraState = !this.loraState;\r\n    }\r\n\r\n    // method used to activate or deactivate the communication beacon:\r\n    activateCommsBeacon(chatbox) {\r\n        // pass 1 or 0 to the backend (pyhton):\r\n        this.commsBeaconState = !this.commsBeaconState // change beacon state with each function call, python will take care of the rest:\r\n\r\n        fetch( 'http://127.0.0.1:5000/toggle-beacon', {\r\n            method: 'POST',\r\n            body: JSON.stringify(this.commsBeaconState),\r\n            mode: 'cors',\r\n            headers: {\r\n                'Content-Type': 'application/json'\r\n            },\r\n        })\r\n        // get response back from python confirming everything was successful:\r\n        .then(response => response.json())\r\n        .then( response => {\r\n            console.log(response);\r\n        }).catch((error) => {\r\n            console.error('Error:', error);\r\n            this.updateChatText(chatbox)\r\n            textField.value = ''\r\n        });\r\n\r\n    }\r\n\r\n   \r\n\r\n    // function grabs user inputted data, converts data to json -> passes to backend (python)\r\n    onSubmitButton(chatbox) {\r\n\r\n        var textField = chatbox.querySelector('.message_input');\r\n        console.log(textField);\r\n        let userTextInput = textField.value\r\n        \r\n        // check if entered text is empty:\r\n        if (userTextInput === \"\") {\r\n            return;\r\n        }\r\n        \r\n        // send a post request to:  http://127.0.0.1:5000/receive\r\n        fetch( 'http://127.0.0.1:5000/transmit', {\r\n            method: 'POST',\r\n            body: JSON.stringify( {message: userTextInput }),\r\n            mode: 'cors',\r\n            headers: {\r\n                'Content-Type': 'application/json'\r\n            },\r\n        }) \r\n        // // after sending post request, wait for response back:\r\n        .then(r => r.json())\r\n        .then(r => {\r\n            let messageResponse = {message: r.sent , time: r.time};\r\n            console.log(\"messageResponse Sent item base station is: \" + messageResponse.message);\r\n            console.log(\"messageResponseTime base station is: \" + messageResponse.time);\r\n            this.messages.push(messageResponse);\r\n            this.updateChatText(chatbox)\r\n            textField.value = ''\r\n        }).catch((error) => {\r\n            console.error('Error:', error);\r\n            this.updateChatText(chatbox)\r\n            textField.value = ''\r\n        });\r\n    }\r\n\r\n    // function to update the text in the text box:\r\n    updateChatText(chatbox) {\r\n        var html = '';\r\n        // let html_time = '';\r\n        // go through all the messages we've stored:\r\n        this.messages.slice().reverse().forEach(function(item) {\r\n\r\n            // check who sent message (base or rover?)\r\n            if (item.name === \"Rover\") {\r\n                html += '<div class=\"messages__item messages__item--rover\">' + 'Rover:&ensp;' + item.message + \r\n                '<div class=\"messages__time--rover\">' + '[SNR:' + item.snr + '&ensp;' + item.time  + ']' + '</div>' + '</div>'\r\n            }\r\n            else {\r\n                html += '<div class=\"messages__item messages__item--baseStation\">' + 'Base Station:&ensp;' + item.message + \r\n                '<div class=\"messages__time--baseStation\">' + item.time +  '</div>' + '</div>'\r\n            }\r\n        });\r\n        // console.log(html_time);\r\n        const chatmessage = chatbox.querySelector('.chatbox-chatlog'); // need to add this html element\r\n        //console.log(html)\r\n        chatmessage.innerHTML = html;\r\n\r\n        \r\n\r\n    }\r\n\r\n}\r\n\r\n// // creaet object to use the class:\r\n// const chatbox = new Chatbox();\r\n// chatbox.display();\r\n\r\n\r\n\r\n// need to add method that gets response from python and automaticcally calls updateChatText:\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n// OLD METHODS:\r\n // toggleSerial(chatbox) {\r\n    //     // function determines the state of the lora module.\r\n    //     // passes value (1 or 0) to python\r\n    //     // this.loraState = !this.loraState;\r\n    //     const loraOnState = 1;\r\n    //     const loraOffState = 0;\r\n    \r\n    //     // activate or deactivate lora module: Need to pass 1 or 0 to python\r\n    //     if (this.loraState) {\r\n    //         // if lora is active we need to re-enter this condition until this.loraState is false:\r\n\r\n    //         fetch( 'http://127.0.0.1:5000/activate-serial', {\r\n    //             method: 'POST',\r\n    //             body: JSON.stringify( {state: loraOnState }),\r\n    //             mode: 'cors',\r\n    //             headers: {\r\n    //                 'Content-Type': 'application/json'\r\n    //             },\r\n    //         })\r\n    //         .then(r => r.json())\r\n    //         .then(r => {\r\n    //             let messageResponse = { name: \"Rover\", message: r.response , time: r.time };\r\n    //             console.log(\"messageresponse is \" + messageResponse.message);\r\n    //             console.log(\"messageResponseTime is \" + messageResponse.time);\r\n    //             this.messages.push(messageResponse);\r\n    //             this.updateChatText(chatbox)\r\n    //             textField.value = ''\r\n    //             // finally call toggleSerial again?\r\n    //             //this.toggleSerial(chatbox) // is it that easy ? \r\n    //         })\r\n    //         .catch((error) => {\r\n    //             console.error('Error:', error);\r\n    //             this.updateChatText(chatbox)\r\n    //             textField.value = ''\r\n    //         }); \r\n    \r\n    //     } else {\r\n    //         // deactivate the module by passing a 0 to python\r\n    //         fetch( 'http://127.0.0.1:5000/activate-lora', {\r\n    //             method: 'POST',\r\n    //             body: JSON.stringify( {state: loraOffState }),\r\n    //             mode: 'cors',\r\n    //             headers: {\r\n    //                 'Content-Type': 'application/json'\r\n    //             },\r\n    //         }) \r\n    \r\n    //     } \r\n    // }\n\n//# sourceURL=webpack://javascript---modules/./src/chatbox.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var plotly_js_basic_dist__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! plotly.js-basic-dist */ \"./node_modules/plotly.js-basic-dist/plotly-basic.js\");\n/* harmony import */ var plotly_js_basic_dist__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(plotly_js_basic_dist__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _chatbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chatbox */ \"./src/chatbox.js\");\n/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map */ \"./src/map.js\");\n\r\n\r\n\r\n\r\n\r\n// create chatbox object:\r\nconst chatbox = new _chatbox__WEBPACK_IMPORTED_MODULE_1__.Chatbox();\r\nchatbox.display();\r\n\r\n// create inital dataset:\r\nlet data = [_map__WEBPACK_IMPORTED_MODULE_2__.maxAndMinDots, _map__WEBPACK_IMPORTED_MODULE_2__.homeBaseDot, _map__WEBPACK_IMPORTED_MODULE_2__.trackingBeaconDots];\r\n// Rover tracking:\r\nplotly_js_basic_dist__WEBPACK_IMPORTED_MODULE_0___default().newPlot('map-body', data, _map__WEBPACK_IMPORTED_MODULE_2__.layout);\r\n\r\n\r\n\r\n// TEMPORARY: UPDATE MAP BASED UPON USER-INPUT -> give to python\r\nconst timeSubmitButton = document.querySelector('.submit-times');\r\n\r\n\r\nfunction updateRoverLocation(roverXLocation, roverYLocation) {\r\n\r\n    // we have (x,y) location of rover... all we need to do is update map:\r\n    var roverLocation = {\r\n        x: [roverXLocation],\r\n        y: [roverYLocation],\r\n        mode: \"markers\",\r\n        markers: {\r\n            color: 'rgb(255, 153, 0)',\r\n            sizes: 18\r\n        },\r\n        name: \"Rover\"\r\n    };\r\n    data = [_map__WEBPACK_IMPORTED_MODULE_2__.maxAndMinDots, _map__WEBPACK_IMPORTED_MODULE_2__.homeBaseDot, _map__WEBPACK_IMPORTED_MODULE_2__.trackingBeaconDots, roverLocation];\r\n\r\n    // update map here:\r\n    plotly_js_basic_dist__WEBPACK_IMPORTED_MODULE_0___default().react('map-body', data, _map__WEBPACK_IMPORTED_MODULE_2__.layout);\r\n\r\n\r\n}\r\n\r\n\r\nfunction submitTimes(submitButton) {\r\n\r\n    // add event listener\r\n    submitButton.addEventListener('click', () => {\r\n        console.log(\"made it into vent listener\")\r\n        // get input values\r\n        let timeOne = document.getElementById(\"beacon1time\")\r\n        let timeTwo = document.getElementById('beacon2time');\r\n        let timeThree = document.getElementById('beacon3time');\r\n\r\n        console.log(timeTwo);\r\n        console.log(timeThree);\r\n\r\n        // send fetch request to get back beacon (x,y) values:\r\n        fetch( 'http://127.0.0.1:5000/tracker-update', {\r\n            method: 'POST',\r\n            body: JSON.stringify( {time1: timeOne.value, \r\n                time2: timeTwo.value, \r\n                time3: timeThree.value}),\r\n            mode: 'cors',\r\n            headers: {\r\n                'Content-Type': 'application/json'\r\n            },\r\n        }).then(r => r.json())\r\n        .then( r => {\r\n            let locationResponse = {xvalue: r.xvalue, yvalue: r.yvalue}\r\n            console.log(locationResponse.xvalue);\r\n            console.log(locationResponse.yvalue);\r\n            let roverX = locationResponse.xvalue;\r\n            let roverY = locationResponse.yvalue;\r\n            updateRoverLocation(roverX, roverY);\r\n        }).catch((error) => {\r\n            console.error('Error:', error);\r\n            this.updateChatText(chatbox)\r\n            textField.value = ''\r\n        });\r\n    })\r\n}\r\n\r\nsubmitTimes(timeSubmitButton);\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n// mapState = false;\r\n\r\n// function updateRoverLocation(roverXLocation, roverYLocation) {\r\n\r\n//     // we have (x,y) location of rover... all we need to do is update map:\r\n//     let roverLocation = {\r\n//         x: [roverXLocation],\r\n//         y: [roverYLocation],\r\n//         mode: 'lines+markers',\r\n//         markers: {\r\n//             color: 'rgb(135, 206, 235)',\r\n//             sizes: 8\r\n//         },\r\n//         line: {\r\n//             color: 'rgb(135, 206, 235)', // \r\n//             width: 1\r\n//         },\r\n//         name: \"Rover\"\r\n//     };\r\n//     data = [maxAndMinDots, homeBaseDot, trackingBeaconDots, roverLocation];\r\n\r\n//     // update map here:\r\n//     Plotly.react('map-body', data, layout);\r\n\r\n\r\n// }\r\n\r\n// // Update the map here:\r\n// function updateMap() {\r\n//     var activateMap = document.querySelector('.toggle-tracker-button');\r\n\r\n//     // add an event listener:\r\n//     activateMap.addEventListener('click', async () => {\r\n//         console.log(\"Yup it worked\");\r\n//         mapState = !mapState; // update state of map\r\n\r\n//         while (true) {\r\n//             if (mapState) {\r\n//                 // what do we want to do here?\r\n//                 // inf. async while loop // similar to getSerial();\r\n\r\n//                 // we will wait here until any data becomes available:\r\n//                 const trackerUpdateResponse = await fetch(\"http://127.0.0.1:5000/tracker-update\");\r\n\r\n//                 // extract json data:\r\n//                 const trackerUpdate = trackerUpdateResponse.json();\r\n//                 let locationInfo = {name: \"Rover\", xLocation: trackerUpdate.x, yLocation: trackerUpdate.y}\r\n//                 roverXLocation = locationInfo.xLocation;\r\n//                 roverYLocation = locationInfo.yLocation;\r\n//                 // call function here to updateMap();\r\n//                 updateRoverLocation(roverXLocation, roverYLocation);\r\n\r\n//             }\r\n//             else {\r\n//                 return 0;\r\n//             }\r\n\r\n//         }\r\n        \r\n//     });\r\n\r\n// } \r\n\r\n// updateMap();\r\n\r\n// Working plot:\r\n// Plotly.newPlot('map-body', data, {\r\n//     images: [\r\n//         {\r\n//             \"source\": \"https://raw.githubusercontent.com/JonWakefield/RF-Communication-and-Tracking/main/images/empty/campus_map.png\",\r\n//             \"xref\": \"x\",\r\n//             \"yref\": \"y\",\r\n//             \"x\": 0,\r\n//             \"y\": 1550,\r\n//             \"sizex\": 2360,\r\n//             \"sizey\": 1550,\r\n//             \"sizing\": \"stretch\",\r\n//             \"opacity\": 1,\r\n//             \"layer\": \"below\"\r\n//         },\r\n//       ],\r\n//       margin: {\r\n//         t: 0, //top margin\r\n//         l: 0, //left margin\r\n//         r: 0, //right margin\r\n//         b: 0 //bottom margin\r\n//     },\r\n//   })\n\n//# sourceURL=webpack://javascript---modules/./src/index.js?");

/***/ }),

/***/ "./src/map.js":
/*!********************!*\
  !*** ./src/map.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"data\": () => (/* binding */ data),\n/* harmony export */   \"homeBaseDot\": () => (/* binding */ homeBaseDot),\n/* harmony export */   \"layout\": () => (/* binding */ layout),\n/* harmony export */   \"maxAndMinDots\": () => (/* binding */ maxAndMinDots),\n/* harmony export */   \"roverLocation\": () => (/* binding */ roverLocation),\n/* harmony export */   \"trackingBeaconDots\": () => (/* binding */ trackingBeaconDots)\n/* harmony export */ });\n// move file to modules.js once finish setting it up\r\n// ---- How the Plot Works ----\r\n// Red Dots ==> Beacons\r\n// Blue dot / line==> Rover\r\n// Purple dot ==> Home base (?)\r\n\r\n// Cool features to add:\r\n// When communication beacon goes live, add dot to map\r\n\r\n\r\n\r\n// lets use example data from tracking.py for now:\r\n// furthest point x: 2.36 km -> 2360\r\n// furthest point y: 1.55 km -> 1550\r\n\r\n// could hard code location of beacons into javascript:\r\nvar maxAndMinDots = {\r\n    x: [0, 2360],\r\n    y: [0, 1550],\r\n    mode: 'markers',\r\n    markers: {\r\n        color: 'rgba(0,0,0,0)',\r\n        size: 0.5\r\n    }\r\n};\r\n\r\n\r\nvar trackingBeaconDots = {\r\n    // x: [1st beacon, 2nd beacon, 3rd beacon]\r\n    // y: [1st beacon, 2nd beacon, 3rd beacon]\r\n    x: [1250, 1280, 2000], //1979.493\r\n    y: [550, 1080, 700], //708.1\r\n    mode: 'markers',\r\n    marker: {\r\n        color: 'rgb(255, 153, 0)',\r\n        size: 12\r\n    },\r\n    name: \"TrackingBeacon\"\r\n};\r\n\r\nvar homeBaseDot = {\r\n    x: [1947.3],\r\n    y: [958],\r\n    mode: \"markers\",\r\n    marker: {\r\n        color: 'rgb(128, 0, 128)',\r\n        size: 12\r\n    },\r\n    name: \"HomeBase\"\r\n};\r\n\r\nvar roverLocation = {\r\n    // need the data from arduino \r\n    // need to turn into an aync get HTTP method\r\n    x: [1],\r\n    y: [2],\r\n    mode: 'lines+markers',\r\n    markers: {\r\n        color: 'rgb(135, 206, 235)',\r\n        sizes: 8\r\n    },\r\n    line: {\r\n        color: 'rgb(135, 206, 235)', // \r\n\t    width: 1\r\n    },\r\n    name: \"Rover\"\r\n};\r\n\r\n\r\nvar data = [maxAndMinDots, homeBaseDot, trackingBeaconDots, roverLocation];\r\n\r\nvar layout = {\r\n    images: [\r\n        {\r\n            \"source\": \"https://raw.githubusercontent.com/JonWakefield/RF-Communication-and-Tracking/main/images/campus_map.png\",\r\n            \"xref\": \"x\",\r\n            \"yref\": \"y\",\r\n            \"x\": 0,\r\n            \"y\": 1550,\r\n            \"sizex\": 2360,\r\n            \"sizey\": 1550,\r\n            \"sizing\": \"stretch\",\r\n            \"opacity\": 1,\r\n            \"layer\": \"below\"\r\n        },\r\n      ],\r\n    xaxis: {\r\n        zeroline: false,\r\n        visible: false\r\n    },\r\n    yaxis: {\r\n        zeroline: false,\r\n        visible: false\r\n    },\r\n    showlegend: false,\r\n    margin: {\r\n        t: 25, //top margin\r\n        l: 0, //left margin\r\n        r: 0, //right margin\r\n        b: 0 //bottom margin\r\n    },\r\n    title: 'Rover Tracking',\r\n    paper_bgcolor: 'rgba(0,0,0,0)',\r\n    plot_bgcolor: 'rgba(0,0,0,0)'\r\n};\r\n\r\n// Plotly.newPlot('map-body', data, layout);\n\n//# sourceURL=webpack://javascript---modules/./src/map.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;