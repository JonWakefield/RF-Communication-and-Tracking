import re
from typing import Dict
import serial
from flask import Blueprint, render_template, request, jsonify
from .python_modules import Communications
from .tracking_modules import find_distance, find_square, find_center, intersection, line
from datetime import datetime
from time import sleep
import pandas as pd




# blueprint for flask application
routes = Blueprint('routes', __name__)



# Home route: auto-called when application is launched. Loads index.html
@routes.route('/')
def home():        
    return render_template("index.html")



# Route called when user wants to read in the serial
@routes.get('/read-serial')
def activate_lora() -> Dict:
    ''' async function reads in serial monitor, when a transmission (from an rf module) has been received
        passes value to the front-end (javascript) where it can be displayed for the user.'''
    
    # Set-up Communications object to communicate with arduino through serial
    private_key = 5 # private key for caesar cypher. CHANGE.
    # try setting up the serial channel, if unable return null to javascript to inform user something went wrong
    try:
        communication_RF = Communications(private_key)
    except serial.SerialException:
        print("Could not connect to RF module")
        return "False"
               
    
    # Now, since this is an async function, just read in the serial monitor until a transmission has been received
    js_state, received_data_1, received_data_2 = communication_RF.read_serial_monitor()

    # state is 1 if received comms data:
    if(js_state == 1):
        # get time to time stamp each message:
        time = get_time()

        received_message = received_data_1

        received_snr = received_data_2

        # convert received data to a dictionary:
        return_message = {"response": received_message, "snr": received_snr, "time": time}

        # return json data of dictionary 
        return jsonify(return_message)

    # state is two if received tracking data
    elif(js_state == 2):

        tx = received_data_1

        ty = received_data_2

        return_message = {'xvalue': tx , 'yvalue': ty}

        return jsonify(return_message)

    


@routes.post('/transmit')
def transmit_message() -> Dict:
    ''' Function used when user would like to transmit a message to a different RF module'''

    # get data (message) from javascript, convert to json
    message_to_transmit = request.get_json().get("message")

    # for testing, print message:
    print(f"message grabbed = {message_to_transmit}")

    '''NOTE: to pass data effectively to the arduino, while minizing downtime, all transmission will first get written to a file, then will get passed to arduino for transmission'''
    # convert message to a pandas dataframe
    df = pd.DataFrame([message_to_transmit])

    # write message to the file to be transmitted:
    df.to_csv('development\documents\messages.csv', mode='w', index = False, header=None)

    time = get_time()

    return_message = {"sent": message_to_transmit, "time": time}
    return jsonify(return_message)



@routes.post('/toggle-beacon')
def toggle_beacon():

    beacon_state = request.get_json()

    print(f"beacon state is {beacon_state}")

    # use same method when passing transmissions to the serial monitor:

    # convert message to a pandas dataframe
    df = pd.DataFrame([beacon_state])

    # write message to the file to be transmitted:
    df.to_csv('development\documents\\beaconstate.csv', mode='w', index = False, header=None)

    return "200"


# route used to pass location data to javascript:
@routes.post('/tracker-update')
def location_view():

        # way of settingup the system:
        # read_serial_monitor() gets location data -> writes to file
        # this (async) route will wait for location data to be output to file
        # once we have data:
        # ...
        # put through tof functions() to find distance (meters)
        # Every 5 seconds check if data exists in file?
        

        # return josnify(distance)

    beacon1 = [1280,1080] 
    beacon2 = [1250, 550]
    beacon3 = [2000, 700]

    time1 = request.get_json().get("time1")
    time2 = request.get_json().get("time2")
    time3 = request.get_json().get("time3")

    time1 = float(time1) * 10**-7
    time2 = float(time2) * 10**-7
    time3 = float(time3) * 10**-7


    # get distance from each time
    d1 = find_distance(time1)
    d2 = find_distance(time2)
    d3 = find_distance(time3)

    s1 = find_square(d1, beacon1)
    s2 = find_square(d2, beacon2)
    s3 = find_square(d3, beacon3)

    tsbr = intersection(line(s1[1], s1[3]), line(s3[2], s3[3]))
    tsbl = intersection(line(s2[0], s2[2]), line(s3[2], s3[3]))
    tstr = intersection(line(s1[1], s1[3]), line(s2[0], s2[1]))
    tstl = s2[0]

    target = find_center(tstl,tsbr)
    tx = str(round(target [0]))
    ty = str(round(target[1]))

    print("Target is at (" + tx + ", " + ty + ")")

    return_message = {'xvalue': tx , 'yvalue': ty}

    return jsonify(return_message)






# function used to get the current time
def get_time() -> str:
    # get time:
    now = datetime.now()
    time = now.strftime("%I:%M %p")
    return time






# ROUTE USED FOR DEVELOPMENT PURPOSES:
@routes.post('/transmit-test')
def testing():
    ''' Route is called whenever user enters a message into RF messenger:'''

    # get inputted message sent from javascript
    message_to_transmit = request.get_json().get("message")
    # for testing, print message:
    print(f"message grabbed = {message_to_transmit}")

    # get time:
    time = get_time()

    # test message:
    test_message = "This is a test of the system."
    
    # next, close the serial connection:
    # UNLESS: we can send value back to javascript without returning from route.
    return_message = {"response": test_message, "time": time}
    return jsonify(return_message)





