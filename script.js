const MAX_DISPLAY = 13;
const MAX_DECIMALS = 2;

let nums = ["0", ""];
let operator = "";
let curNum = 0;
let result = "";
let displayStr = "";
let expDisplayStr = "";

const display = document.querySelector("#main-display");
const expDisplay = document.querySelector("#expression-display")
const numBtns = document.querySelectorAll(".num-btn");
const operatorBtns = document.querySelectorAll(".operator-btn");
const clearBtn = document.querySelector(".clear-btn");
const equalsBtn = document.querySelector(".equals-btn");
const decimalBtn = document.querySelector(".decimal-btn");


const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

function operate(a, b, operator) {
    a = parseFloat(a);
    b = parseFloat(b);
    if (operator === '+')
        return add(a, b);
    if (operator === '-')
        return subtract(a, b);
    if (operator === '×')
        return multiply(a, b);
    if (operator === '÷')
        return divide(a, b);
}

// Takes a string number and rounds it to the nearest MAX_DECIMALS places.
function roundNum(num) {
        num = parseFloat(num);
        num = Math.round(num * 10 ** MAX_DECIMALS) / (10 ** MAX_DECIMALS);
        return "" + num;
}

// Update the display for the calculator
function updateDisplay() {
    const expLength = nums[0].length + operator.length + nums[1].length;
    displayStr = (expLength >= MAX_DISPLAY ? 
        `${nums[0]}<br>${operator}<br>\n${nums[1]}` :
        `${nums[0]}${operator}${nums[1]}`);
    display.innerHTML = displayStr;
    // Show the last expression.
    expDisplay.innerHTML = expDisplayStr;
}

// Function to convert "*" to "×" and "/" to "÷" if applicable.
function convertOperator(key) {
    if (key === "*")
        return "×";
    if (key === "/")
        return "÷";
    return key;
}

// Calculate using a full expression and store that expression in expDisplayStr.
function calculate() {
    result = roundNum(operate(nums[0], nums[1], operator));
    expDisplayStr = `${nums[0]}${operator}${nums[1]}=${result}`;
}

// Reset nums, operation, and curNum to default values or updated ones.
function resetExpression(num1="0", num2="", nextOperator="", nextNum=0) {
    nums[0] = num1;
    nums[1] = num2;
    operator = nextOperator;
    curNum = nextNum;
}

// Function for when a number is clicked or the associated key is pressed
function pressNumber(btn=null, key=null) {
    if (key === null)
        key = btn.getAttribute("num");
    // Ignore leading zeroes
    if (nums[curNum] === "0")
        nums[curNum] = "";
    if (nums[curNum].length <= MAX_DISPLAY) {
        nums[curNum] += key;
        updateDisplay();
    }
}

// Function for when an operator is clicked or the associated key is pressed
function pressOperator(btn=null, key=null) {
    if (key === null)
        key = btn.getAttribute("sign");
    if (operator !== "" && nums[1] !== "") {
        calculate();
        resetExpression(result, "", key, 1);
    }
    else
        resetExpression(nums[0], nums[1], key, 1);
    updateDisplay();
}

// Function for when a decimal is clicked or the . key is pressed
function pressDecimal() {
    if (!nums[curNum].includes(".") && nums[curNum].length <= MAX_DISPLAY) {
        nums[curNum] += ".";
        updateDisplay();
    }
}

// Function for when Enter or = key pressed or = button clicked.
function pressEquals() {
    if (curNum === 0)
        return;
    // Don't calculate if expression divides by zero
    if (divideByZero())
        return;
    calculate();
    // Result becomes the new first number. Reset the operation and second number.
    resetExpression(result);
    updateDisplay();
}

// Function to clear calculator
function clear() {
    expDisplayStr = "";
    resetExpression();
    updateDisplay();
}

// Function to check if the user is trying to divide by zero. Display a message and
// return true if they are. Otherwise, return false.
function divideByZero() {
    if (nums[1] === "0" && operator === "÷") {
        alert("Stop! You can't divide by zero.");
        return true;
    }
    return false;
}

// Add event to display clicked numbers on calculator
for (const btn of numBtns) {
    btn.addEventListener("click", () => pressNumber(btn));
}
// Add event for decimal button clicked
decimalBtn.addEventListener("click", pressDecimal);

// Add event to enable operations
for (const btn of operatorBtns) {
    btn.addEventListener("click", () => pressOperator(btn));
}

// Add event for equals button
equalsBtn.addEventListener("click", pressEquals);

// Add event for clicking the clear button
clearBtn.addEventListener("click", clear);

// When keys with associated buttons are clicked, behave as if they were clicked
document.addEventListener("keydown", (e) => {
    let key = e.key;
    if ("0123456789".includes(key))
        return pressNumber(null, key);
    if ("*/-+".includes(key)) {
        key = convertOperator(key);
        return pressOperator(null, key);
    }
    if (key.toLowerCase() === "c")
        return clear();
    if (key === ".")
        return pressDecimal();
    if (key === "=" || key === "Enter")
        return pressEquals();
});