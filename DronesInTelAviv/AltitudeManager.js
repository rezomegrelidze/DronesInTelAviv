'use strict';

export class AltitudeManager {
    controlSystem;

    constructor(controlSystem) {
        this.controlSystem = controlSystem;
    }

    requestAltitude(drone) {
        let availableAltitudes = this.availableAltitudes();
        if (availableAltitudes.length > 0) {
            drone.altitude = availableAltitudes[0];
            return true;
        }
        return false;
    }

    availableAltitudes() {
        return this.controlSystem.altitudes.filter(
            a => this.controlSystem.drones.some(d => d.altitude === a));
    }
}
