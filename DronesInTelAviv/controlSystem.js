const Drone = require('./drone');


function randomNext(min, max) {

    return Math.floor(Math.random() * (max - min)) + min;
}

class ControlSystem {
    altitudes = [];
    drones = [];

    constructor(droneCount, altitudesCount) {
        this.initializeDrones(droneCount);
        this.initializeAltitudes(altitudesCount);
        this.assignDronesInitialGroundPositions();
    }

    initializeAltitudes(altitudesCount) {
        for (let i = 1; i <= altitudesCount; i++) {
            this.altitudes.push({ value: 200 * i, drone: undefined });
        }
    }

    shuffle(arr) {
        for (let i = 0; i < arr.length; i++) {
            let j = randomNext(0, i + 1);
            let tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    }


    calculateDroneStates() {
        this.shuffle(this.drones);
        for (let drone of this.drones) {
            drone.nextState();
        }
    }

    initializeDrones(droneCount) {
        for (let i = 1; i <= droneCount; i++) {
            const drone = new Drone(i,this);
            this.drones.push(drone);
            drone.state.timeUntilSomeoneReaches = this.getTimeUntilSomeoneReaches();
            drone.destination = this.getDestination();
        }
    }

    getDestination() {
        return randomNext(1, 6) * 1000;
    }


    assignDronesInitialGroundPositions() {
        let position = 0;

        for (let i = 0; i < this.drones.length; i++) {
            this.drones[i].setInitialGroundPos(position);
            position += 20;
        }
    }

    getTimeUntilSomeoneReaches() {
        return randomNext(1, 16);
    }
}

module.exports = ControlSystem;