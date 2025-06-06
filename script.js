const MAX_DISPLAY = 13;

let displayStr = "";
let expression = "";
let nums = [0, undefined];
let operator = undefined;
let curNum = 0;

const display = document.querySelector("#main-display");
const expDisplay = document.querySelector("#expression-display")
const numBtns = document.querySelectorAll(".num-btn");
const operatorBtns = document.querySelectorAll(".operator-btn");


const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

function operate(a, b, operator) {
    if (operator === '+')
        return add(a, b);
    if (operator === '-')
        return subtract(a, b);
    if (operator === '×')
        return multiply(a, b);
    if (operator === '÷')
        return divide(a, b);
}

// Add event to display clicked numbers
for (const btn of numBtns) {
    btn.addEventListener("click", () => {
        // Ignore leading zeroes
        if (displayStr === "0")
            displayStr = "";
        if (displayStr.length <= MAX_DISPLAY) {
            displayStr += btn.getAttribute("num");
            if (displayStr !== "0")
                expression += btn.getAttribute("num");
            nums[curNum] = parseInt(displayStr);
            display.innerHTML = displayStr;
            expDisplay.innerHTML = expression;
        }
    });
}

// Add event to enable operations
for (const btn of operatorBtns) {
    btn.addEventListener("click", () => {
        const prevOperator = operator;
        operator = btn.getAttribute("sign");
        // Add/replace the operation if the expression is incomplete.
        // Otherwise, calculate the expression.
        if (nums[1] === undefined) {
            curNum = 1;
        } else {
            nums[0] = operate(nums[0], nums[1], prevOperator);
            nums[1] = undefined;
        }
        // Make main display blank and update the expression display.
        displayStr = "";
        display.innerHTML = displayStr;
        expression = nums[0] + operator;
        expDisplay.innerHTML = expression;
    });
}