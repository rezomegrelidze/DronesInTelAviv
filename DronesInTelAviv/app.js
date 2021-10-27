const ControlSystem = require('./controlSystem');

class Simulation {
    
    async start() {
        const controlSystem = new ControlSystem(20, 15);

        for (let ticker = 1; ticker <= 240; ticker++) {
            const delay = ms => new Promise(resolve => setTimeout(resolve,ms));
            controlSystem.calculateDroneStates();
            console.log(`minute #${ticker}`);
            await delay(500);
        }
        
    }
}

let simulation = new Simulation();
simulation.start();