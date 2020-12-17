const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8')
// const inputLines = input.split('\n');
const inputGroups = input.split(/\r?\n\r?\n/);

function unique(value, index, self) {
    return self.indexOf(value) === index;
}
const or = (prev, curr) => prev || curr;
const and = (prev, curr) => prev && curr;


function parseRule(it) {
    return it.split(": ")[1].split(' or ')
        .map(it => ({
            min: parseInt(it.split('-')[0]),
            max: parseInt(it.split('-')[1])
        }));
}

function solve1(inputGroups) {
    const rules = inputGroups[0].split("\n").flatMap(it => parseRule(it));
    const [_, ...nearbyTickets] = inputGroups[2].split('\n')
    const nearbyTicketsParsed = nearbyTickets.map(it => it.split(',').map(it => parseInt(it)))
    const errors = nearbyTicketsParsed.flatMap(it => it.filter(val => rules.map(rule => val < rule.min || val > rule.max).reduce(and, true)))
    return errors.reduce((prev, curr) => prev + curr, 0)
}


function solve2(inputGroups) {
    const rawGroups = inputGroups[0].split("\n")
    const rules = rawGroups.flatMap(it => parseRule(it));
    const namedRules = rawGroups.map(it => ({
        name: it.split(": ")[0],
        conditions: parseRule(it)
    }));
    const [_, ...nearbyTickets] = inputGroups[2].split('\n');
    const nearbyTicketsParsed = nearbyTickets.map(it => it.split(',').map(it => parseInt(it)));
    const validTickets = nearbyTicketsParsed
        .filter(it => {
            return it
                .map(val => rules
                    .map(rule => val >= rule.min && val <= rule.max)
                    .reduce(or, false)
                )
                .reduce(and, true)
        });

    function matchConditions(conditions, value) {
        return conditions.map(rule => value >= rule.min && value <= rule.max).reduce(or, false)
    }

    const grouped = validTickets.reduce((prev, curr) => {
        curr.forEach((val, idx) => {
            if(prev[idx] === undefined){
                prev[idx] = [];
            }
            prev[idx].push(val);
        });
        return prev;
    }, [])

    let possibleRules = grouped
        .map(gr => namedRules.filter(({conditions}) => gr.map(it => matchConditions(conditions, it)).reduce(and, true)))
        .map((gr, index) => gr.map(g => ({...g, index})))
    
    const pickedRules = [];

    while(true){
        const definiteMatch = possibleRules.find(it => it.length === 1)[0];
        pickedRules.push(definiteMatch);
        possibleRules = possibleRules.map(it => it.filter(r => r.name != definiteMatch.name)).filter(it => it.length !== 0);
        if(possibleRules.length === 0) break;
    }

    const myTicket = inputGroups[1].split('\n')[1].split(',').map(it => parseInt(it));

    return pickedRules.reduce((prev, curr) => {
        if(curr.name.startsWith('departure')){
            return prev * myTicket[curr.index]
        } else{
            return prev
        }
    }, 1)
}

console.log(solve1(inputGroups));
// console.log(solve2(inputGroups));