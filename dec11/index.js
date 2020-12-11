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


function padArray(arr, padWith, numOfPads) {
    return [
        [...new Array(arr[0].length)].map(it => '.').join(''),
        ...(arr.map(it => `.${it}.`)),
        [...new Array(arr[0].length)].map(it => '.').join(''),
    ]
}



function printRoom(room) {

    for (let i = 0; i < room.length; i++) {
        const line = room[i];
        for (let j = 0; j < line.length; j++) {
            const element = line[j];
            process.stdout.write(element);
        }
        process.stdout.write('\n');
    }
    console.log('####################################');
}

function countOccupied(room) {
    return room.reduce((prev1, curr1) => prev1 + (curr1.reduce((prev2, curr2) => prev2 + (curr2 === '#' ? 1 : 0), 0)), 0)
}

function solve1(data) {
    let room = [...data.map(l => [...l])];

    function scan(i, j, room, type) {

        let result = 0;
        for (let ai = 0; ai < 3; ai++) {
            for (let aj = 0; aj < 3; aj++) {
                if (ai === 1 && aj === 1) continue;
                const varToScan = (room[i + ai - 1] || [])[j + aj - 1];
                if (varToScan === type) {
                    result += 1;
                }
            }
        }

        return result;
    }

    printRoom(room);
    function iterate() {
        const newRoom = JSON.parse(JSON.stringify(room));

        for (let i = 0; i < room.length; i++) {
            const ei = room[i];
            for (let j = 0; j < ei.length; j++) {
                const isSeatOccupied = room[i][j] === '#';
                const isSeat = room[i][j] !== '.';
                if (!isSeat) continue;

                // const freeSeats = scan(i, j, room, 'L');
                const occupiedSeats = scan(i, j, room, '#');
                if (!isSeatOccupied && occupiedSeats === 0) {
                    newRoom[i][j] = '#';
                } else if (isSeatOccupied && occupiedSeats >= 4) {
                    newRoom[i][j] = 'L';
                }
            }
        }
        const roomChanged = JSON.stringify(room) === JSON.stringify(newRoom);
        printRoom(newRoom);
        room = newRoom;
        return roomChanged;
    }

    while (!iterate()) {
    }

    return countOccupied(room);

}

function solve2(data) {
    let room = [...data.map(l => [...l])];

    function scan(i, j, room, type) {
        let result = 0;
        function cast(stepI, stepJ) {
            let tileToCheck = '.'
            let pi = 0;
            let pj = 0;
            while(tileToCheck === '.'){
                pi += stepI;
                pj += stepJ;
                tileToCheck= (room[pi + i] || [])[pj + j]
            }
            return tileToCheck === type ? 1 : 0;
        }


        return cast(1, 0) // up
            + cast(1, 1) // up left
            + cast(0, 1) // left
            + cast(-1, 1) // down left
            + cast(-1, 0) // down
            + cast(-1, -1) // down right
            + cast(0, -1) // right
            + cast(1, -1) // down right
            ;
    }

    printRoom(room);
    function iterate() {
        const newRoom = JSON.parse(JSON.stringify(room));

        for (let i = 0; i < room.length; i++) {
            const ei = room[i];
            for (let j = 0; j < ei.length; j++) {
                const isSeatOccupied = room[i][j] === '#';
                const isSeat = room[i][j] !== '.';
                if (!isSeat) continue;

                // const freeSeats = scan(i, j, room, 'L');
                const occupiedSeats = scan(i, j, room, '#');
                if (!isSeatOccupied && occupiedSeats === 0) {
                    newRoom[i][j] = '#';
                } else if (isSeatOccupied && occupiedSeats >= 5) {
                    newRoom[i][j] = 'L';
                }
            }
        }
        const roomChanged = JSON.stringify(room) === JSON.stringify(newRoom);
        printRoom(newRoom);
        room = newRoom;
        return roomChanged;
    }
    // iterate()
    while (!iterate()) {
    }

    return countOccupied(room);

}

// console.log(solve1(inputLines));
console.log(solve2(inputLines));