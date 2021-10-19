const fs = require('fs');

const hexToDecimal = (hexNumbersArray) => (hexNumbersArray.map(item => parseInt(item, 16)));

const decryptSingleByteXor = (arr) => {
  let decryptionsVariants = [];
  for (let i = 0; i < 256; i++) {
    let text = ""
    for (let j = 0; j < arr.length; j++) {
      text += String.fromCharCode(i ^ arr[j]);
    }
    decryptionsVariants.push(text)
  }
  return decryptionsVariants;
}

fs.readFile('./task2Cipher.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const hexNumbersArray = data
    .split('')
    .reduce((acc, item, index, arr) => { index % 2 !== 0 && acc.push(arr[index - 1] + item); return acc }, []);

  const decimalArray = hexToDecimal(hexNumbersArray);

  const variants = decryptSingleByteXor(decimalArray);
  const variantsStr = variants.reduce((acc, variant, index) => (acc += `Key ${index}\n` + variant + '\n\n\n'), "");

  fs.writeFile('./task2DecryptingVariants.txt', variantsStr, (error, data) => {
    error && console.log(error);
  });

});
