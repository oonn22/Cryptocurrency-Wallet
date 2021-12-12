const SHA = require("sha.js");
const scryptAsync = require("scrypt-js").scrypt;
const randomBytes = require("./Random.js");
const TextEncoder = require("text-encoder-lite").TextEncoderLite;

const N = 16384,
  r = 8,
  p = 1; //used by default in nodejs crypto

const saltLength = 32;

/**
 * Returns the hash of the data provided
 * @param {Uint8Array} bytes
 * @return {Uint8Array}
 */
function hash(bytes) {
  return sha2Hash(bytes);
}

/**
 * Returns the SHA2 hash of the data provided
 * @param {Uint8Array} bytes
 * @return {Uint8Array}
 */
function sha2Hash(bytes) {
  return SHA("sha256").update(bytes).digest();
}

/**
 * Returns the hashed password using scrypt.
 * @param {String} passwd password to hash
 * @param {Number} length length of derived hash
 * @param {Uint8Array} salt if not provided, random is chosen and returned
 * @return {{salt: Uint8Array, hash: Uint8Array}}
 */
async function hashPassword(passwd, length, salt = undefined) {
  let encoder = new TextEncoder("utf-8");

  if (salt === undefined) salt = randomBytes(saltLength);

  let key = await scryptAsync(encoder.encode(passwd), salt, N, r, p, length); //TODO make better
  return { hash: key, salt: salt };
}

module.exports = { hash, hashPassword, saltLength };
