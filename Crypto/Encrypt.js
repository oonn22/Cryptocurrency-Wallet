const hashPassword = require("./Hash.js").hashPassword;
const { base32Encode, base32Decode } = require("./Encode.js");
const nacl = require("tweetnacl");
const randomBytes = require("./Random.js");

/**
 * encrypts some data with a password
 * @param {Uint8Array} data
 * @param {String} passwd
 * @return {String}
 */
async function encrypt(data, passwd) {
  let hashedPasswd = await hashPassword(passwd, nacl.secretbox.keyLength);
  let encryptionNonce = randomBytes(nonceLength());
  let encryptedData = nacl.secretbox(data, encryptionNonce, hashedPasswd.hash);

  return (
    base32Encode(encryptionNonce) +
    "-" +
    base32Encode(hashedPasswd.salt) +
    "-" +
    base32Encode(encryptedData)
  );
}

/**
 *
 * @param {Uint8Array} encryptedData
 * @param {string} passwd
 * @param {Uint8Array} salt
 * @param {Uint8Array} nonce
 * @returns {null}
 */
async function decrypt(encryptedData, passwd, salt, nonce) {
  let hashedPasswd = await hashPassword(passwd, nacl.secretbox.keyLength, salt);
  let data = null;

  try {
    data = nacl.secretbox.open(encryptedData, nonce, hashedPasswd.hash);
  } catch (err) {
    console.log(err);
    //do nothing
  }

  return data;
}

function nonceLength() {
  return nacl.secretbox.nonceLength;
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt,
  nonceLength: nonceLength,
};
