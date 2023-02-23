const express = require('express');
const app = express();

// Parsing JSON bodies
app.use(express.json());

// storage for calculators
const calculators = [];

// Initialize calculator 
app.post('/init', (req, res) => {
  const { operator, num1, num2 } = req.body;
  let result;
  let totalOps = 0;

  switch (operator) {
    case 'add':
      result = num1 + num2;
      totalOps = 1;
      break;
    case 'subtract':
      result = num1 - num2;
      totalOps = 1;
      break;
    case 'multiply':
      result = num1 * num2;
      totalOps = 1;
      break;
    case 'divide':
      result = num1 / num2;
      totalOps = 1;
      break;
    default:
      res.status(400).json({ error: 'Invalid operator' });
      return;
  }

  const id = Math.floor(Math.random() * 1000000); // generate a random ID
  const calculator = { result, totalOps, id };
  calculators.push(calculator);
  res.status(200).json(calculator);
});

// Perform operation on created result
app.post('/operation', (req, res) => {
  const { operator, num, id } = req.body; // retrieve the calculator by its ID
  const calculator = calculators.find(c => c.id === id);
  if (!calculator) {
    res.status(404).json({ error: 'Calculator not found' });
    return;
  }

  let result = calculator.result;
  let totalOps = calculator.totalOps;

  switch (operator) {
    case 'add':
      result += num;
      totalOps++;
      break;
    case 'subtract':
      result -= num;
      totalOps++;
      break;
    case 'multiply':
      result *= num;
      totalOps++;
      break;
    case 'divide':
      result /= num;
      totalOps++;
      break;
    default:
      res.status(400).json({ error: 'Invalid operator' });
      return;
  }

  const updatedCalculator = { result, totalOps, id };
  calculators.push(updatedCalculator);
  res.status(200).json(updatedCalculator);
});

// Undo the last operation with the result
app.put('/undo', (req, res) => {
  const { id } = req.body;
  const calculator = calculators.find(c => c.id === id);
  if (!calculator) {
    res.status(404).json({ error: 'Calculator not found' });
    return;
  }

  // If there are no operations performed, return the same result
  if (calculator.totalOps === 0) {
    res.status(200).json(calculator);
    return;
  }

  // Retrieve the previous result and update the calculator
  const prevCalculator = calculators[calculators.length - 2];
  calculators.pop();
  res.status(200).json(prevCalculator);
});

// Reset the calculator
app.get('/reset', (req, res) => {
  const { id } = req.body;
  const calculator = calculators.find(c => c.id === id);
  if (!calculator) {
    res.status(404).json({ error: 'Calculator not found' });
    return;
  }

  calculators.splice(calculators.indexOf(calculator), 1);
  res.status(200).json({ success: true, message: `calculator ${id} is now reset` });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
console.log(`Server is listening on port ${PORT}`);
});
