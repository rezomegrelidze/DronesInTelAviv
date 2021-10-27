const ControlSystem = require('./controlSystem');

class Simulation {
    constructor() {

    }
    
    start() {
        const controlSystem = new ControlSystem(20, 15);

        for (let ticker = 1; ticker <= 240; ticker++) {
            controlSystem.calculateDroneStates();
            console.log(`minute #${ticker}`);
        }
        
    }
}

let simulation = new Simulation();
simulation.start();