// Wait for DOM to be loaded before accessing elements
document.addEventListener('DOMContentLoaded', function () {
  const calcOutput = document.querySelector('.calc-output');
  const buttons = document.querySelectorAll('button');

  let currentValue = "0";
  let previousValue = "0";
  let operation;

  // add event listener to each button
  buttons.forEach((button) => button.addEventListener('click', buttonClicked));

  // Handle button click
  function buttonClicked(event) {
    event.preventDefault();

    const button = event.target;
    const buttonType = button.getAttribute('type');

    // testButton(button);

    switch (buttonType) {
      case 'clear':
        clearValue();
        break;
      case 'backspace':
        handleBackspace();
        break;
      case 'number':
        appendNumber(button.innerText);
        break;
      case 'division':
        setOperation('division');
        break;
      case 'multiplication':
        setOperation('multiplication');
        break;
      case 'subtraction':
        setOperation('subtraction');
        break;
      case 'addition':
        setOperation('addition');
        break;
      case 'perform':
        performCurrentOperation();
        break;
    }

    // display calculator output
    calcOutput.innerText = currentValue;

  }

  // Append a number to the current value
  function appendNumber(buttonValue) {
    currentValue = currentValue === '0' ? buttonValue : currentValue + buttonValue;
  }

  // Clear the current value
  function clearValue() {
    currentValue = '0';
  }

  // Handle backspace functionality
  function handleBackspace() {
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
  }

  // Set the selected operation
  function setOperation(selectedOperation) {
    previousValue = currentValue;
    currentValue = '0';
    operation = selectedOperation;
  }

  // Perform the current operation
  function performCurrentOperation() {
    if (!operation) return;

    // Update previous value with result of the operation
    previousValue = performOperation(operation, previousValue, currentValue);
    currentValue = previousValue;
    operation = null;
  }

  // Perform the specified operation on two numbers
  function performOperation(operator, num1, num2) {
    num1 = Number(num1);
    num2 = Number(num2);

    switch (operator) {
      case 'division':
        return (num1 / num2).toString();
      case 'multiplication':
        return (num1 * num2).toString();
      case 'subtraction':
        return (num1 - num2).toString();
      case 'addition':
        return (num1 + num2).toString();
      default:
        return '0';
    }
  }

  // Testing

  function testButton(button) {
    let buttonClass;

    // test button classes and display value
    if (button.classList.contains("operation")) {
      buttonClass = "Operation";
    }

    if (button.classList.contains("action")) {
      buttonClass = "Action";
    }

    if (button.classList.contains("number")) {
      buttonClass = "Number";
    }
    console.log(buttonClass + ": " + button.innerText);
  }
});