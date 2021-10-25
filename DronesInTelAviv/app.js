'use strict';

import { ControlSystem } from "./ControlSystem";
import { Drone } from "./Drone";
import { AltitudeManager } from "./AltitudeManager";

// drone count: 20
// heights count: 15
// passanger arrival interval: 1-15 minutes

// at the beginning every drone is on the ground and for every drone a passanger arrives.

// A Central control system manages the 15 heights. Any drone that wants to take off should ask permission
// and get the altitude at which height he will fly. If there is no free height - he will wait a minute and ask again.

// Write a simulation program for 4 hours of this system working.
// The simulator will simulate the situation on the ground and the events. Every time an event happens it should be printed


// Example of events
/*
 *      Example of events:
 *          Time - Drone number X landed.
 *          Time - A person reached to drone number X
 *          Time - Drone number X asked for a permit to take off and received a permit + height
 *          Time - Drone number X requested a take-off permit and did not receive a permit.
 * 
 * /
 */

export class Simulation {
    constructor() {

    }
    
    start() {
        let controlSystem = new ControlSystem(15, 20);

        for (let ticker = 1; ticker <= 240; ticker++) {
            controlSystem.calculateDroneStates();
        }
    }
}



