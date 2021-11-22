const fs = require('fs');

const countIndexCoincidence = (text1, text2) => {
  return text1.split('').reduce((acc, letter, index, arr1) => {
    return letter === text2[index] ? (acc += 1) : acc;
  }, 0);
};

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const percentOfLowercaseLetters = 0.7;

const getPercentOfSmallCharacter = (str) => str.split('').reduce((acc, character) => (alphabet.indexOf(character) === -1 ? acc : acc + 1), 0);

fs.readFile('./text.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let str = Buffer.from(data, 'base64').toString('ascii');
  data = str;
  let start = data;
  console.info('--------------------------------');
  for (let i = 0; i < data.length; i++) {
    str = str[str.length - 1] + str.substring(0, str.length - 1);
    const indexCoincidence = countIndexCoincidence(start, str);
    console.log(i + 1, indexCoincidence / data.length);
  }

  //defined key
  const keyLength = 3;

  let variantNumber = 0;
  let suitableVariants = [];

  str += " ";
  for (let i = 0; i < 128; i++) {
    for (let j = 0; j < 128; j++) {
      for (let k = 0; k < 128; k++) {
        const key = String.fromCharCode(i) + String.fromCharCode(j) + String.fromCharCode(k);
        let decryptingText = '';

        for (let m = 0; m < str.length; m += 3){
          decryptingText += String.fromCharCode(i ^ str[m].charCodeAt());
          decryptingText += String.fromCharCode(j ^ str[m + 1].charCodeAt());
          decryptingText += String.fromCharCode(k ^ str[m + 2].charCodeAt());
        }

        const currentNumberOfLowercaseLetters = getPercentOfSmallCharacter(decryptingText);

        if ((currentNumberOfLowercaseLetters / (decryptingText.length)) >= percentOfLowercaseLetters) {
          suitableVariants.push({key, decryptingText});
        }
      }
    }
  }

  fs.writeFile('./task2DecryptingVariants.json', JSON.stringify(suitableVariants, null, "\t"), (error, data) => {
    error && console.log(error);
  });
});




