#!/usr/bin/python3
# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
import signal
import sys
import os
import atexit

# Configuration
FAN_PIN = 18            # BCM pin used to drive PWM fan
WAIT_TIME = 1           # [s] Time to wait between each refresh
PWM_FREQ = 25           # [kHz] 25kHz for Noctua PWM control

# Configurable temperature and fan speed
MIN_TEMP = 45
MIN_TEMP_DEAD_BAND = 5
MAX_TEMP = 60
FAN_LOW = 10
FAN_HIGH = 100
FAN_OFF = 0
FAN_MAX = 100

# Variable definition
outside_dead_band_higher = True
last_speed = -1;

# Get CPU's temperature
def getCpuTemperature():
    res = os.popen('cat /sys/class/thermal/thermal_zone0/temp').readline()
    temp = float(res)/1000
    #print("temp is {0}".format(temp)) # Uncomment for testing
    return temp

# Set fan speed
def setFanSpeed(speed):
    global last_speed
    if speed > last_speed or (last_speed - speed) > 10:
        print("setting fan speed to {0}".format(speed))
        fan.start(speed)
        last_speed = speed
    return()

# Handle fan speed
def handleFanSpeed(temperature, outside_dead_band_higher):
    # Turn off the fan if lower than lower dead band 
    if outside_dead_band_higher == False:
        setFanSpeed(FAN_OFF)
        #print("Fan OFF") # Uncomment for testing
        return
    # Run fan at calculated speed if being in or above dead zone not having passed lower dead band    
    elif outside_dead_band_higher == True and temperature < MAX_TEMP:
        step = float(FAN_HIGH - FAN_LOW)/float(MAX_TEMP - MIN_TEMP)  
        temperature -= MIN_TEMP
        speed = round(FAN_LOW + ( round(temperature) * step ),-1)
        #print("Calculated fan speed {0}".format(speed)) # Uncomment for testing
        setFanSpeed(speed)    
        return
    # Set fan speed to MAXIMUM if the temperature is above MAX_TEMP
    elif temperature > MAX_TEMP:
        setFanSpeed(FAN_MAX)
        #print("Fan MAX") # Uncomment for testing
        return
    else:
        return

# Handle dead zone bool
def handleDeadZone(temperature):
    if temperature > (MIN_TEMP + MIN_TEMP_DEAD_BAND/2):
        return True
    elif temperature < (MIN_TEMP - MIN_TEMP_DEAD_BAND/2):
        return False

# Reset fan to 100% by cleaning GPIO ports
def resetFan():
    GPIO.cleanup() # resets all GPIO ports used by this function

try:
    # Setup GPIO pin
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(FAN_PIN, GPIO.OUT, initial=GPIO.LOW)
    fan = GPIO.PWM(FAN_PIN,PWM_FREQ)
    # setFanSpeed(FAN_OFF)
    # Handle fan speed every WAIT_TIME sec
    while True:
        temp = float(getCpuTemperature())
        # print(temp)	
        outside_dead_band_higher = handleDeadZone(temp)
        handleFanSpeed(temp, outside_dead_band_higher)
        time.sleep(WAIT_TIME)

except KeyboardInterrupt: # trap a CTRL+C keyboard interrupt
    resetFan()

atexit.register(resetFan)
