const fs = require('fs');

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const percentOfLowercaseLetters = 0.6;

const hexToDecimal = (hexNumbersArray) => (hexNumbersArray.map(item => parseInt(item, 16)));

const getPercentOfSmallCharacter = (str) => str.split('').reduce((acc, character) => (alphabet.indexOf(character) === -1 ? acc : acc + 1), 0);

const decryptSingleByteXor = (arr) => {
  let decryptionsVariants = [];
  for (let i = 0; i < 256; i++) {
    let text = '';
    let countOfWhiteSpace = 0;
    for (let j = 0; j < arr.length; j++) {
      text += String.fromCharCode(i ^ arr[j]);
      if ((i ^ arr[j]) === 32) countOfWhiteSpace += 1;
    }

    const currentNumberOfLowercaseLetters = getPercentOfSmallCharacter(text);
    if ((currentNumberOfLowercaseLetters / (text.length)) >= percentOfLowercaseLetters) {
      console.log(countOfWhiteSpace);
      console.log('length', text.length)
      console.log('key', i);
      console.log('text', text);
      console.log('\n\n\n');
      decryptionsVariants.push(text);
    };
  }
  return decryptionsVariants;
}

const test = (arr) => {
  let text = "";
   for (let j = 0; j < arr.length; j++) {
     text += String.fromCharCode(55 ^ arr[j]);
     if (j > 60 && j < 70) {
        console.log(`arr ${j}`, arr[j]);
        console.log(`${j} sym(ASCII)`, 55 ^ arr[j]);
        console.log(`${j} sym`, text[j]);
     }
  }
  return text;
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
  console.log(decimalArray);

  //const variants = decryptSingleByteXor(decimalArray);
  const variantsStr = test(decimalArray);
  // const variantsStr = variants.reduce((acc, variant, index) => (acc += `Key ${index}\n` + variant + '\n\n\n'), "");

  fs.writeFile('./task2DecryptingVariants.md', variantsStr, (error, data) => {
    error && console.log(error);
  });

});
