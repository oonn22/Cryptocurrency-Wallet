const hash = require("./Hash.js").hash;
const saltLength = require("./Hash.js").saltLength;
const getRandomBytes = require("./Random.js");
const { signMessage, verifySignature, getPublic } = require("./Sign.js");
const { base32Encode, base32Decode } = require("./Encode.js");
const { encrypt, decrypt, nonceLength } = require("./Encrypt.js");

class Crypto {
  /**
   * returns a 32 byte hash of data provided
   * @param {Uint8Array} bytes
   * @return {Uint8Array}
   */
  static hash(bytes) {
    return hash(bytes);
  }

  /**
   * Returns an encrypted string of data
   * @param {Uint8Array} data
   * @param {string} passwd
   * @return {string}
   */
  static async encrypt(data, passwd) {
    return await encrypt(data, passwd);
  }

  /**
   *
   * @param {String} encrypted
   * @param passwd
   * @return {Uint8Array | null}
   */
  static async decrypt(encrypted, passwd) {
    let split = encrypted.split("-");
    let nonce = this.decode(split[0]);
    let salt = this.decode(split[1]);
    let data = this.decode(split[2]);

    return await decrypt(data, passwd, salt, nonce);
  }

  /**
   * signs a message with the secret provided
   * @param {Uint8Array} msg
   * @param {Uint8Array} secret
   * @return {Uint8Array}
   */
  static signMessage(msg, secret) {
    return signMessage(msg, secret);
  }

  /**
   * Validates a message was signed by a given public key
   * @param {Uint8Array} msg
   * @param {Uint8Array} sig
   * @param {String | Uint8Array} pub
   * @return {boolean}
   */
  static verifySignature(msg, sig, pub) {
    if (Object.prototype.toString.call(pub) === "[object String]")
      pub = this.decode(pub);
    return verifySignature(msg, sig, pub);
  }

  /**
   * Returns a secrets corresponding public key
   * @param {Uint8Array} secret
   * @return {string}
   */
  static getPublic(secret) {
    return this.encode(getPublic(secret));
  }

  static newSecret() {
    return this.randomBytes(32);
  }

  /**
   * Cryptographically secure random bytes generation
   * @param {Number} numBytes
   * @return {Uint8Array}
   */
  static randomBytes(numBytes) {
    return getRandomBytes(numBytes);
  }

  /**
   * encodes bytes to string
   * @param {Uint8Array} bytes
   * @return {string} base32 encoded string
   */
  static encode(bytes) {
    return base32Encode(bytes);
  }

  /**
   * decodes a string to bytes
   * @param {String} s
   * @return {Uint8Array}
   */
  static decode(s) {
    return base32Decode(s);
  }

  /**
   * Returns whether able to decode a string to bytes or not
   * @param {String} s
   * @returns {boolean}
   */
  static canDecode(s) {
    try {
      Crypto.decode(s);
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = Crypto;
