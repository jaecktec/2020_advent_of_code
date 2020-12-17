
const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');
const inputLines = input.split('\n');

const ACTIVE = '#';
const INACTIVE = '.';

const SCAN_DIRECTIONS = (() => {
    const result = [];
    for (let sz = 0; sz < 3; sz++) {
        for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
                if (sx === 1 && sy === 1 && sz === 1) continue;
                result.push({sz: sz - 1, sy: sy - 1, sx: sx - 1});
            }
        }
    }
    return result;
})();

function countActiveNeighbours(z, y, x, cube) {
    let result = 0;
    for (let sd = 0; sd < SCAN_DIRECTIONS.length; sd++) {
        const {sz, sy, sx} = SCAN_DIRECTIONS[sd];
        const zLayer = cube[z + sz] || [];
        const yArray = zLayer[y + sy] || [];
        const value = yArray[x + sx];
        if (value === ACTIVE) {
            result += 1;
        }
    }

    return result;
}


function pad3D(cube) {
    function pad2D(arr) {
        return [
            [...new Array(arr[0].length + 2)].map(() => INACTIVE),
            ...arr.map(it => [INACTIVE, ...it, INACTIVE]),
            [...new Array(arr[0].length + 2)].map(() => INACTIVE),
        ]
    }

    const dim = cube.length + 2;
    return [
        [...Array(dim)].map(() => [...Array(dim)].map(() => INACTIVE)),
        ...cube.map(it => pad2D(it)),
        [...Array(dim)].map(() => [...Array(dim)].map(() => INACTIVE)),
    ]
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function println(arg) {
    console.log(arg);
}

function printCube(cube) {
    println('')
    for (let z = 0; z < cube.length; z++) {
        println(`z=${z - (Math.floor(cube.length / 2))}`)
        console.table(cube[z]);
    }
}


function solve1(data) {
    const dim = data.length;
    console.table(SCAN_DIRECTIONS);

    // cubify center 3d layer
    let cube = [...Array(dim)].map(() => [...Array(dim)].map(() => [...Array(dim)].map(() => INACTIVE)));
    cube[Math.floor(dim / 2)] = data.map(it => [...it]);

    println('');
    println(`cycle=0`);
    println('');
    printCube(cube);

    const CYCLES = 6;

    for (let cycle = 1; cycle <= CYCLES; cycle++) {
        const currCube = pad3D(cube);
        const newCube = clone(currCube);
        const currDim = currCube.length;

        for (let z = 0; z < currDim; z++) {
            for (let y = 0; y < currDim; y++) {
                for (let x = 0; x < currDim; x++) {
                    const active = countActiveNeighbours(z, y, x, currCube);
                    if (currCube[z][y][x] === ACTIVE && !(active === 2 || active === 3)) {
                        newCube[z][y][x] = INACTIVE;
                    }
                    if (currCube[z][y][x] === INACTIVE && active === 3) {
                        newCube[z][y][x] = ACTIVE;
                    }
                }
            }
        }
        println('');
        println(`cycle=${cycle}`);
        println('');
        printCube(newCube);
        cube = newCube;
    }

    let result = 0;
    const currDim = cube.length;
    for (let z = 0; z < currDim; z++) {
        for (let y = 0; y < currDim; y++) {
            for (let x = 0; x < currDim; x++) {
                if (cube[z][y][x] === ACTIVE) {
                    result += 1;
                }
            }
        }
    }
    return result;


}

function solve2(data) {

}

console.log(solve1(inputLines));
// console.log(solve2(inputLines));