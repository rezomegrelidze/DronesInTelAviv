const FlightManager = require('./flightManager');
const DroneStateManager = require('./droneStateManager');
const AltitudeManager = require('./altitudeManager');

class Drone {
    id;
    initialGroundPos;
    state = {
        onGround: true,
        timeUntilLanding: 0,
        timeUntilSomeoneReaches: undefined // in minutes
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

    calculateTimeUntilSomeoneReaches(){
        if(this.state.timeUntilSomeoneReaches === undefined)
            this.state.timeUntilSomeoneReaches = this.controlSystem.getTimeUntilSomeoneReaches();
    }

    nextState() {
        const droneStateManager = new DroneStateManager();
        const altitudeManager = new AltitudeManager(this.controlSystem);
        
        if(this.hasPassenger){
            altitudeManager.requestAltitudeIfNeeded(this);
        }else{
            this.calculateTimeUntilSomeoneReaches();
        }

        if (!this.state.onGround) {
            droneStateManager.nextStateInAir(this);
            this.state.timeUntilLanding = this.calcTimeUntilLanding();
        } else {
            droneStateManager.nextStateOnGround(this);
        }

    }


    droneCollides() {
        if(this.position.y === 0) return false;

        let otherDrones = this.controlSystem.drones.filter(d => d.id !== this.id);
        return otherDrones.some(d => d.position.x === this.position.x && d.position.y === this.position.y);
    }

    // returns time in minutes
    calcTimeUntilLanding() {
        // using the formula t = s/v
        const flightManager = new FlightManager(this.controlSystem);

        if (flightManager.isDescending(this)) {
            let s = (this.altitude - this.position.y);
            return s / this.velocity;
        } else {
            let s = this.altitude + (this.destination - this.position.x); // case if not ascending or descending
            if (flightManager.isAscending(this))
                s += (this.altitude - this.position.y); // in case ascending add the necessary distance
            return s / this.velocity;
        }
    }

    setInitialGroundPos(groundPosition) {
        this.initialGroundPos = groundPosition;
        this.position.x = groundPosition;
    }
}

module.exports = Drone;