# JavaScript Algorithms and Data Structures

[Certificate Earned](https://www.freecodecamp.org/certification/fcc9a3972be-fd42-4531-8f15-7c17b0f8d1cd/javascript-algorithms-and-data-structures)

What follows are links to each certification challenge and my submitted 
solutions.

## [Palindrome Checker](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/palindrome-checker)

```javascript
function palindrome(str) {
  let letters = Array.from(str.toLowerCase().match(/[a-z0-9]/g));
  while (letters.length > 1) {
    if (letters.shift() !== letters.pop()) {
      return false;
    }
  }
  return true;
}
```

## [Roman Numeral Converter](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/roman-numeral-converter)

```javascript
function convertToRoman(num) {
  const numerals = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1]
  ]
  let remaining = num;
  let numeral = 0;
  let splitString = [];
  while (remaining > 0) {
    while (remaining < numerals[numeral][1]) {
      numeral++;
    }
    splitString.push(numerals[numeral][0]);
    remaining -= numerals[numeral][1];
  }
  return splitString.join("");
}
```

## [Caesars Cipher](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/caesars-cipher)

```javascript
function rot13(str) {
  return str.replace(
    /[A-Z]/g, 
    c => String.fromCharCode((c.charCodeAt(0) % 26) + 65)
  );
}
```

## [Telephone Number Validator](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/telephone-number-validator)

For this one, I created a single complicated regular expression to validate a 
phone number. It might be more sane to parse and check each part of the 
purported phone number string separately, especially if one anticipates having 
to modify this function in the future. (I believe I did that once before, so I 
made the extra challenge for myself here to create a single regex pattern that 
would do the trick.)

```javascript
function telephoneCheck(str) {
  const PHONE_NUMBER = /^(1[-\s]?)?(\d{3}[-\s]?|\(\d{3}\)\s?)\d{3}[-\s]?\d{4}$/;
  return str.search(PHONE_NUMBER) !== -1;
}
```

## [Cash Register](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/cash-register)

For this one, the solution I devised is more complicated than what was needed 
to pass the tests on [freeCodeCamp](https://www.freecodecamp.org/). (I know I 
could make a much simpler solution because I have, and yes, it passed their 
tests.) In particular: 

* I endeavored to handle all amounts with full precision (so no rounding errors 
would be possible).

* I made sure my solution covers some tricky edge cases that were not being 
tested.

One example of a tricky edge case: give 60.00 in change when the drawer has one 
FIFTY and three TWENTYs. The answer should be to give the three TWENTYs as 
change, but a simple greedy algorithm would miss this edge case.

```javascript
const MULTIPLIER = 100;  // Used to avoid rounding errors

function makeChange(amount, denoms, totalAvailable, processingOrder) {
  // Check if amount is negative or less than the total available
  if (amount < 0 || amount > totalAvailable) {
    return undefined;  // change is not possible
  }
  
  // Check if amount is 0
  if (amount === 0) {
    return [];  // change is not needed
  }
  
  // Find the greatest available denomination
  let greatestAvailableDenom;
  for (let denom of processingOrder) {
    if (denoms[denom].num > 0) {
      greatestAvailableDenom = denom;
      break;
    }
  }
  
  // Try different numbers of the greatestAvailableDenom
  const info = denoms[greatestAvailableDenom];
  
  // Set the number of available units of the greatestAvailableDenom
  const availableUnits = info.num;
  
  /*
    We reduce the units in the drawer to 0. (Think: each unit in the draw will 
    either go toward making change or eventually back into the draw, but we need 
    this set to 0 so further processing down the line will work.
  */
  info.num = 0;
  
  // Loop over the possible number of units to use
  for (let num = availableUnits; num >= 0; num--) {
    let value = info.value * num;
    if (value > amount) continue;
    // At this point, value < amount
    /*
      Try to make remaining change on only smaller denominations (why info.num 
      was set to 0)
    */
    let remainingChange = makeChange(
      amount - value, 
      denoms, 
      totalAvailable - info.value * availableUnits, 
      processingOrder
    );
    if (remainingChange === undefined) {
      // We need to continue to try the other possibilities for this denom
      continue;
    }
    else {
      if (value > 0) {
        return [
          [greatestAvailableDenom, value / MULTIPLIER]
        ].concat(remainingChange);
      }
      else {
        return remainingChange;
      }
    }
  }

  /*
    If we get this far without returning, then there is no way to make the 
    change.
  */
  return undefined;
}

function checkCashRegister(price, cash, cashInDrawer) {
  // Compute the total change due
  let changeDue = Math.round(MULTIPLIER * (cash - price));

  // Determine the total of all the cash in the drawer
  let totalCashInDrawer = cashInDrawer.reduce(
    (total, denom) => total + Math.round(MULTIPLIER * denom[1]), 
    0
  );

  // Check if the change due equals the cash in drawer.
  if (changeDue === totalCashInDrawer) {
    return { status: "CLOSED", change: cashInDrawer };
  }

  // Check if the totalCashInDrawer is insufficient
  if (totalCashInDrawer < changeDue) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // From this point on, totalCashInDrawer > changeDue

  /*
    The only remaining question is if the currencies present in drawer
    are sufficient to make the exact change.

    We will assume that we wish to use higher-denominated currencies over
    lower-denominated currencies, all other things being equal. In this
    way, there is either one answer or no answer for how to make the change. 
  */

  const DENOMINATIONS = {
    "PENNY": { value: Math.round(MULTIPLIER * 0.01), num: 0 },
    "NICKEL": { value: Math.round(MULTIPLIER * 0.05), num: 0 },
    "DIME": { value: Math.round(MULTIPLIER * 0.10), num: 0 },
    "QUARTER": { value: Math.round(MULTIPLIER * 0.25), num: 0 },
    "ONE": { value: Math.round(MULTIPLIER * 1.00), num: 0 },
    "TWO": { value: Math.round(MULTIPLIER * 2.00), num: 0 },
    "FIVE": { value: Math.round(MULTIPLIER * 5.00), num: 0 },
    "TEN": { value: Math.round(MULTIPLIER * 10.00), num: 0 },
    "TWENTY": { value: Math.round(MULTIPLIER * 20.00), num: 0 },
    "FIFTY": { value: Math.round(MULTIPLIER * 50.00), num: 0 },
    "ONE HUNDRED": { value: Math.round(MULTIPLIER * 100.00), num: 0 }
  }
  const DENOMINATIONS_ORDER = [
    "ONE HUNDRED", "FIFTY", "TWENTY", "TEN", "FIVE", "TWO", "ONE", "QUARTER", 
    "DIME", "NICKEL", "PENNY"
  ];  // It's probably helpful to have these in decreasing order ;)

  // Update DENOMINATIONS to reflect the values in cashInDrawer
  for (let denom of cashInDrawer) {
    DENOMINATIONS[denom[0]].num = 
      Math.round(denom[1] * 100 / DENOMINATIONS[denom[0]].value);
  }

  // Now, we try to make change.
  const change = makeChange(
    changeDue, 
    DENOMINATIONS, 
    totalCashInDrawer, 
    DENOMINATIONS_ORDER
  );

  // Return the correct result
  if (change === undefined) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }
  else {
    return { status: "OPEN", change: change };
  }
}
```

