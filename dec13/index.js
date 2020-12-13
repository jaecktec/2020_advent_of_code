const { O_TRUNC } = require('constants');
const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8')
const inputLines = input.split('\n');

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

function getDeparture(time, inService) {
    const busLines = inService.filter(bl => time % bl === 0);
    busLines.sort(function (a, b) {
        return a - b;
    });
    return {
        time,
        bus: busLines,
    }
}

function getDepartures(startTime, endTime, inService) {
    return Array(endTime - startTime).fill().map((_, i) => i + startTime).map(it => getDeparture(it, inService));
}


function solve1(data) {
    const earliestDeparture = parseInt(data[0]);
    const busLines = data[1].split(',').filter(it => it !== 'x').map(it => parseInt(it));
    const departures = getDepartures(earliestDeparture - 10, earliestDeparture + 30, busLines);
    const match = departures
        .filter(it => it.time >= earliestDeparture)
        .filter(it => it.bus.reduce((prev, curr) => prev || busLines.includes(curr), false))
        .reduce((prev, curr) => curr.time < prev.time ? curr : prev, { time: 1000000000000 });
    console.log(match);
    return (match.time - earliestDeparture) * match.bus[0];
}

function printDeparture(departures, inService) {
    console.table([
        ...departures.map(it => {
            const result = { time: `${it.time}` };
            inService.forEach(bus => {
                result[`bus ${bus}`] = it.bus.includes(bus) ? 'D' : '.';
            })
            return result
        })
    ])
}

function solve2(data) {
    const [firstBus, ...busLines] = data[1].split(',').map((bl, idx) => [bl, idx]).filter(it => it[0] !== 'x').map(it => {
        it[0] = parseInt(it[0]);
        return it;
    });
    // const [firstBus, ...busLines] = data[1].split(',').map((bl, idx) => [bl, idx]);
    const predictRange = data[1].split(',').length

    let time = 0;
    let steps = 0;
    // this solution does not find a result in my livetime
    /* 
    while (++time) {

        if (++steps % 100000 === 0) {
            console.log(time)
        }

        const matches = busLines.map(it => ({
            bl: it[0],
            match: it[0] === 'x' || (time + it[1]) % parseInt(it[0]) === 0
        }))

        const match = matches.reduce((prev, curr) => prev && curr.match, true)

        if (!match) {
            continue;
        }
        const bl = data[1].split(',').filter(it => it !== 'x').map(it => parseInt(it));
        var departures = getDepartures(time, time + predictRange, bl);
        printDeparture(departures, bl);
        console.log(`steps: ${steps}`);
        break;
    }
    // const asdf = getDepartures(departed[0].departed - 10, departed[departed.length - 1].departed + 10, busLines)
    // printDeparture(asdf, busLines);
    // console.log(departed, asdf);
    */


    // insight: we can find our matches, then multiply with the bus number to keep the previous match upright (common denomiator)
    // the initial multiplier is the id of the first bus, because it departs every time and we can start here
    let denominator = firstBus[0]

    for (let index = 0; index < busLines.length; index++) {
        const [busLine, offset] = busLines[index];
        // find match
        while(true){
            steps++;
            if((time + offset) % busLine === 0){
                // found a match, now we can skip a lot of results
                denominator *= busLine
                break;
            }
            // if not, we add the common denominator to keep the previous matches upright
            time += denominator;
        }
    }

    const bl = data[1].split(',').filter(it => it !== 'x').map(it => parseInt(it));
    var departures = getDepartures(time, time + predictRange, bl);
    printDeparture(departures, bl);
    console.log(`steps: ${steps}`);

    return time;
}

// console.log(solve1(inputLines));
console.log(solve2(inputLines));