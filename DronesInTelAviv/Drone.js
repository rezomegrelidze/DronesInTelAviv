'use strict';

import { AltitudeManager } from "./AltitudeManager";


export class Drone {
    id;
    initialGroundPos;
    state = {
        onGround = true,
        timeUntilLanding = 0,       
        timeUntilSomeoneReaches = 0 // in minutes
    };

    hasPassanger;

    controlSystem;

    position = {
        x = 0,
        y = 0
    };

    destination;

    velocity = 1000.0; // meters / min

    altitude;

    constructor(id,controlSystem) {
        this.id = id;
        this.controlSystem = controlSystem;
    }

    nextState() {
        if (!onGround) {
            nextStateInAir();

        } else {

            this.nextStateOnGround();
        }

        timeUntilLanding = calcTimeUntilLanding();
    }

    nextStateOnGround() {
        if (!this.hasPassanger) {
            if (state.timeUntilSomeoneReaches != 0) {
                state.timeUntilSomeoneReaches--;
            } else {
                console.log(`A person reached to drone number ${this.id}`);
                this.hasPassanger = true;
            }
            return;
        }


        let altitudeManager = new AltitudeManager(this.controlSystem);
        if (altitudeManager.requestAltitude(this)) {
            console.log(`Drone number ${this.id} asked for a permit to take off and received a permit + ${this.altitude}.`);
        } else {
            console.log(`Drone number ${this.id} asked for a permit and didn't receive it`)
        }
    }


    nextStateInAir() {
        let positionBackup = { x = this.position.x, y = this.position.y };
        if (this.position.x === this.destination && this.position.y != 0) {
            this.position.y -= this.velocity;
            // descend
        }
        else if (this.position.y !== this.altitude && this.position.x == initialGroundPos) {
            this.position.y += this.velocity;
            // ascend 
        }
        else if (this.position.y === 0 && this.position.x === this.destination) {
            // landed
            console.log(`Drone number ${this.id} has landed`);
            this.state.onGround = true;
            this.hasPassanger = false;
            this.initialGroundPos = this.position.x;
        } else {
            this.position.x += this.velocity;
            // move towards the destination
        }

        if (systemHasCollisions()) {
            this.position = positionBackup;
        }
    }

    systemHasCollisions() {
        return drones.some(d => d.position.x === this.position.x && d.position.y === this.position.y);
    }

    calcTimeUntilLanding() {
        // using the formula t = s/v
        if (isAscending()) {
            let s = this.altitude + (this.destination - this.position.x) + 
        }
        // TODO: finish writing
    }

    isAscending() {
        return this.position.x === initialGroundPos && this.position.y < this.altitude;
    }

    isDescending() {
        return this.position.x === this.destination && this.position.y > 0;
    }
}
