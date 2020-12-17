const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'test-input.txt'), 'utf8');
const inputLines = input.split('\n');

const ACTIVE = '#';

const SCAN_DIRECTIONS_3D = (() => {
    const result = [];
    for (let sz = 0; sz < 3; sz++) {
        for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
                if (sx === 1 && sy === 1 && sz === 1) continue;
                result.push({ sz: sz - 1, sy: sy - 1, sx: sx - 1 });
            }
        }
    }
    return result;
})();

const SCAN_DIRECTIONS_4D = (() => {
    const result = [];
    for (let sz = 0; sz < 3; sz++) {
        for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
                for (let sw = 0; sw < 3; sw++) {
                    if (sx === 1 && sy === 1 && sz === 1 && sw === 1) continue;
                    result.push({ sz: sz - 1, sy: sy - 1, sx: sx - 1, sw: sw - 1 });
                }
            }
        }
    }
    return result;
})();

function countActiveNeighbours3d(x, y, z, cube) {
    let result = 0;
    for (let sd = 0; sd < SCAN_DIRECTIONS_3D.length; sd++) {
        const { sz, sy, sx } = SCAN_DIRECTIONS_3D[sd];
        if (cube.get(`${x - sx},${y - sy},${z - sz}`)) {
            result += 1;
        }
    }

    return result;
}


function countActiveNeighbours4d(x, y, z, w, cube) {
    let result = 0;
    for (let sd = 0; sd < SCAN_DIRECTIONS_4D.length; sd++) {
        const { sz, sy, sx, sw } = SCAN_DIRECTIONS_4D[sd];
        if (cube.get(`${x - sx},${y - sy},${z - sz},${w - sw}`)) {
            result += 1;
        }
    }

    return result;
}

const initArr = (size, value) => [...Array(size)].map(() => JSON.parse(JSON.stringify(value)));

function printCube3D(cube, dims) {
    console.log('')
    // z, y, x
    const printableCube = initArr(
        dims[2][1] - dims[2][0],
        initArr(
            dims[1][1] - dims[1][0],
            initArr(
                dims[0][1] - dims[0][0],
                '.'
            )));
    const keys = cube.keys();
    let hasNext;
    do {
        const {value, done} = keys.next();
        hasNext = !done;
        if(hasNext){
            const [x, y, z] = value.split(',');
            printableCube[parseInt(z) - dims[2][0]][parseInt(y) - dims[1][0]][parseInt(x) - dims[0][0]] = ACTIVE;
        }
    } while (hasNext);

    for (let z = 0; z < printableCube.length; z++) {
        console.log(`z=${z - (Math.floor(printableCube.length / 2))}`)
        console.table(printableCube[z]);
    }
}


function solve1(data) {
    let cube = new Map();

    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[0].length; x++) {
            if (data[y][x] === ACTIVE) {
                cube.set(`${x},${y},0`, true);
            }
        }
    }

    const CYCLES = 6;

    const dims = [
        [0, data.length],
        [0, data[0].length],
        [0, 1]
    ];

    printCube3D(cube, dims);

    for (let cycle = 1; cycle <= CYCLES; cycle++) {
        let newCube = new Map();
        // increment dimensions
        for (let didx = 0; didx < dims.length; didx++) {
            const element = dims[didx];
            element[0] -= 1;
            element[1] += 1;
        }

        for (let x = dims[0][0]; x < dims[0][1]; x++) {
            for (let y = dims[1][0]; y < dims[1][1]; y++) {
                for (let z = dims[2][0]; z < dims[2][1]; z++) {
                    const active = countActiveNeighbours3d(x, y, z, cube);
                    const isActive = cube.get(`${x},${y},${z}`);

                    if (active === 3 || (active === 2 && isActive)) {
                        newCube.set(`${x},${y},${z}`, true);
                    }
                }
            }
        }
        printCube3D(newCube, dims);
        cube = newCube;
    }
    return cube.size
}

function solve2(data) {
    let cube = new Map();

    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[0].length; x++) {
            if (data[y][x] === "#") {
                cube.set(`${x},${y},0,0`, true);
            }
        }
    }

    const CYCLES = 6;

    const dims = [
        [0, data.length],
        [0, data[0].length],
        [0, 1],
        [0, 1],
    ];

    for (let cycle = 1; cycle <= CYCLES; cycle++) {
        let newCube = new Map();
        // increment dimensions
        for (let dimIdx = 0; dimIdx < dims.length; dimIdx++) {
            const element = dims[dimIdx];
            element[0] -= 1;
            element[1] += 1;
        }

        for (let x = dims[0][0]; x < dims[0][1]; x++) {
            for (let y = dims[1][0]; y < dims[1][1]; y++) {
                for (let z = dims[2][0]; z < dims[2][1]; z++) {
                    for (let w = dims[3][0]; w < dims[3][1]; w++) {
                        const active = countActiveNeighbours4d(x, y, z, w, cube);
                        const isActive = cube.get(`${x},${y},${z},${w}`);

                        if (active === 3 || (active === 2 && isActive)) {
                            newCube.set(`${x},${y},${z},${w}`, true);
                        }
                    }
                }
            }
        }
        cube = newCube;
    }
    return cube.size
}

console.log(solve1(inputLines));
// console.log(solve2(inputLines));
