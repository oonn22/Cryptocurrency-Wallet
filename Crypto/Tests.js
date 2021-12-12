const Crypto = require('./Crypto.js');

let msgBytes = Crypto.randomBytes(64);
let hash = Crypto.hash(msgBytes);
let secret = Crypto.newSecret();
let pub = Crypto.getPublic(secret);
let sig = Crypto.signMessage(hash, secret);
let valid = Crypto.verifySignature(hash, sig, pub);

console.log(Crypto.encode(hash));
console.log(pub);
console.log(Crypto.encode(sig));
console.log(valid);

