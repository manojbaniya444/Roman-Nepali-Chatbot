function* numberGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

const gen = numberGenerator()
console.log(gen.next().value)
console.log(gen.next().value)
console.log(gen.next().value)
console.log(gen.next().done) // true

console.log("ANOTHER\n")

function* countToFive() {
    for (let i = 1; i <= 5; i++) {
        yield i
    }
}

const countgen = countToFive()
for (const number of countgen) {
    console.log(number)
}