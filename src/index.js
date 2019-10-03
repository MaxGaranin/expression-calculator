function expressionCalculator(expr) {
    //--------------------------
    //     Constants
    //--------------------------  

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
        '/': (x, y) => x / y
    };

    //--------------------------
    //        Main
    //--------------------------  

    let opStack = [];
    let rpnStack = [];

    let chars = [];
    for (const ch of expr) {
        if (ch == ' ') continue;
        chars.push(ch);
    }

    for (const ch of chars) {
        if (isOperation(ch)) {
            if (opStack.length == 0) {
                opStack.push(ch);
            }
            else if (isOperation(ch)) {
                if (ch == OPEN_BRACKET) {
                    opStack.push(ch);
                }
                else if (ch == CLOSE_BRACKET) {
                    while (true) {
                        let op = opStack.pop();
                        if (op == OPEN_BRACKET || opStack.length == 0) break;
                        rpnStack.push(op);
                    }
                }
                else {
                    while (opStack.length > 0 && PRIORITIES[peek(opStack)] >= PRIORITIES[ch]) {
                        let op = opStack.pop();
                        rpnStack.push(op);
                    }
                    opStack.push(ch);
                }
            }
        }
        else {
            rpnStack.push(ch);
        }
    }

    while (opStack.length > 0) {
        rpnStack.push(opStack.pop());
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