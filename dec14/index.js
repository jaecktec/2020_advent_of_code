const fs = require('fs');
const { parse } = require('path');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8')
const inputLines = input.split('\n');

function solve1(data) {
    function applyMask(value, mask) {
        const result = [...value.padStart(mask.length, '0')];
        for (let mIdx = mask.length - 1; mIdx >= 0; mIdx--) {
            const element = mask[mIdx];
    
            switch (element) {
                case '1': result[mIdx] = '1'; break;
                case '0': result[mIdx] = '0'; break;
                case 'X': continue;
            }
        }
        return result.reduce((a, b) => `${a}${b}`);
    }
    const mem = {};
    let mask;

    for (let index = 0; index < data.length; index++) {
        const line = data[index];
        if (line.startsWith('mem')) {
            const [pos, posVal] = line.substr(4).split('] = ');
            mem[pos] = applyMask((parseInt(posVal) >>> 0).toString(2), mask);
        } if (line.startsWith('mask')) {
            mask = line.substr(7)
        }
    }
    const result = Object.keys(mem).reduce((res, val) => {
        return res + parseInt(mem[val], 2);
    }, 0)
    // console.log(mem, result);
    return result
}

function getAllFloats(mask) {
    const result = [];
    const xcount = [...mask].reduce((a, b) => a + (b === 'X' ? 1 : 0), 0)
    for (let index = 0; index < 2 ** xcount; index++) {
        const element = (index >>> 0).toString(2).padStart(xcount, '0');
        const modMask = [...mask].reverse();
        let prevIdx = 0;
        for (let elIdx = 0; elIdx < element.length; elIdx++) {
            const currIdx = modMask.indexOf('X', prevIdx);
            modMask[currIdx] = element[elIdx];
            prevIdx = currIdx + 1;
        }
        const moddedMask = modMask.reverse().reduce((a, b) => `${a}${b}`)
        result.push(moddedMask)
    }
    return result;
}

function solve2(data) {
    function applyMask(value, mask) {
        const paddedValue = value.padStart(mask.length, '0')
        let result = '';
        for (let mIdx = mask.length - 1; mIdx >= 0; mIdx--) {
            const maskElement = mask[mIdx];
            const valueElement = paddedValue[mIdx];
            switch (maskElement) {
                case 'X': result = 'X' + result; break;
                default: result = `${valueElement | maskElement}` + result; break;
            }
        }
        return result;
    }
    const mem = {};
    let mask;
    for (let index = 0; index < data.length; index++) {
        const line = data[index];
        if (line.startsWith('mem')) {
            const [pos, posVal] = line.substr(4).split('] = ');
            const addr = (parseInt(pos) >>> 0).toString(2);
            const maskedAddr = applyMask(addr, mask);
            const af = getAllFloats(maskedAddr)
            for (const memAddr in af) {
                mem[parseInt(af[memAddr], 2)] = posVal
            }
        } if (line.startsWith('mask')) {
            mask = line.substr(7)
        }
    }
    const result = Object.keys(mem).reduce((res, val) => {
        return res + parseInt(mem[val]);
    }, 0)
    return result
}
// console.log(solve1(inputLines));
console.log(solve2(inputLines));