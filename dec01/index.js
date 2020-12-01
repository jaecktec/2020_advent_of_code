const { performance, PerformanceObserver } = require('perf_hooks');
const obs = new PerformanceObserver((items) => {
    items.getEntries().forEach(({duration, name}) => {
        console.log(`${name} = ${duration} ms`)
    });
    // performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });
performance.measure('Start to Now');
const values = require('./values.json');

const array = values.values


function calculateStep1() {
    for (let a = 0; a < array.length; a++) {
        const ra = array[a];
        for (let b = 0; b < array.length; b++) {
            if(a < b) continue;
            const rb = array[b];
            if (ra + rb === 2020) {
                console.log(`${ra} + ${rb} === 2020, => ${ra} * ${rb} = ${ra * rb}`);
                return;
            }
        }
    }
}

function calculateStep2() {
    for (let a = 0; a < array.length; a++) {
        const ra = array[a];
        for (let b = 0; b < array.length; b++) {
            const rb = array[b];
            if(a < b) continue;
            for (let c = 0; c < array.length; c++) {
                if(b < c) continue;
                const rc = array[c];
                if (ra + rb + rc === 2020) {
                    console.log(`${ra} + ${rb} + ${rc} === 2020, => ${ra} * ${rb} * ${rc} = ${ra * rb * rc}`);
                    return;
                }
            }
        }
    }
}

performance.mark('A');
calculateStep1();
performance.mark('B');
calculateStep2();
performance.mark('C');
performance.measure('A to B', 'A', 'B');
performance.measure('B to C', 'B', 'C');