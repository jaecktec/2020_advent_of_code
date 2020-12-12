const fs = require('fs');
const path = require('path');
const { performance, PerformanceObserver } = require('perf_hooks');
const obs = new PerformanceObserver((items) => {
    items.getEntries().forEach(({ duration, name }) => {
        console.log(`${name} = ${duration} ms`)
    });
});
obs.observe({ entryTypes: ['measure'] });
performance.measure('Start to Now');


performance.mark('Start');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8')
const inputLines = input.split('\n');

function unique(value, index, self) {
    return self.indexOf(value) === index;
}


/*

---------N----------
|                  |
|        y         |
|       /\         |
W       |___>x     E
|                  |
|                  |
|                  |
---------S----------


*/

function solve1(data) {
    let shipDirection = 'E'; // east
    let shipPosition = [0, 0];
    const X = 0;
    const Y = 1;

    function moveForward(direction, amount) {
        switch (direction) {
            case 'N': shipPosition[Y] += parseInt(amount); break;
            case 'S': shipPosition[Y] -= parseInt(amount); break;
            case 'E': shipPosition[X] += parseInt(amount); break;
            case 'W': shipPosition[X] -= parseInt(amount); break;
        }
    }

    function turnRight(amount) {
        let degrees = parseInt(amount);
        while (degrees > 0) {
            switch (shipDirection) {
                case 'N': shipDirection = 'E'; break;
                case 'E': shipDirection = 'S'; break;
                case 'S': shipDirection = 'W'; break;
                case 'W': shipDirection = 'N'; break;
            }
            degrees -= 90;
        }
    }

    function turnLeft(amount) {
        let degrees = parseInt(amount);
        while (degrees > 0) {
            switch (shipDirection) {
                case 'N': shipDirection = 'W'; break;
                case 'W': shipDirection = 'S'; break;
                case 'S': shipDirection = 'E'; break;
                case 'E': shipDirection = 'N'; break;
            }
            degrees -= 90;
        }
    }

    for (let cmd = 0; cmd < data.length; cmd++) {
        const element = data[cmd];

        switch (element[0]) {
            case 'N':
            case 'S':
            case 'E':
            case 'W': moveForward(element[0], element.substr(1)); break;
            case 'F': moveForward(shipDirection, element.substr(1)); break;

            case 'R': turnRight(element.substr(1)); break;
            case 'L': turnLeft(element.substr(1)); break;
        }
        console.log(`cmd: ${element} \t direction: ${shipDirection} east: ${shipPosition[X]} north: ${shipPosition[Y]}`)
    }

    return Math.abs(shipPosition[0]) + Math.abs(shipPosition[1]);
}

function solve2(data) {
    const shipPosition = [0, 0];
    const waypoint = [10, 1];
    const EAST = 0;
    const NORTH = 1;

    function moveForward(amount) {
        shipPosition[NORTH] += waypoint[NORTH] * parseInt(amount);
        shipPosition[EAST] += waypoint[EAST] * parseInt(amount);
    }

    function turnLeft(amount) {
        const degrees = parseInt(amount);
        const x1 = waypoint[EAST];
        const y1 = waypoint[NORTH]
        // credits to the internet maing me remember high school math: https://matthew-brett.github.io/teaching/rotation_2d.html
        // I just remembered that cos(90) is -1, 0 or 1 :D 
        waypoint[EAST] = Math.round(Math.cos(degrees * Math.PI / 180)) * x1 - Math.round(Math.sin(degrees * Math.PI / 180)) * y1;
        waypoint[NORTH] = Math.round(Math.sin(degrees * Math.PI / 180)) * x1 + Math.round(Math.cos(degrees * Math.PI / 180)) * y1;
    }

    function turnRight(amount) {
        turnLeft(`-${amount}`);
    }

    for (let cmd = 0; cmd < data.length; cmd++) {
        const element = data[cmd];
        switch (element[0]) {
            case 'N': waypoint[NORTH] += parseInt(element.substr(1)); break;
            case 'S': waypoint[NORTH] -= parseInt(element.substr(1)); break;
            case 'E': waypoint[EAST] += parseInt(element.substr(1)); break;
            case 'W': waypoint[EAST] -= parseInt(element.substr(1)); break;
            case 'F': moveForward(element.substr(1)); break;

            case 'R': turnRight(element.substr(1)); break;
            case 'L': turnLeft(element.substr(1)); break;
        }
        console.log(`${cmd} cmd: ${element} \t east: ${shipPosition[EAST]} north: ${shipPosition[NORTH]}, waypoint east ${waypoint[EAST]} north: ${waypoint[NORTH]}`)
    }

    return Math.abs(shipPosition[EAST]) + Math.abs(shipPosition[NORTH]);
}

// console.log(solve1(inputLines));
console.log(solve2(inputLines));