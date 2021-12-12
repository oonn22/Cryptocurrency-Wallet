const Elliptic = require('elliptic').eddsa;
const EC = new  Elliptic('ed25519');
const hexEncode = require('./Encode.js').hexEncode;

/**
 * Gets a key pair from a secret
 * @param {Uint8Array} secret
 */
function getKeysFromSecret(secret) {
    return EC.keyFromSecret(secret)
}

/**
 * returns the corresponding public address of a secret, in bytes
 * @param {Uint8Array} secret
 * @return {Uint8Array}
 */
function getPublic(secret) {
    return getKeysFromSecret(secret).getPublic()
}

/**
 * Signs a message in bytes with a pair of keys
 * @param {Uint8Array} msg to sign
 * @param {Uint8Array} secret to sign with
 * @return {Uint8Array}
 */
function signMessage(msg, secret) {
    return getKeysFromSecret(secret).sign(msg).toBytes();
}

/**
 * Validates a message and its corresponding signature
 * @param {Uint8Array} msg
 * @param {Uint8Array} sig
 * @param {Uint8Array} publicKey
 * @return {boolean}
 */
function verifySignature(msg, sig, publicKey) {
    publicKey = hexEncode(publicKey);
    publicKey = EC.keyFromPublic(publicKey, 'hex');
    sig = Array.from(sig);
    return publicKey.verify(msg, sig);
}

module.exports = {verifySignature: verifySignature, signMessage: signMessage, getPublic: getPublic};


