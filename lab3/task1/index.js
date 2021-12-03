function modInverse(a, m) {
  [a, m] = [Number(a), Number(m)];
  if (Number.isNaN(a) || Number.isNaN(m)) {
    return NaN; 
  }
  a = ((a % m) + m) % m;
  if (!a || m < 2) {
    return NaN; 
  }
 
  const s = [];
  let b = m;
  while (b) {
    [a, b] = [b, a % b];
    s.push({ a, b });
  }
  if (a !== 1) {
    return NaN; 
  }

  let x = 1;
  let y = 0;
  for (let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y, x - y * Math.floor(s[i].a / s[i].b)];
  }
  return ((y % m) + m) % m;
}

const getNext = (a, c, last) => {
  return ((a * last) + c) % m;
}

const m = BigInt(Math.pow(2, 32));
const x1 = BigInt(-1513770031);
const x2 = BigInt(-58238212);
const x3 = BigInt(-534054357);
const mi = BigInt(modInverse(x2 - x1, m))
let a = ((x3 - x2) * mi) % m;
let c = (((x2 - x1 * a) % m) + m) % m ;

console.log('a', Number(a));
console.log('c', Number(c));
console.log('next', Number(getNext(a, c, x3)));



//http://95.217.177.249/casino/playLcg?id=8212&bet=1&number=1