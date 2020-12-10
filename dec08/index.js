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

function exec(programm) {
    let ip = 0;
    let acc = 0;
    const executedIps = [];
    while (true) {
        if(ip >= programm.length){
            return {
                acc, 
                exitedNormally: true
            }
        }
        const command = programm[ip][0];
        switch (command) {
            case 'nop':
                ip++;
                break;
            case 'jmp':
                ip += parseInt(programm[ip][1]);
                break;
            case 'acc': acc += parseInt(programm[ip][1]); ip++; break;
            default: throw new Error(`unknown command: ${programm[ip][0]}`);
        }
        if (executedIps.includes(ip)) break;
        executedIps.push(ip);
    }

    return {
        acc,
        exitedNormally: executedIps === programm.length
    };
}

function solve1(data) {
    const programm = data.map(it => it.split(" "));
    return exec(programm);
}

function solve2(data) {
    for (let index = 0; index < data.length; index++) {
        const editedData = [...data];
        const element = editedData[index];
        if (element.startsWith('nop')) {
            editedData[index] = editedData[index].replace('nop', 'jmp');
        } else if (element.startsWith('jmp')) {
            editedData[index] = editedData[index].replace('jmp', 'nop');
        } else{
            continue;
        }

        const programm = editedData.map(it => it.split(" "));
        const result = exec(programm);
        if(result.exitedNormally){
            console.log('asdasd');
            return result.acc;
        }
    }

    return -1;
}

// console.log(solve1(inputLines));
console.log(solve2(inputLines));