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


const elements = [];
let currentElement = {};
for (let index = 0; index < inputLines.length; index++) {
    const element = inputLines[index];
    if (!element) {
        elements.push(currentElement);
        currentElement = {};
    } else {
        element.split(" ").forEach(it => {
            const tmp = it.split(":");
            currentElement[tmp[0]] = tmp[1];
        })
    }
}
elements.push(currentElement);

const requiredFields = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid',
    // 'cid',
]

const checker = (arr, target) => target.every(v => arr.includes(v));
console.log(elements.reduce((cnt, val) => {
    if (checker(Object.keys(val), requiredFields)) {
        return cnt + 1;
    } else {
        return cnt;
    }
}, 0));

String.prototype.isNumber = function () { return /^\d+$/.test(this); }
String.prototype.isHexColor = function () { return /^#([a-fA-F0-9]{6})$/.test(this); }
String.prototype.isPassportNumber = function () { return /^([0-9]{9})$/.test(this); }
String.prototype.numericAndBetween = function (min, max) {
    try {
        const val = parseInt(this);
        if (val < min) return false;
        if (val > max) return false;
        return true;
    } catch (error) {
        return false
    }
}

const requiredFieldsWithValidation = {
    'byr': {
        matches: (it) => it.numericAndBetween(1920, 2020)
    },
    'iyr': {
        matches: (it) => it.numericAndBetween(2010, 2020)
    },
    'eyr': {
        matches: (it) => it.numericAndBetween(2020, 2030)
    },
    'hgt': {
        matches(it) {
            const val = it.substring(0, it.length - 2);
            if (!val.isNumber()) return false;
            if (it.endsWith('cm')) {
                return val.numericAndBetween(150, 193);
            } else if (it.endsWith('in')) {
                return val.numericAndBetween(59, 76);
            } else {
                return false;
            }
        }
    },
    'hcl': {
        matches: (it) => it.isHexColor()
    },
    'ecl': {
        matches: (it) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(it)
    },
    'pid': {
        matches: (it) => it.isPassportNumber()
    },
}

console.log(elements.reduce((cnt, val) => {
    const isValid = Object.keys(requiredFieldsWithValidation).reduce((valid, key) => {
        if (!val[key]) return false;
        return valid && requiredFieldsWithValidation[key].matches(val[key]);
    }, true)

    if (isValid) {
        return cnt + 1;
    } else {
        return cnt;
    }
}, 0));