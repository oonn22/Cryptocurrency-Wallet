const SHA = require("sha.js");
const SHA3 = require("js-sha3").sha3_256;
const Keccak = require("js-sha3").keccak256;
const scryptAsync = require("scrypt-js").scrypt;
const randomBytes = require("./Random.js");
const TextEncoder = require("text-encoder-lite").TextEncoderLite;
const hexEncode = require("./Encode.js").hexEncode;

const N = 16384,
  r = 8,
  p = 1; //used by default in nodejs crypto

const saltLength = 32;

/**
 * Returns the 256 bit hash of the data provided
 * @param {Uint8Array} bytes
 * @return {Uint8Array}
 */
function hash(bytes) {
  return sha3Hash(bytes);
}

/**
 * Returns the SHA2-256 hash of the data provided
 * @param {Uint8Array} bytes
 * @return {Uint8Array}
 */
function sha2Hash(bytes) {
  return SHA("sha256").update(bytes).digest();
}

function sha3Hash(bytes) {
  return new Uint8Array(SHA3.digest(bytes));
}

/**
 * returns keccak256 hash of bytes provided
 * @param {Uint8Array} bytes
 * @return {Uint8Array}
 */
 function keccakHash(bytes) {
   return new Uint8Array(Keccak.digest(bytes));
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
