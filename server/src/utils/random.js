/**
 * Random between [l, r)
 * @param {number} l 
 * @param {number} r 
 * @return a random number between [l, r).
 */
const randBetween = function (l, r) {
  // TODO: Use cryptographic random numbers
  return Math.floor(Math.random() * (r - l)) + l
}

module.exports = {
  randBetween
}