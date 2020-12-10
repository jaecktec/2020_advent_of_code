const { group } = require('console');
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
const inputLines = input.split(/\r?\n\r?\n/);

function solve1(data) {
    const counts = data.map(group => {
        const answers = group.split(/\r?\n/).join("");

        const uniqueAnswers = [];
    
        for (answer of answers) {
            if (!uniqueAnswers.includes(answer)) {
                uniqueAnswers.push(answer);
            }
        }
    
        return uniqueAnswers;
    }).map((a) => a.length);

    return counts.reduce((sum, count) => sum + count, 0);
}

function solve2(data) {
    const counts = data.map(group =>  {
        const answers = group.split(/\r?\n/);
    
        const commonAnswers = [];
        const uniques = uniqueAnswers(group);
    
        for (unique of uniques) {
            if (answers.every((answer) => answer.includes(unique))) {
                commonAnswers.push(unique);
            }
        }
    
        return commonAnswers.length;
    });

    return counts.reduce((sum, count) => sum + count, 0);
}

// console.log(solve1(inputLines));
console.log(solve2(inputLines));