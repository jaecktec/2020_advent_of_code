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

const parsedInput = inputLines.map(it => parseInt(it));

const preamble = 25;

function solve1(data) {


    function asdf(elem, vals, path) {
        if(path.length >= 2) return false;
        return vals.reduce((prev, curr, idx, arr) => {
            const remaining = [...arr];
            remaining.shift();
            const match = elem - curr === 0;
            if(match){
                // console.log([...path, curr]);
                return true;
            }
            return prev || elem - curr === 0 || asdf(elem - curr, remaining, [...path, curr]);
        }, false)
    }



    // return asdf(127, checks, [])
    for (let n = preamble; n < data.length; n++) {
        const checks = [...data].slice(n - preamble, n);

        const element = data[n];
        // console.log(`checking ${element}`);
        if(!asdf(element, checks, [])){
            console.log(`${element} is sus`)
            return element
        }
    }


    

}

function solve2(data) {
    const susNumber = solve1(data);
    function asdf(input, vals, numVars) {
        for (let index = 0; index < vals.length; index++) {
            const slice = vals.slice(index, index + numVars);
            if(slice.length < numVars){
                return asdf(input, vals, ++numVars);
            }

            if(slice.reduce((a, b) => a + b, 0) === input){
                return slice;
            }
        }
    }
    const possibleNumbers = asdf(susNumber, data, 2);
    const all = Array.from(possibleNumbers);
    return Math.min(...all) + Math.max(...all);
}

// console.log(solve1(parsedInput));
console.log(solve2(parsedInput));