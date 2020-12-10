const fs = require('fs');
const path = require('path');
const { performance, PerformanceObserver } = require('perf_hooks');
const obs = new PerformanceObserver((items) => {
    items.getEntries().forEach(({duration, name}) => {
        console.log(`${name} = ${duration} ms`)
    });
});
obs.observe({ entryTypes: ['measure'] });
performance.measure('Start to Now');


performance.mark('Start');

const input = fs.readFileSync(path.resolve(path.resolve(), 'input.txt'), 'utf8')
const inputLines = input.split('\n');

function traverseMap(stepRight, stepDown){
    let cnt = 0;
    for (let index = 0; index < inputLines.length; index += stepDown) {
        const element = inputLines[index];
        const traverse = (stepRight / stepDown * index) % element.length;
        if(element[traverse] === '#') {
            cnt += 1;
        }
    }
    return cnt;
}
console.log(traverseMap(3, 1));

const result = []
// Right 1, down 1.
result.push(traverseMap(1, 1))
// Right 3, down 1. (This is the slope you already checked.)
result.push(traverseMap(3, 1))
// Right 5, down 1.
result.push(traverseMap(5, 1))
// Right 7, down 1.
result.push(traverseMap(7, 1))
//  Right 1, down 2.
result.push(traverseMap(1, 2))

console.log(result.reduce((cnt, curr) => cnt*curr, 1));