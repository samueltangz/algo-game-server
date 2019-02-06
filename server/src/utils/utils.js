function intToBoolean (val) {
  switch (val) {
    case 0: return false
    case 1: return true
    default: throw new Error('invalid input')
  }
}

function booleanToInt (val) {
  switch (val) {
    case false: return 0
    case true: return 1
    default: throw new Error('invalid input')
  }
}

module.exports = {
  intToBoolean,
  booleanToInt
}
