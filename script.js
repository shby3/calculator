const MAX_DISPLAY = 13;
const MAX_DECIMALS = 2;
const MAX_INT = 999999999999;
const MIN_INT = -99999999999;
const MIN_FLOAT = -99999999.99;

let nums = ["0", ""];
let operator = "";
let curNum = 0;
let result = "";
let expDisplayStr = "";

const display = document.querySelector("#main-display");
const expDisplay = document.querySelector("#expression-display");
const numBtns = document.querySelectorAll(".num-btn");
const operatorBtns = document.querySelectorAll(".operator-btn");
const clearBtn = document.querySelector(".clear-btn");
const equalsBtn = document.querySelector(".equals-btn");
const decimalBtn = document.querySelector(".decimal-btn");
const deleteBtn = document.querySelector(".delete-btn");
const negativeBtn = document.querySelector(".negative-btn");


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

// Takes a string number and rounds it to the nearest MAX_DECIMALS places, or
// rounded up to the nearest integer if it is less than MIN_FLOAT.
function roundNum(num) {
    num = parseFloat(num);
    if (num < MIN_FLOAT)
        return "" + Math.ceil(num);
    num = Math.round(num * 10 ** MAX_DECIMALS) / (10 ** MAX_DECIMALS);
    return "" + num;
}

// Update the display for the calculator
function updateDisplay() {
    const expLength = nums[0].length + operator.length + nums[1].length;
    displayStr = (expLength > MAX_DISPLAY ? 
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

// Check the length of result. Return true and alert the user if the result is too long.
// Otherwise, return false.
function checkResultLength(){
    if (result.length > MAX_DISPLAY) {
        alert(`${result} does not fit on calc display.`);
        return true;
    } 
    return false;
}

// Calculate using a full expression and store that expression in expDisplayStr.
// If the result is too long, set it to 0.
function calculate() {
    result = roundNum(operate(nums[0], nums[1], operator));
    expDisplayStr = `${nums[0]}${operator}${nums[1]}=${result}`;
        if (checkResultLength()) {
        result = "0";
    }
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
    if (nums[curNum].length < MAX_DISPLAY) {
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
    if (!nums[curNum].includes(".") && nums[curNum].length < MAX_DISPLAY) {
        if (nums[curNum] === "")
            nums[curNum] = "0";
        nums[curNum] += ".";
        updateDisplay();
    }
}

// Function for when Enter or = key pressed or = button clicked.
function pressEquals() {
    // Don't calculate if expression is incomplete
    if (nums[1] === "")
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
    const num2isZero = nums[1].charAt(0) === "0" && !nums[1].match(/[1-9]/);
    if (num2isZero && operator === "÷") {
        alert("Stop! You can't divide by zero.");
        return true;
    }
    return false;
}

// Function to delete the last pressed/clicked value from the expression.
function deleteFromExpression() {
    // Delete the operand if it was the last value entered. Set curNum back to account for that.
    // If the expression is a single digit, change it to "0" instead of deleting that digit.
    // If the number is a single negative digit, delete the negative sign as well.
    if (operator !== "" && nums[1] === "") {
        operator = "";
        curNum = 0;
    } else if (curNum === 0 && nums[0].length === 1) {
        nums[0] = "0";
    } else if (nums[curNum].length === 2 && nums[curNum].charAt(0) === "-"){
        nums[curNum] = "0";
    } else {
        nums[curNum] = nums[curNum].slice(0, -1);
    }
    updateDisplay();
}

// Function to make the current number negative/positive (multiply it by -1).
// Don't add a negative sign if it would overflow the display, the current number
// is empty, or the current number is "0".
function makeNegative() {
    if (nums[curNum] === "" || nums[curNum] === "0")
        return;
    if (nums[curNum].charAt(0) != "-") {
        if (nums[curNum].length < MAX_DISPLAY)
            nums[curNum] = "-" + nums[curNum];
    } else {
        nums[curNum] = nums[curNum].slice(1);
    }
    updateDisplay();
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

// Add event for clicking the delete button
deleteBtn.addEventListener("click", deleteFromExpression);

// Add event for clicking the negative button
negativeBtn.addEventListener("click", makeNegative);

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
    if (key === "Backspace" || key === "Delete")
        return deleteFromExpression();
});