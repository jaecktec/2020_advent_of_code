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

function parseBags(data) {
    return data.map(it => {
        const splitted = it.split(' bags contain ')
        const canContain = splitted[1].slice(0, -1).split(', ')

        return {
            obj: splitted[0],
            canContain: canContain[0] === 'no other bags' ? [] : canContain.map(contain => ({
                obj: contain.substring(2).replace(" bags", "").replace(" bag", ""),
                amount: parseInt(contain.substring(0, 1))
            }))
        }
    });
}

function solve1(data) {
    const mapped = parseBags(data);

    function canHold(bag) {
        const possibleBags = mapped.filter(m => m.canContain.map(m2 => m2.obj).includes(bag)).map(m => m.obj)
        return possibleBags.concat(possibleBags.map(pb => canHold(pb)).flatMap(it => it));
    }

    const ch = canHold('shiny gold').filter(unique)

    return ch.length;
}

function solve2(data) {
    const mapped = parseBags(data);
    var mappedObj = mapped.reduce(function(map, obj) {
        map[obj.obj] = obj.canContain;
        return map;
    }, {});

    function numContain(bag){
        const contains = mappedObj[bag]
        return contains.reduce((curr, b) => {
            return  curr + b.amount + b.amount * numContain(b.obj);
        }, 0)
    }

    const cc = numContain('shiny gold');

    return cc;
}

// console.log(solve1(inputLines));
console.log(solve2(inputLines));