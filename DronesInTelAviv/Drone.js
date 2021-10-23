'use strict';


export class Drone {
    id;

    state = {
        onGround = true,
        timeUntilLanding = 0,
        timeUntilSomeoneReaches = 0
    };

    destinationLen;

    velocity = 1000; // meters / min

    altitude = 0;

    constructor(id) {
        this.id = id;
    }
}
