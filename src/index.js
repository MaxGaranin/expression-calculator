function expressionCalculator(expr) {
    //--------------------------
    //     Constants
    //--------------------------  

    const EPS6 = 1E-6;
    const ERROR_DIVIZION_BY_ZERO = 'TypeError: Division by zero.';
    const ERROR_BRACKETS_MUST_BE_PAIRED = 'ExpressionError: Brackets must be paired';

    const OPEN_BRACKET = "(";
    const CLOSE_BRACKET = ")";

    const PRIORITIES = {
        '(': 1,
        ')': 1,
        '+': 2,
        '-': 2,
        '*': 3,
        '/': 3
    };

    const OPERATIONS = {
        '+': (x, y) => x + y,
        '-': (x, y) => x - y,
        '*': (x, y) => x * y,
        '/': (x, y) => {
            if (Math.abs(y) < EPS6) {
                throw new Error(ERROR_DIVIZION_BY_ZERO);
            }
            return x / y;
        }
    };

    //--------------------------
    //        Main
    //--------------------------  

    let opStack = [];
    let rpnStack = [];

    let tokens = [];
    let buf = '';
    for (const ch of expr) {
        if (ch == ' ') {
            continue;
        }
        else if (isOperation(ch)) {
            if (buf.length > 0) {
                tokens.push(buf);
                buf = '';
            }
            tokens.push(ch);
        }
        else {
            // numbers
            buf += ch;
        }
    }
    if (buf.length > 0) tokens.push(buf);

    for (const token of tokens) {
        if (isOperation(token)) {
            if (opStack.length == 0) {
                opStack.push(token);
            }
            else if (isOperation(token)) {
                if (token == OPEN_BRACKET) {
                    opStack.push(token);
                }
                else if (token == CLOSE_BRACKET) {
                    while (true) {
                        if (opStack.length == 0) {
                            throw new Error(ERROR_BRACKETS_MUST_BE_PAIRED);
                        }
                        let op = opStack.pop();
                        if (op == OPEN_BRACKET) break;
                        rpnStack.push(op);
                    }
                }
                else {
                    while (opStack.length > 0 && PRIORITIES[peek(opStack)] >= PRIORITIES[token]) {
                        let op = opStack.pop();
                        rpnStack.push(op);
                    }
                    opStack.push(token);
                }
            }
        }
        else {
            rpnStack.push(token);
        }
    }

    while (opStack.length > 0) {
        let token = opStack.pop();
        if (!isOperation(token) || token == OPEN_BRACKET) {
            throw new Error(ERROR_BRACKETS_MUST_BE_PAIRED);
        }
        rpnStack.push(token);
    }

    let result = calculateRpn(rpnStack);
    return result;

    //--------------------------
    //     Local functions
    //--------------------------    

    function calculateRpn(rpnStack) {
        let numbersStack = [];

        for (const ch of rpnStack) {
            if (isOperation(ch)) {
                let b = numbersStack.pop();
                let a = numbersStack.pop();
                let c = OPERATIONS[ch](a, b);
                numbersStack.push(c);
            }
            else {
                numbersStack.push(parseFloat(ch));
            }
        }

        return numbersStack.pop();
    }

    function isOperation(ch) {
        return "+-*/()".indexOf(ch) >= 0;
    }

    function peek(stack) {
        return stack[stack.length - 1];
    }
}

module.exports = {
    expressionCalculator
}