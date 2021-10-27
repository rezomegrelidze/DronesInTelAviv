const AltitudeManager = require('./altitudeManager');

class FlightManager {

    setNextFlightState(drone) {
        const positionBackup = { x: drone.position.x, y: drone.position.y };
        const altitude = drone.altitude;
        
        if (drone.position.x === drone.initialGroundPos && drone.position.y < altitude) {
            let newYPos = drone.position.y + drone.velocity;

            if (newYPos > drone.altitude)
                drone.position.y = drone.altitude;
            else
                drone.position.y = newYPos;

            // ascend 
        }
        else if (drone.position.x >= drone.initialGroundPos &&   
            drone.position.x < drone.destination &&
            drone.position.y === altitude) {
            if (drone.destination - drone.position.x < 1000)
                drone.position.x = drone.destination;
            else
                drone.position.x += drone.velocity;
            // mid flight
        }
        else if (drone.position.x === drone.destination && drone.position.y > 0) {
            let newYPos = drone.position.y - drone.velocity;

            if (newYPos < 0)
                drone.position.y = 0;
            else
                drone.position.y = newYPos;
            // descending
        } else if (drone.position.x === drone.destination && drone.position.y === 0) {
            this.handleLanding(drone);
            // landing
        }

        if (drone.droneCollides()) {
            drone.position = positionBackup;
        }
    }

    handleLanding(drone) {
        const altitudeManager = new AltitudeManager(drone.controlSystem);
        console.log(`Drone number ${drone.id} has landed`);
        drone.state.onGround = true;
        drone.hasPassenger = false;
        drone.initialGroundPos = drone.position.x;
        altitudeManager.removeAltitude(drone);
        drone.state.timeUntilLanding = 0;
        drone.state.timeUntilSomeoneReaches = undefined;
        drone.destination = drone.position.x + drone.controlSystem.getDestination();
    }
    
    isAscending(drone) {
        return drone.position.x === drone.initialGroundPos && drone.position.y < drone.altitude;
    }

    isDescending(drone) {
        return drone.position.x === drone.destination && drone.position.y > 0;
    }
}

module.exports = FlightManager;