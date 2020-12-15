
const realInputs = [19, 20, 14, 0, 9, 1];
const testInputs = [0, 3, 6];

function solve(inputs, turns) {
    const mem = new Map();

    let lastSpoken = undefined;
    for (let turn = 0; turn < turns; turn++) {
        let speak;
        if (turn < inputs.length) {
            speak = inputs[turn];
        }
        else if (mem.get(lastSpoken) === undefined) {
            speak = 0
        } else {
            speak = turn - mem.get(lastSpoken) - 1
        }
        mem.set(lastSpoken, turn - 1);
        lastSpoken = speak;
    }
    return lastSpoken;
}

function solve2(data) {

}

console.log(solve(realInputs, 2020));
console.log(solve(realInputs, 30000000));