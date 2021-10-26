
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

function randomNext(min, max) {

    return Math.floor(Math.random() * (max - min)) + min;
}


class AltitudeManager {
    controlSystem;

    constructor(controlSystem) {
        this.controlSystem = controlSystem;
    }

    requestAltitude(drone) {
        const altitude = this.firstAvailableAltitude();
        if (altitude == undefined) return false;
        drone.altitude = altitude;
        altitude.drone = drone;
        return true;
    }

    firstAvailableAltitude() {
        return this.controlSystem.altitudes.find(a => a.drone === undefined);
    }

    removeAltitude(drone) {
        if (drone.altitude == undefined) return;
        drone.altitude = undefined;
        const altitude = this.controlSystem.altitudes.find(a => a.drone && a.drone.id === drone.id);
        altitude.drone = undefined;
    }
}

class FlightManager {
    constructor(controlSystem) {
        this.controlSystem = controlSystem;
    }

    setNextFlightState(drone) {
        let positionBackup = { x: drone.position.x, y: drone.position.y };

        
        if (drone.position.x === drone.initialGroundPos && drone.position.y < drone.altitude) {
            drone.position.y += drone.velocity;
            // ascend 
        }
        else if (drone.position.x >= drone.initialGroundPos &&   
            drone.position.x <= drone.destination &&
            drone.position.y === drone.altitude) {
            if (drone.destination - drone.position.x < 1000)
                drone.position.x = drone.destination;
            else
                drone.position.x += drone.velocity;
            // mid flight
        }
        else if (drone.position.x === drone.destination && drone.position.y > 0) {
            drone.position.y -= drone.velocity;
            // descending
        } else if (drone.position.x === drone.destination && drone.position.y === 0) {
            drone.handleLanding();
            // landing
        }

        if (drone.droneCollides()) {
            this.position = positionBackup;
        }
    }
}

class Drone {
    id;
    initialGroundPos;
    state = {
        onGround: true,
        timeUntilLanding: 0,
        timeUntilSomeoneReaches: 0 // in minutes
    };

    hasPassenger = false;

    controlSystem;

    position = {
        x: 0,
        y: 0
    };

    destination;

    velocity = 1000.0; // meters / min

    altitude;

    constructor(id, controlSystem) {
        this.id = id;
        this.controlSystem = controlSystem;
    }

    nextState() {
        if (!this.state.onGround) {
            this.nextStateInAir();
            this.state.timeUntilLanding = this.calcTimeUntilLanding();
        } else {
            this.nextStateOnGround();
        }

    }

    nextStateOnGround() {
        if (!this.hasPassenger) {
            if (this.state.timeUntilSomeoneReaches !== 0) {
                this.state.timeUntilSomeoneReaches--;
            } else {
                console.log(`A person reached to drone number ${this.id}`);
                this.hasPassenger = true;
            }
            return;
        }


        const altitudeManager = new AltitudeManager(this.controlSystem);
        if (altitudeManager.requestAltitude(this)) {
            console.log(`Drone number ${this.id} asked for a permit to take off and received a permit + ${this.altitude.value}.`);
            this.handleTakeOff();
        } else {
            console.log(`Drone number ${this.id} asked for a permit and didn't receive it`);
        }
    }

    handleTakeOff() {
        this.state.onGround = false;
    }


    nextStateInAir() {
        let flightManager = new FlightManager(this.controlSystem);
        flightManager.setNextFlightState(this);;
    }

    handleLanding() {
         const altitudeManager = new AltitudeManager(this.controlSystem);
        console.log(`Drone number ${this.id} has landed`);
        this.state.onGround = true;
        this.hasPassenger = false;
        this.initialGroundPos = this.position.x;
        altitudeManager.removeAltitude(this);
        this.state.timeUntilSomeoneReaches = this.controlSystem.getTimeUntilSomeoneReaches();
        this.state.timeUntilLanding = 0;
        this.destination = this.position.x + this.controlSystem.getDestination();
        // TODO: research why landing doesn't work
    }

    droneCollides() {
        let otherDrones = this.controlSystem.drones.filter(d => d.id !== this.id);
        return otherDrones.some(d => d.position.x === this.position.x && d.position.y === this.position.y);
    }

    // returns time in minutes
    calcTimeUntilLanding() {
        // using the formula t = s/v
        if (this.isDescending()) {
            let s = (this.altitude - this.position.y);
            return s / this.velocity;
        } else {
            let s = this.altitude + (this.destination - this.position.x); // case if not ascending or descending
            if (this.isAscending())
                s += (this.altitude - this.position.y); // in case ascending add the necessary distance
            return s / this.velocity;
        }
    }

    isAscending() {
        return this.position.x === this.initialGroundPos && this.position.y < this.altitude;
    }

    isDescending() {
        return this.position.x === this.destination && this.position.y > 0;
    }

    setInitialGroundPos(groundPosition) {
        this.initialGroundPos = groundPosition;
        this.position.x = groundPosition;
    }
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
            this.altitudes.push({ value: 1000 * i, drone: undefined });
        }
    }

    calculateDroneStates() {
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

class Simulation {
    constructor() {

    }
    
    start() {
        const controlSystem = new ControlSystem(20, 15);

        for (let ticker = 1; ticker <= 2400; ticker++) {
            controlSystem.calculateDroneStates();
            console.log(`minute #${ticker}`);
        }
        
    }
}

let simulation = new Simulation();
simulation.start();