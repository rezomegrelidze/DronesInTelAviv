

class AltitudeManager {
    controlSystem;

    constructor(controlSystem) {
        this.controlSystem = controlSystem;
    }
    requestAltitude(drone) {
        const altitude = this.firstAvailableAltitude(drone);
        if (altitude === undefined) {
            return false;
        } else {
            drone.altitude = altitude.value;
            altitude.drone = drone;
            return true;
        }
    }

    requestAltitudeIfNeeded(drone) {
        if (drone.altitude !== undefined) return;

        if (this.requestAltitude(drone)) {
            console.log(`Drone number ${drone.id} asked for a permit to take off and received a permit + ${drone.altitude}.`);
            drone.state.onGround = false;
            drone.state.timeUntilSomeoneReaches = undefined;
        } else {
            console.log(`Drone number ${drone.id} asked for a permit and didn't receive it`);
        }
    }

    firstAvailableAltitude(drone) {
        if(this.controlSystem.altitudes.find(a => a.drone && a.drone.id === drone.id) !== undefined) 
            return undefined;

        return this.controlSystem.altitudes.find(a => a.drone === undefined);
    }

    removeAltitude(drone) {
        if (drone.altitude === undefined) return;

        const altitude = drone.controlSystem.altitudes.find(a => a.drone && a.drone.id === drone.id);
        drone.altitude = undefined;
        altitude.drone = undefined;
    }
}

module.exports = AltitudeManager;