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
const parsedInput = inputLines.map(it => parseInt(it));

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

function solveTest1() {
    const input = fs.readFileSync(path.resolve(__dirname, 'test-input.txt'), 'utf8')
    const data = input.split('\n');
    const parsedInput = data.map(it => parseInt(it));
    return solve1(parsedInput)
}

function solve1(data) {
    let jolts = 0;
    let oneDiffs = 0;
    let threeDiffs = 1; // magic number 0o, think its because of we start with one,.. trial and error
    const sorted = [...data];
    sorted.sort(function (a, b) {
        return a - b;
    });
    for (let index = 0; index < length; index++) {
        const it = sorted[index];
        if (it - jolts === 3) {
            threeDiffs++;
        } else if (it - jolts === 1) {
            oneDiffs++;
        }
        jolts = it;
    }

    return oneDiffs * threeDiffs;
}

function solve2(data) {
    const sorted = [...data];
    sorted.push(0);
    sorted.push(Math.max(sorted) + 3);
    sorted.sort(function (a, b) {
        return a - b;
    });

    const length = sorted.length;

    const checked = {};
    function arrange(num){
        if(num === sorted.length - 1){
            return 1;
        }
        if(checked[num]){
            return checked[num];
        }

        let arranged = arrange(num + 1);

        if(num < length && sorted[num + 2] <= sorted[num] + 3){
            arranged += arrange(num + 2)
        }

        if(num < length && sorted[num + 3] <= sorted[num] + 3){
            arranged += arrange(num + 3)
        }

        checked[num] = arranged;
        return arranged;
    }
    return arrange(0);
}

// console.log(solveTest1());
// console.log(solve1(parsedInput));
console.log(solve2(parsedInput));