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

// task3();


const CIPHER_MULTI =
  'UMUPLYRXOYRCKTYYPDYZTOUYDZHYJYUNTOMYTOLTKAOHOKZCMKAVZDYBRORPTHQLSERUOERMKZGQJOIDJUDNDZATUVOTTLMQBOWNMERQTDTUFKZCMTAZMEOJJJOXMERKJHACMTAZATIZOEPPJKIJJNOCFEPLFBUNQHHPPKYYKQAZKTOTIKZNXPGQZQAZKTOTIZYNIUISZIAELMKSJOYUYYTHNEIEOESULOXLUEYGBEUGJLHAJTGGOEOSMJHNFJALFBOHOKAGPTIHKNMKTOUUUMUQUDATUEIRBKYUQTWKJKZNLDRZBLTJJJIDJYSULJARKHKUKBISBLTOJRATIOITHYULFBITOVHRZIAXFDRNIORLZEYUUJGEBEYLNMYCZDITKUXSJEJCFEUGJJOTQEZNORPNUDPNQIAYPEDYPDYTJAIGJYUZBLTJJYYNTMSEJYFNKHOTJARNLHHRXDUPZIALZEDUYAOSBBITKKYLXKZNQEYKKZTOKHWCOLKURTXSKKAGZEPLSYHTMKRKJIIQZDTNHDYXMEIRMROGJYUMHMDNZIOTQEKURTXSKKAGZEPLSYHTMKRKJIIQZDTNROAUYLOTIMDQJYQXZDPUMYMYPYRQNYFNUYUJJEBEOMDNIYUOHYYYJHAOQDRKKZRRJEPCFNRKJUHSJOIRQYDZBKZURKDNNEOYBTKYPEJCMKOAJORKTKJLFIOQHYPNBTAVZEUOBTKKBOWSBKOSKZUOZIHQSLIJJMSURHYZJJZUKOAYKNIYKKZNHMITBTRKBOPNUYPNTTPOKKZNKKZNLKZCFNYTKKQNUYGQJKZNXYDNJYYMEZRJJJOXMERKJVOSJIOSIQAGTZYNZIOYSMOHQDTHMEDWJKIULNOTBCALFBJNTOGSJKZNEEYYKUIXLEUNLNHNMYUOMWHHOOQNUYGQJKZLZJZLOLATSEHQKTAYPYRZJYDNQDTHBTKYKYFGJRRUFEWNTHAXFAHHODUPZMXUMKXUFEOTIMUNQIHGPAACFKATIKIZBTOTIKZNKKZNLORUKMLLFBUUQKZNLEOHIEOHEDRHXOTLMIRKLEAHUYXCZYTGUYXCZYTIUYXCZYTCVJOEBKOHE';

const getNth = (str, k, b) =>
  [...str].filter((_, i) => (i - b) % k === 0).join('');

const concat = (strs) =>
  [...strs[0]].map((_, i) => strs.map((str) => str[i]).join('')).join('');


const getKeyHole = (str) => {
  const counts = getLetterCounts(str);

  return counts
    .sort((a, b) => b.count - a.count)
    .map((e) => e.letter)
    .join('');
};


const decodeMulti = (str, keys) => {
  return concat(
    keys.map((key, i) => {
      const strPart = getNth(str, keys.length, i);

      const keyHole = getKeyHole(strPart);

      const dict = [...keyHole].reduce(
        (acc, hole, i) => ((acc[hole] = key[i]), acc),
        {}
      );

      return transform(strPart, dict);
    })
  );
};

const algos = [];
const best = [];
const fitnessMulti = (i) => (phenotype) => {
  const keys = best.map((b, j) => (i === j ? phenotype : b));

  return (
    0.3 *
      nGram(1)(decodeMulti(CIPHER_MULTI, keys))
        .map((gram) => SINGLE[gram])
        .reduce((a, v) => a + (Math.log(v) || 0), 0) +
    0.1 *
      nGram(2)(decodeMulti(CIPHER_MULTI, keys))
        .map((gram) => BIGRAMS[gram])
        .reduce((a, v) => a + (Math.log(v) || 0), 0) +
    0.3 *
      nGram(3)(decodeMulti(CIPHER_MULTI, keys))
        .map((gram) => TRIGRAMS[gram])
        .reduce((a, v) => a + (Math.log(v) || 0), 0)
  );
};

const configMulti = (i) => ({
  mutationFn: mutate,
  crossoverFn: crossover,
  fitnessFn: fitnessMulti(i),
  populationArr: [start, reverse],
  populationSizeNum: 30, // defaults to 100
});

const create = (i) => {
  const geneticalgorithm = require('../task3/GA')(configMulti(i));
  algos[i] = geneticalgorithm;
  best[i] = start;
};

// const run = async (i) => {
//   // for (let j = 0; j < 1000; j++) {
//   algos[i] = algos[i].evolve();
//   // }
//   // console.log(Array(10000).fill(null).map((e, i) => i).reduce((a, v) => (console.log(v), a.evolve()), geneticalgorithm).scoredPopulation())
// };

const task4 = (k) => {
  const getLetterCounts = (str) => {
    const plaintext = str.toLowerCase().replace(/[^a-z]/g, '');
    const counts = new Array(26).fill(0);
    let total = 0;

    for (let i = 0; i < plaintext.length; i++) {
      counts[plaintext.charCodeAt(i) - 97]++;
      total++;
    }

    return { counts, total };
  };

  const getIC = (str) => {
    const { counts, total } = getLetterCounts(str);

    const sum = counts.reduce((a, v) => a + v * (v - 1), 0);
    const ic = sum / (total * (total - 1));

    return ic;
  };


  let i = 2;
  const lengths = [];

  for (i = 2; i < 20; i++) {
    const ics = Array(i)
      .fill(null)
      .map((e, j) => getIC(getNth(CIPHER_MULTI, i, j)));
    const ic = ics.reduce((a, v) => a + v) / ics.length;

    lengths.push({ length: i, ic });
  }

  const maxIC = Math.max(...lengths.map((e) => e.ic));
  const bestLength = lengths
    .sort((a, b) => b.ic - a.ic)
    .filter((e) => e.ic > maxIC * 0.9)
    .filter(
      (e, _, arr) =>
        !arr.some((s) => e.length !== s.length && e.length % s.length === 0)
    );

  const keylen = bestLength[0].length;
  console.log('key length', keylen);

  for (let i = 0; i < keylen; i++) {
    console.log('create', i);
    create(i);
  }

  let j = 1;
  const max = { f: algos[0].maxFitness, j: 1 };

  while (max.j + 100 > j && j < 10000) {
    for (let i = 0; i < keylen; i++) {
      algos[i].iterate();
      if (algos[i].maxFitness > max.f) {
        max.f = algos[i].maxFitness;
        max.j = j;
      }
    }
    if (j % k === 0) {
      algos.forEach((algo, i) => (best[i] = algo.getBest()[0].chromosome));
    }
    j++;
  }

  for (let i = 0; i < keylen; i++) {
    const bestie = algos[i].getBest()[0].chromosome;
    best[i] = bestie;
    console.log({ i, code: bestie, score: fitnessMulti(i)(bestie) });
  }
  console.log(decodeMulti(CIPHER_MULTI, best));
};

task4(50);
