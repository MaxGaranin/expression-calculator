const { expressionCalculator } = require("./src/index");

let result = expressionCalculator('3 + 4 * 2 / (1 - 5) * 2');
console.log(result);

result = expressionCalculator('3 + 4 * 2 / ((1 - 5) * 2)');
console.log(result);