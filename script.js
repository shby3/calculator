let num1;
let num2;
let operator;
let displayStr = "";
let curNum = 1;

const display = document.querySelector("#display");
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
    if (operator === '*')
        return multiply(a, b);
    if (operator === '/')
        return divide(a, b);
}

// Add event to display clicked numbers
for (const btn of numBtns) {
    btn.addEventListener("click", () => {
        if (displayStr.length <= 10) {
            displayStr += btn.getAttribute("num");
            display.textContent = displayStr;
        }
    });
}

// Add event to enable operations
