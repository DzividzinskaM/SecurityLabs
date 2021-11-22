const { log } = require('console');
const fs = require('fs');

const calculateNgrams = (arr) => {
  sum = arr.reduce(
    (acc, item) => (acc += Number.parseInt(item.split(' ')[1])),
    0
  );

  console.log('SUM', sum);

  return arr.reduce((acc, item) => {
    const key = item.split(' ')[0];
    const value = Number.parseInt(item.split(' ')[1]);
    acc[key] = ((value / sum) * 100).toFixed(6);
    return acc;
  }, {});
};



const readFile = function (file) {
  return fs.readFileSync(file).toString().split('\r\n');
};

const TRIGRAMS = calculateNgrams(readFile('./helpers/trigram.txt'));
const BIGRAMS = calculateNgrams(readFile('./helpers/bigram.txt'));

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CIPHER = 'EFFPQLEKVTVPCPYFLMVHQLUEWCNVWFYGHYTCETHQEKLPVMSAKSPVPAPVYWMVHQLUSPQLYWLASLFVWPQLMVHQLUPLRPSQLULQESPBLWPCSVRVWFLHLWFLWPUEWFYOTCMQYSLWOYWYETHQEKLPVMSAKSPVPAPVYWHEPPLUWSGYULEMQTLPPLUGUYOLWDTVSQETHQEKLPVPVSMTLEUPQEPCYAMEWWYTYWDLUULTCYWPQLSEOLSVOHTLUYAPVWLYGDALSSVWDPQLNLCKCLRQEASPVILSLEUMQBQVMQCYAHUYKEKTCASLFPYFLMVHQLUPQLHULIVYASHEUEDUEHQBVTTPQLVWFLRYGMYVWMVFLWMLSPVTTBYUNESESADDLSPVYWCYAMEWPUCPYFVIVFLPQLOLSSEDLVWHEUPSKCPQLWAOKLUYGMQEUEMPLUSVWENLCEWFEHHTCGULXALWMCEWETCSVSPYLEMQYGPQLOMEWCYAGVWFEBECPYASLQVDQLUYUFLUGULXALWMCSPEPVSPVMSBVPQPQVSPCHLYGMVHQLUPQLWLRPOEDVMETBYUFBVTTPENLPYPQLWLRPTEKLWZYCKVPTCSTESQPBYMEHVPETCMEHVPETZMEHVPETKTMEHVPETCMEHVPETT';


// const letterFrequency = [
//   8.2, 1.5, 2.8, 4.3, 13, 2.2, 2, 6.1, 7, 0.15, 0.77, 4, 2.4, 6.7, 7.5, 1.9, 0.095, 6, 6.3, 9.1, 2.8, 0.98, 2.4, 0.15, 2, 0.074];

// console.log(alphabet.length);

const getRandomKey = (alphabetStr) => {
  let array = alphabetStr.split('');
  let i = array.length,
    j = 0,
    temp;

  while (i--) {
    j = Math.floor(Math.random() * (i + 1));

    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array.join('');
}

const mutate = (str) => {
  const offset = 5;
  const index1 = Math.floor(Math.random() * str.length-1);
  const index2 = Math.floor(Math.random() * str.length - 1);
  const data = str.split('');

  const temp = data[index2];
  data[index2] = data[index1];
  data[index1] = temp;

  // console.log('change str', str);

  // console.log(index);

  // const part1 = str.slice(0, index - offset);
  // const part2 = str.slice(index - offset, offset);
  // const part3 = str.slice(offset, index + offset);
  // const part4 = str.slice(offset + index, str.length);

  return data.join('');
}

// console.log(mutate('afbcfklmorqwv'));


const calculateFrInText = (array, findedItem) => {
  const count = array.reduce((acc, item) => { return findedItem === item ? acc += 1 : acc }, 0);
  return (count / array.length) * 100;
}

const divideTextIntoNgrams = (str, n) => {
  let copy = str;
  return str.split('').reduce((acc, item, index) => {
    if (index % n === 0) acc.push(copy.slice(index, index + n))
    return acc;
  }, [])
}

const getNgramFrequency = (item, list) => {
  return (list.filter((listItem) => item === listItem).length / list.length) * 100;
};

const fitness = (decryptedStr) => {

  let decryptedStrBigrams = divideTextIntoNgrams(decryptedStr, 2);
  let decryptedStrTrigrams = divideTextIntoNgrams(decryptedStr, 3);

  const bigramFit = decryptedStrBigrams.reduce((acc, item) => {
    const teor = BIGRAMS[item];
    const practise = getNgramFrequency(item, decryptedStrBigrams);

    acc += Math.abs(teor - practise);
    return acc;
  }, 0);

  const trigramFit = decryptedStrTrigrams.reduce((acc, item) => {
    let teor = parseInt(TRIGRAMS[item]);
    if(!teor) teor = 0;
    // console.log(typeof teor);
    // if (teor === 'undefined') {
    //   console.log('no theor');
    // }
    
    const practise = getNgramFrequency(item, decryptedStrTrigrams);
    //  console.log(typeof practise);

    if (typeof teor !== 'number' || typeof practise !== 'number') {
      console.log('!number', teor, practise);
    }

    acc += Math.abs(teor - practise);
    // if(teor > 0.0001) ;
    return acc;
  }, 0);

  const a = 0.3;
  const b = 0.7

  // console.log(trigramFit);
  return  (0.3 * bigramFit) + (0.7 * trigramFit);
}

const decrypt = (cipher, key) => {

  return cipher.split('').reduce((acc, item, index) => {
    const i = alphabet.indexOf(item.toString());

    acc += key[i];
    return acc;
  }, '');
  
}

// const checkBiGram = (decryptText) => {
//   let res = 0;
//   decryptText.reduce((acc, item, index, arr) => {
//     (item === 'T' && arr[index + 1] === 'H') ? acc += 1 : acc;
//     return acc;
//   }, res)

//   if (res > 0) {
//     console.log('Finded Bi gram', res);
//   }
// }

const sa = () => {
    const cipher = 'EFFPQLEKVTVPCPYFLMVHQLUEWCNVWFYGHYTCETHQEKLPVMSAKSPVPAPVYWMVHQLUSPQLYWLASLFVWPQLMVHQLUPLRPSQLULQESPBLWPCSVRVWFLHLWFLWPUEWFYOTCMQYSLWOYWYETHQEKLPVMSAKSPVPAPVYWHEPPLUWSGYULEMQTLPPLUGUYOLWDTVSQETHQEKLPVPVSMTLEUPQEPCYAMEWWYTYWDLUULTCYWPQLSEOLSVOHTLUYAPVWLYGDALSSVWDPQLNLCKCLRQEASPVILSLEUMQBQVMQCYAHUYKEKTCASLFPYFLMVHQLUPQLHULIVYASHEUEDUEHQBVTTPQLVWFLRYGMYVWMVFLWMLSPVTTBYUNESESADDLSPVYWCYAMEWPUCPYFVIVFLPQLOLSSEDLVWHEUPSKCPQLWAOKLUYGMQEUEMPLUSVWENLCEWFEHHTCGULXALWMCEWETCSVSPYLEMQYGPQLOMEWCYAGVWFEBECPYASLQVDQLUYUFLUGULXALWMCSPEPVSPVMSBVPQPQVSPCHLYGMVHQLUPQLWLRPOEDVMETBYUFBVTTPENLPYPQLWLRPTEKLWZYCKVPTCSTESQPBYMEHVPETCMEHVPETZMEHVPETKTMEHVPETCMEHVPETT';
    let currentKey = getRandomKey(alphabet);
    let decryptedByCurr = decrypt(cipher, currentKey);
    // console.log('decryptedByCurr', decryptedByCurr);
    let iterationLimit = 50000;
    let temp = 10;
    let currentFitness = fitness(decryptedByCurr);
    console.log('start fitness', currentFitness);
    while (temp > 0) {
      iterationLimit = 50000;

      while (iterationLimit > 0) {
        let newKey = mutate(currentKey);
        // console.log('n key', newKey);
        const decryptByNew = decrypt(cipher, newKey);

        const newFitness = fitness(decryptByNew);
        // console.log('new fitness', newFitness)
        // const dfit = currentFitness - newFitness;

        if (newFitness < currentFitness) {
          currentKey = newKey;
          currentFitness = newFitness;
          decryptedByCurr = decryptByNew;
          console.log('new alphabet', currentKey);
        }
        // else {
        //   const p = Math.exp((currentFitness - newFitness) / temp);
        //   if (p == 1) {
        //     // console.log('p==1');
        //      currentKey = newKey;
        //      currentFitness = newFitness;
        //      decryptedByCurr = decryptByNew;
        //   }
        // }
        iterationLimit -= 1;
      }
      temp -= 1;
      console.log('currentKey', currentKey);
      console.log('currentFitness', currentFitness);
      console.log('decryptedByCurr', decryptedByCurr);
      console.log('\n\n\n\n');
    }
}

// sa();


const generatePopulation = () => {
  let i = 20;
  let arr = [];
  while (i > 0) {
    arr.push(getRandomKey(alphabet));
    i -= 1;
  }
  return arr;
}

const getChildren = (selection) => {
  const index1 = Math.floor(Math.random() * 9);
  const index2 = Math.floor(Math.random() * 9);

  // console.log('i1', index1);
  // console.log('i2', index2);

  const p1 = selection[index1].key;
  const p2 = selection[index2].key;

  // console.log('p1', p1);
  // console.log('p2', p2);

  const crossoverPoint = Math.floor(Math.random() * 25);

  // console.log('point', crossoverPoint);

  const child1 = [...p1];
  const child2 = [...p2];

  // child1.fill('', crossoverPoint, 26);
  // child2.fill('', crossoverPoint, 26);

  // console.log('child1', child1.length);
  // console.log('child2', child2);


  for (let i = 0; i < 3; i++){
    let index = Math.floor(Math.random() * (26 - crossoverPoint) + crossoverPoint);
    const temp = child1[index];
    let tempIndex = child1.indexOf(p2[index]);
    child1[index] = p2[index];
    if(tempIndex !== -1) child1[tempIndex] = temp;
  }

   for (let i = 0; i < 3; i++){
     let index = Math.floor(
       Math.random() * (26 - crossoverPoint) + crossoverPoint
     );
     const temp = child2[index];
     let tempIndex = child2.indexOf(p1[index]);
     child2[index] = p1[index];
     if (tempIndex !== -1) child2[tempIndex] = temp;
  }

  // console.log('child1', child1);
  // console.log('child2', child2);

  return [
    {
      key: child1.join(''),
      fitness: fitness(decrypt(CIPHER, child1.join(''))),
    },
    {
      key: child2.join(''),
      fitness: fitness(decrypt(CIPHER, child2.join(''))),
    },
  ];
}

const mutateNew = (selection) => {
  const index1 = Math.floor(Math.random() * 10);
  const index2 = Math.floor(Math.random() * 10);

  const p1 = selection[index1].key;
  const p2 = selection[index2].key;

  let randomRow = '';
  for (let i = 0; i < 26; i++) {
    Math.random() > 0.5 ? (randomRow += '1') : (randomRow += '0');
  }

  // console.log('randomRow', randomRow);

  let child1 = new Array(26);
  let child2 = new Array(26);


  for (let i = 0; i < 26; i++){
    if (randomRow[i] === '1') {
      child1[i] = p1[i];
      child2[i] = '';
    } else {
      child2[i] = p2[i];
      child1[i] = '';
    }
  }

  let p2Index = 0;
  for (let i = 0; i < 26; i++){
    if (child1[i] === '') {
      while (true) {
        if (child1.indexOf(p2[p2Index]) == -1) {
          child1[i] = p2[p2Index];
          break;
        } else {
          p2Index += 1;
        }
      }
    }
  }

   let p1Index = 0;
   for (let i = 0; i < 26; i++) {
     if (child2[i] === '') {
       while (true) {
         if (child2.indexOf(p1[p1Index]) == -1) {
           child2[i] = p1[p1Index];
           break;
         } else {
           p1Index += 1;
         }
       }
     }
   }


  // console.log('p 1', p1);
  // console.log('p2', p2);

  // console.log('child 1', child1);
  // console.log('child 2', child2);
  // console.log('child redundant 1', child1Redundant);
  // console.log('child redundant 2', child2Redundant);

  //  console.log('old', selection);

  selection[index1] = {
    key: child1.join(''),
    fitness: fitness(decrypt(CIPHER, child1.join(''))),
  };

  selection[index2] = {
    key: child2.join(''),
    fitness: fitness(decrypt(CIPHER, child2.join(''))),
  };
  

//   console.log('i1', index1);
//   console.log('i2', index2);
//  console.log('new', selection);
  return selection;
};


const GA = () => {
  let M = 100;
  const p0 = generatePopulation();
  let fitnessP0Arr = p0.reduce((acc, item, index) => {
    const decrepted = decrypt(CIPHER, item);
    acc.push({ key: item, fitness: parseFloat(fitness(decrepted)) });
    return acc;
  }, []);

  while (M > 0) {
    


    let sorted = fitnessP0Arr.sort((a, b) =>
      parseFloat(a.fitness) > parseFloat(b.fitness) ? 1 : -1
    );
    
    let newSelection = sorted.slice(0, 2);
    // const filtered = sorted.filter(
    //   (value, index) => index > 2 && index % 2 === 0
    // );

    // console.log('filtered', filtered);
    // console.log('news', newSelection);

    let p1 = generatePopulation().slice(0, 8);
    let fitnessP1Arr = p1.reduce((acc, item, index) => {
      const decrepted = decrypt(CIPHER, item);
      acc.push({ key: item, fitness: parseFloat(fitness(decrepted)) });
      return acc;
    }, []);

    newSelection = newSelection.concat(fitnessP1Arr);


    // console.log('new selection LENGTH', newSelection.length);

    // getChildren(newSelection);

    let j = 5;
    while (j > 0) {
      newSelection = newSelection.concat(getChildren(fitnessP0Arr));
      j -= 1;
    }

    // console.log('before MUTATE new selection', newSelection);


    newSelection = mutateNew(newSelection);
    
    fitnessP0Arr = newSelection;

    // console.log(newSelection);

    M -= 1;
  }

  // console.log(fitnessP0Arr);

  
  const rightKey = 'UWYGADFPVJBECKMTHXSLRINQOZ';

  fitnessP0Arr.map((item, index) => {

    const count = item.key.split('').reduce((acc, item, index) => {
      return item == rightKey[index] ? acc += 1 : acc;
    }, 0);

    console.log(item.key, count);
  })

}

GA();

// console.log(BIGRAMS);


// const cipher =
//       'EFFPQLEKVTVPCPYFLMVHQLUEWCNVWFYGHYTCETHQEKLPVMSAKSPVPAPVYWMVHQLUSPQLYWLASLFVWPQLMVHQLUPLRPSQLULQESPBLWPCSVRVWFLHLWFLWPUEWFYOTCMQYSLWOYWYETHQEKLPVMSAKSPVPAPVYWHEPPLUWSGYULEMQTLPPLUGUYOLWDTVSQETHQEKLPVPVSMTLEUPQEPCYAMEWWYTYWDLUULTCYWPQLSEOLSVOHTLUYAPVWLYGDALSSVWDPQLNLCKCLRQEASPVILSLEUMQBQVMQCYAHUYKEKTCASLFPYFLMVHQLUPQLHULIVYASHEUEDUEHQBVTTPQLVWFLRYGMYVWMVFLWMLSPVTTBYUNESESADDLSPVYWCYAMEWPUCPYFVIVFLPQLOLSSEDLVWHEUPSKCPQLWAOKLUYGMQEUEMPLUSVWENLCEWFEHHTCGULXALWMCEWETCSVSPYLEMQYGPQLOMEWCYAGVWFEBECPYASLQVDQLUYUFLUGULXALWMCSPEPVSPVMSBVPQPQVSPCHLYGMVHQLUPQLWLRPOEDVMETBYUFBVTTPENLPYPQLWLRPTEKLWZYCKVPTCSTESQPBYMEHVPETCMEHVPETZMEHVPETKTMEHVPETCMEHVPETT';





// const decryptedText = decrypt(cipher, key);


// console.log(fitness(decryptedText));
