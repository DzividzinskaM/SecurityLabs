const fs = require('fs');
const nGram = require('n-gram');

const TRIGRAMS = fs
  .readFileSync('task3/helpers/trigram.txt', 'utf-8')
  .split('\n')
  .map((e) => e.split(','))
  .reduce((a, [q, p]) => ((a[q] = parseFloat(p)), a), {});
const BIGRAMS = fs
  .readFileSync('task3/helpers/bigram.txt', 'utf-8')
  .split('\n')
  .map((e) => e.split(','))
  .reduce((a, [q, p]) => ((a[q] = parseFloat(p)), a), {});
const SINGLE = fs
  .readFileSync('task3/helpers/single.txt', 'utf-8')
  .split('\n')
  .map((e) => e.split(','))
  .reduce((a, [q, p]) => ((a[q] = parseFloat(p)), a), {});


const CIPHER =
  'EFFPQLEKVTVPCPYFLMVHQLUEWCNVWFYGHYTCETHQEKLPVMSAKSPVPAPVYWMVHQLUSPQLYWLASLFVWPQLMVHQLUPLRPSQLULQESPBLWPCSVRVWFLHLWFLWPUEWFYOTCMQYSLWOYWYETHQEKLPVMSAKSPVPAPVYWHEPPLUWSGYULEMQTLPPLUGUYOLWDTVSQETHQEKLPVPVSMTLEUPQEPCYAMEWWYTYWDLUULTCYWPQLSEOLSVOHTLUYAPVWLYGDALSSVWDPQLNLCKCLRQEASPVILSLEUMQBQVMQCYAHUYKEKTCASLFPYFLMVHQLUPQLHULIVYASHEUEDUEHQBVTTPQLVWFLRYGMYVWMVFLWMLSPVTTBYUNESESADDLSPVYWCYAMEWPUCPYFVIVFLPQLOLSSEDLVWHEUPSKCPQLWAOKLUYGMQEUEMPLUSVWENLCEWFEHHTCGULXALWMCEWETCSVSPYLEMQYGPQLOMEWCYAGVWFEBECPYASLQVDQLUYUFLUGULXALWMCSPEPVSPVMSBVPQPQVSPCHLYGMVHQLUPQLWLRPOEDVMETBYUFBVTTPENLPYPQLWLRPTEKLWZYCKVPTCSTESQPQULLGYAUMEHVPETFWMEHVPETBZMEHVPETB';
const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const freq = {
  A: 0.08167,
  B: 0.01492,
  C: 0.02782,
  D: 0.04253,
  E: 0.12702,
  F: 0.02228,
  G: 0.02015,
  H: 0.06094,
  I: 0.06966,
  J: 0.00153,
  K: 0.00772,
  L: 0.04025,
  M: 0.02406,
  N: 0.06749,
  O: 0.07507,
  P: 0.01929,
  Q: 0.00095,
  R: 0.05987,
  S: 0.06327,
  T: 0.09056,
  U: 0.02758,
  V: 0.00978,
  W: 0.0236,
  X: 0.0015,
  Y: 0.01974,
  Z: 0.00074,
};

const transform = (str, dict) =>
  str
    .split('')
    .map((e) => dict[e])
    .join('');

const getLetterCounts = (str) => {
  const plaintext = str.toUpperCase().replace(/[^A-Z]/g, '');
  const counts = [...abc].map((letter) => ({ letter, count: 0 }));

  plaintext.split('').forEach((letter) => {
    counts.find((c) => c.letter == letter).count++;
  });

  return counts;
};

const sortedCipherByFrequency = getLetterCounts(CIPHER)
    .sort((a, b) => b.count - a.count)
    .map((e) => e.letter)
    .join('');

const decode = (str, key) => {

  const dict = [...sortedCipherByFrequency].reduce(
    (acc, hole, i) => ((acc[hole] = key[i]), acc),
    {}
  );

  return transform(str, dict);
};
const fitness = (phenotype) =>
  0.3 *
    nGram(1)(decode(CIPHER, phenotype))
      .map((gram) => SINGLE[gram])
      .reduce((a, v) => a + (Math.log(v) || 0), 0) +
  0.3 *
    nGram(2)(decode(CIPHER, phenotype))
      .map((gram) => BIGRAMS[gram])
      .reduce((a, v) => a + (Math.log(v) || 0), 0) +
  0.3 *
    nGram(3)(decode(CIPHER, phenotype))
      .map((gram) => TRIGRAMS[gram])
      .reduce((a, v) => a + (Math.log(v) || 0), 0);

const mutate = (old) => {
  const [i, j] = [Math.floor(Math.random() * 26), Math.floor(Math.random() * 26)];
  const result = [...old];

  if (i !== j) {
    const tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }

  return result.join('');
};

const crossover = (parentX, parentY) => {
  const first = [];
  let letters = [...abc];
  [...parentX].forEach((_, i) => {
    const parents = [parentX[i], parentY[i]];
    letters = letters.sort(
      (a, b) =>
        (parents.includes(b) ? 1 : Math.random() / 2) +
        freq[b] -
        ((parents.includes(a) ? 1 : Math.random() / 2) + freq[a])
    );
    first.push(letters.shift());
  });

  const second = [];
  letters = [...abc];
  [...parentY].forEach((_, i) => {
    const parents = [parentX[parentX.length - i], parentY[parentX.length - i]];
    letters = letters.sort(
      (a, b) =>
        (parents.includes(b) ? -1 : Math.random() / 2) +
        freq[b] -
        ((parents.includes(a) ? -1 : Math.random() / 2) + freq[a])
    );
    second.unshift(letters.pop());
  });

  return [first.join(''), second.join('')];
};

const start = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const reverse = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';

const geneticalgorithm = require('./GA')({
  mutationFn: mutate,
  crossoverFn: crossover,
  fitnessFn: fitness,
  populationArr: [start, reverse],
  populationSizeNum: 100,
});

const task3 = () => {
  let max = { f: geneticalgorithm.maxFitness, i: 0 };
  let i = 0;
  while (max.i + 100 > i && i < 10000) {
    geneticalgorithm.iterate();
    if (geneticalgorithm.maxFitness > max.f) {
      max.f = geneticalgorithm.maxFitness;
      max.i = i;
    }

    i++;
  }
  const bests = geneticalgorithm.getBest();
  bests.forEach((e) => console.log(e, decode(CIPHER, e.chromosome)));
};

task3();
