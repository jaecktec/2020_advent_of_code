const values = require('./values.json');

console.log(values);
const array = values.values


function calculateStep1(){
    for (let a = 0; a < array.length; a++) {
        const ra = array[a];
        for (let b = 0; b < array.length; b++) {
            const rb = array[b];
            if(ra + rb === 2020){
                console.log(`${ra} + ${rb} === 2020, => ${ra} * ${rb} = ${ra*rb}`);
                return;
            }
        }
    }
}

function calculateStep2(){
    for (let a = 0; a < array.length; a++) {
        const ra = array[a];
        for (let b = 0; b < array.length; b++) {
            const rb = array[b];
            for (let c = 0; c < array.length; c++) {
                const rc = array[c];
                if(ra + rb + rc === 2020){
                    console.log(`${ra} + ${rb} + ${rc} === 2020, => ${ra} * ${rb} * ${rc} = ${ra*rb*rc}`);
                    return;
                }
            }
        }
    }
}

calculateStep1();
calculateStep2();