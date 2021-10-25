'use strict';
import { Drone } from "./Drone";
import { randomNext } from "./Random"


export class ControlSystem {
    altitudes = [];
    drones = [];

    constructor(droneCount, altitudesCount) {
        this.initializeAltitudes(altitudesCount);
        this.initializeDrones(droneCount);

    }

    initializeAltitudes(altitudesCount) {
        for (let i = 1; i <= altitudesCount; i++) {
            this.altitudes.push(1000 * i);
        }
    }

    initializeDrones(droneCount) {
        for (let i = 1; i <= droneCount; i++) {
            let drone = new Drone(id);
            drones.push(drone);
            drone.state.timeUntilSomeoneReaches = randomNext(1, 16);
            drone.destination = randomNext(1, 6) * 1000;
        }
    }
}
