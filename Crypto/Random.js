let getRandomBytes = require("expo-random").getRandomBytes;

/**
 * Cryptographically secure random bytes generation
 * @param {Number} numBytes
 * @return {Uint8Array}
 */
function randomBytes(numBytes) {
  return getRandomBytes(numBytes);
}

module.exports = randomBytes;
