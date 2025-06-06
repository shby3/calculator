let operator;
let displayStr = "5/";
let num1 = 0;
let num2 = 0;
let result = 0;

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
    if (operator === '×')
        return multiply(a, b);
    if (operator === '÷')
        return divide(a, b);
}

// Add event to display clicked numbers
for (const btn of numBtns) {
    btn.addEventListener("click", () => {
        if (displayStr.length <= 10) {
            displayStr += btn.getAttribute("num");
            display.innerHTML = displayStr;
        }
    });
}

// Add event to enable operations
for (const btn of operatorBtns) {
    btn.addEventListener("click", () => {
        const nums = displayStr.split(/[÷×\-+]/);
        const sign = btn.getAttribute("sign");
        console.log(nums);
        console.log(sign);
        // If there are two numbers and an operation, calculate the result.
        // Otherwise, change the sign to the sign of the pressed operation.
        if (nums.length == 2) {
            num1 = parseInt(nums[0]);
            num2 = parseInt(nums[1]);
            result = operate(num1, num2, sign);
            console.log(`${num1} ${sign} ${num2} = ${result}`);
        } else {
            displayStr += sign;
            display.innerHTML = displayStr;
        }
    });
}