
const FlightManager = require('./flightManager');

class DroneStateManager {


    nextStateOnGround(drone) {
        if (!drone.hasPassenger) {
            if (drone.state.timeUntilSomeoneReaches !== 0) {
                drone.state.timeUntilSomeoneReaches--;
            } else {
                console.log(`A person reached to drone number ${drone.id}`);
                drone.hasPassenger = true;
            }
            return;
        }
    }

    nextStateInAir(drone) {
        let flightManager = new FlightManager(drone.controlSystem);
        flightManager.setNextFlightState(drone);
    }
}

module.exports = DroneStateManager;