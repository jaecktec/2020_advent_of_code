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

const input = fs.readFileSync(path.resolve(path.resolve(), 'input.txt'), 'utf8')
const inputLines = input.split('\n');

const maxRow = 127;
const maxCol = 7;
const upper = 'B';
const lower = 'F';

function computeRow(encoded){
    const allNumbers = [];
    for (let index = 0; index <= maxRow; index++) {
        allNumbers.push(index);
    }

    const row = [...encoded.substring(0, 7)].reduce((arr, char) => {
        const middle = (arr.length) / 2;
        if(char === upper){
            return arr.slice(middle);
        }else{
            return arr.slice(0, middle);
        }
    }, allNumbers.slice())[0];
    return row;
}

function computeCol(encoded){
    const allNumbers = [];
    for (let index = 0; index <= maxCol; index++) {
        allNumbers.push(index);
    }

    const row = [...encoded.substring(7)].reduce((arr, char) => {
        const middle = (arr.length) / 2;
        if(char === 'R'){
            return arr.slice(middle);
        }else{
            return arr.slice(0, middle);
        }
    }, allNumbers.slice())[0];
    return row;
}

function getSeatId(encoded){
    return computeCol(encoded) + computeRow(encoded) * 8
}

const allIds = inputLines.map(it => getSeatId(it));
console.log(Math.max(...allIds))

const previousSeat = allIds.find(id => {
    // find where there is a seat which previous seat is not in the list
    return !allIds.includes(id + 1) && allIds.includes(id + 2)
})
console.log(previousSeat  + 1);

// console.log(getSeatId('BFFFBBFRRR'), 567)
// console.log(getSeatId('FFFBBBFRRR'), 119)
// console.log(getSeatId('BBFFBBFRLL'), 820)


