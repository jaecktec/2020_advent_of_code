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
const lineRegex = /(\d*)-(\d*)\s(\S):\s([a-z]*)/;

performance.mark('A');
const validPassword1 = inputLines.reduce((numValid, it) => {
    const match = lineRegex.exec(it);
    const policyCount = [...match[4]].reduce((cnt, char) => char ===match[3] ? ++cnt : cnt, 0);
    return parseInt(match[1]) <= policyCount && policyCount <= parseInt(match[2]) ? ++numValid : numValid;
}, 0);
performance.mark('B');

const validPassword2 = inputLines.reduce((numValid, it) => {
    const match = lineRegex.exec(it);
    const passwordArray = match[4];
    return passwordArray[parseInt(match[1]) - 1] === match[3] ^ passwordArray[parseInt(match[2]) - 1] === match[3] ? ++numValid : numValid;
}, 0);
performance.mark('C');

console.log(`Valid passwords part 1: ${validPassword1}`);
console.log(`Valid passwords part 2: ${validPassword2}`);

performance.measure('read input', 'Start', 'A');
performance.measure('part 1', 'A', 'B');
performance.measure('part 2', 'B', 'C');
