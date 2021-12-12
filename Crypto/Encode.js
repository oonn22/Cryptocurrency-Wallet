const rfc = require('rfc4648');
const strOpts = {pad: false};
const parseOpts = {loose: true};

/**
 * Encodes bytes to base32 string
 * @param {Uint8Array} bytes
 * @return {string}
 */
function base32Encode(bytes) {
    return rfc.base32.stringify(bytes, strOpts);
}

/**
 * decodes base32 string to bytes
 * @param {string} s
 * @return {Uint8Array}
 */
function base32Decode(s) {
    return rfc.base32.parse(s, parseOpts);
}

/**
 * Encodes bytes to hex string
 * @param {Uint8Array} bytes
 * @return {string}
 */
function hexEncode(bytes) {
    return rfc.base16.stringify(bytes, strOpts);
}

/**
 * decodes hex string to bytes
 * @param {string} s
 * @return {Uint8Array}
 */
function hexDecode(s) {
    return rfc.base16.parse(s, parseOpts);
}

/**
 * Encodes bytes to base64url string
 * @param {Uint8Array} bytes
 * @return {string}
 */
function base64urlEncode(bytes) {
    return rfc.base64url.stringify(bytes, strOpts);
}

/**
 * decodes base64url string to bytes
 * @param {string} s
 * @return {Uint8Array}
 */
function base64urlDecode(s) {
    return rfc.base64url.parse(s, parseOpts);
}

module.exports = {
    base32Encode: base32Encode,
    base32Decode: base32Decode,
    hexEncode: hexEncode,
    hexDecode: hexDecode,
    base64urlEncode: base64urlEncode,
    base64urlDecode: base64urlDecode
}
