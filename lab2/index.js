const fs = require('fs');
const { hexToDecimal } = require('../lab1/task1/task1.js');

const xor = (lineArr1, lineArr2) => {

  const length = Math.min(lineArr1.length, lineArr2.length);
  let res = [];

  for (let i = 0; i < length; i++){
    res.push(lineArr1[i] ^ lineArr2[i]);
  }

  return res;
}

fs.readFile('./text.txt', function (err, data) {
  if (err) throw err;
  let dataArray = data.toString().split('\n');

  //to decimal
  const hexNumbersArray1 = dataArray[0].split('').reduce((acc, item, index, arr) => {
      index % 2 !== 0 && acc.push(arr[index - 1] + item);
      return acc;
  }, []);
  
  const hexNumbersArray2 = dataArray[1].split('').reduce((acc, item, index, arr) => {
      index % 2 !== 0 && acc.push(arr[index - 1] + item);
      return acc;
    }, []);

  const decimalArray1 = hexToDecimal(hexNumbersArray1);
  const decimalArray2 = hexToDecimal(hexNumbersArray2);

  xor(decimalArray1, decimalArray2);

});
