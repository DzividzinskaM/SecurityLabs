
// // const last = 263239568;

// const aT = 1664525;
// const cT = 1013904223


// const l0 = 934243771;
// const l1 = -1387067426;
// const l2 = -478753371;

// const m = Math.pow(2, 32);

// // let a = ((l1 - l2) * Math.pow((l0 - l1), -1)) % m;
// // console.log('a', a);
// // console.log('c', l2 - (l1*a))

function modInverse(a, m) {
  // validate inputs
  [a, m] = [Number(a), Number(m)];
  if (Number.isNaN(a) || Number.isNaN(m)) {
    return NaN; // invalid input
  }
  a = ((a % m) + m) % m;
  if (!a || m < 2) {
    return NaN; // invalid input
  }
  // find the gcd
  const s = [];
  let b = m;
  while (b) {
    [a, b] = [b, a % b];
    s.push({ a, b });
  }
  if (a !== 1) {
    return NaN; // inverse does not exists
  }
  // find the inverse
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

// const k = modInverse((l1-l0), m);
// console.log('m', m);
// const a =((l2 - l1) * k) % m;
// const c = (l1 - (l0 * a)) % m;

// console.log('k', k);
// console.log('a', a);
// console.log('c', c);
// console.log('next', getNext(a, c, l2));
// console.log('next teor', getNext(aT, cT, l2));

// const b1 = -3;
// const b2 = -2;


const m = BigInt(Math.pow(2, 32));
const x1 = BigInt(863003075);
const x2 = BigInt(740465734);
const x3 = BigInt(-2025142547);
const mi = BigInt(modInverse(x2 - x1, m))
console.log('mi', mi)
console.log()
let a = ((x3 - x2) * mi) % m;
console.log('%', (x2 - x1 * a) % m);
let c = (((x2 - x1 * a) % m) + m) % m ;

console.log('a', Number(a));
console.log('c', Number(c));
console.log('next', Number(getNext(a, c, x3)));





// console.log('modInverse', modInverse(5, 12));

//http://95.217.177.249/casino/playLcg?id=8212&bet=1&number=1