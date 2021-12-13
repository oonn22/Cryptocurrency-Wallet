const Crypto = require("./Crypto.js");

//Simple file to test if various functions can be performed.

let testString = "Hello World!";
let testPassword = "1234";
let msgBytes = Crypto.randomBytes(64);
let hash = Crypto.hash(msgBytes);
let secret = Crypto.newSecret();
let pub = Crypto.getPublic(secret);
let sig = Crypto.signMessage(hash, secret);
let valid = Crypto.verifySignature(hash, sig, pub);
let enc = Crypto.encrypt(Buffer.from(testString), testPassword);
let dec = Crypto.decrypt(enc, testPassword);

console.log(Crypto.encode(hash));
console.log(pub);
console.log(Crypto.encode(sig));
console.log(valid);
console.log(enc);
console.log(Buffer.from(dec).toString());
