const hexDecode = require("../Crypto/Encode").hexDecode;
const Crypto = require("../Crypto/Crypto.js");

/*
USAGE:

importing this file imports BlockBuilder.Block() method. Use this method to fill in a blocks data, by using the
Block.with_PROPERTY_NAME_() methods, then build the block using Block.build().
 */

/**
 * Class designed to make initializing a Block easier, and easier to adapt to future requirements. Ensure
 * functions marked REQUIRED are used before building the block with this.build()
 */
class BlockBuilder {
  /**
   * initializes the builder. Set the properties of a new block using the functions withPROP_NAME(VALUE), where
   * PROP_NAME is the property to set and VALUE is what to set the property as, before building the new block with
   * .build(). If all of the new blocks properties are already assigned to an object, the properties can be directly
   * added to the new block by passing the object as an argument here.
   * @param {Object | undefined} toAssign all properties of this object will be assigned to our new block
   * @returns {BlockBuilder}
   * @constructor
   */
  static Block(toAssign = undefined) {
    let builder = new BlockBuilder();
    if (toAssign !== undefined) Object.assign(builder, toAssign);
    return builder;
  }

  /**
   * Adds a sender to the new Block. sender should be a base32 string. REQUIRED
   * @param {String} sender
   * @returns {BlockBuilder}
   */
  withSender(sender) {
    this.sender = sender;
    return this;
  }

  /**
   * Adds a recipient to the new Block. recipient should be a base32 string. REQUIRED
   * @param {String} recipient
   * @returns {BlockBuilder}
   */
  withRecipient(recipient) {
    this.recipient = recipient;
    return this;
  }

  /**
   * Adds an amount to the new Block. REQUIRED
   * @param {Number} amount
   * @returns {BlockBuilder}
   */
  withAmount(amount) {
    this.amount = amount;
    return this;
  }

  /**
   * previous hash to include in the new block. All hashes should be base32 string. REQUIRED
   * @param {String} previousHash
   * @returns {BlockBuilder}
   */
  withPreviousHash(previousHash) {
    this.previousHash = previousHash;
    return this;
  }

  /**
   * The hash of the new block. If provided should be a base32 string. NOT REQUIRED, if not provided please
   * determine Blocks hash after block has been built to make the block valid.
   * @param {String} hash
   * @returns {BlockBuilder}
   */
  withHash(hash) {
    this.hash = hash;
    return this;
  }

  /**
   * The signature of the new block. If provided should be a base32 string. NOT REQUIRED, to make block valid
   * please sign it's hash with a private key after the block is built and hash is determined.
   * @param {String} sig
   * @returns {BlockBuilder}
   */
  withSig(sig) {
    this.sig = sig;
    return this;
  }

  /**
   * Builds and returns a Block with the values specified by calling the other builder functions.
   * @returns {Block}
   */
  build() {
    return new Block(this);
  }
}

/**
 * Represents a block in an account.
 */
class Block {
  /**
   * Represents a block in an account. This class should only be instantiated by the BlockBuilder Class.
   * @param {BlockBuilder} blockBuilder
   */
  constructor(blockBuilder) {
    // Ensuring required parameters are set
    if (blockBuilder.sender === undefined)
      throw new Error(
        "Blocks require a sender! set a sender when building with: .withSender(SENDER NAME HERE)"
      );
    if (blockBuilder.recipient === undefined)
      throw new Error(
        "Blocks require a recipient! set a recipient when building with: .withRecipient(RECIPIENT NAME HERE)"
      );
    if (blockBuilder.amount === undefined)
      throw new Error(
        "Blocks require an amount! set an amount when building with: .withAmount(AMOUNT HERE)"
      );
    if (blockBuilder.previousHash === undefined)
      throw new Error(
        "Blocks require a previousHash! set previousHash when building with: .withPreviousHash(PREVIOUS HASH HERE)"
      );

    //Sets block parameters
    this.sender = blockBuilder.sender;
    this.recipient = blockBuilder.recipient;
    this.amount = blockBuilder.amount;
    this.previousHash = blockBuilder.previousHash;
    this.hash = blockBuilder.hash;
    this.sig = blockBuilder.sig;
  }

  /**
   * Determines a blocks hash
   */
  determineHash() {
    let sender = Crypto.encode(Crypto.hash(Crypto.decode(this.sender)));
    let recipient = Crypto.encode(Crypto.hash(Crypto.decode(this.recipient)));
    let amount = Crypto.encode(
      Crypto.hash(hexDecode(this.amount.toString(16)))
    );
    let prevHash = Crypto.encode(Crypto.hash(Crypto.decode(this.previousHash)));

    let toHash = Crypto.decode(sender + recipient + amount + prevHash);

    return Crypto.encode(Crypto.hash(toHash));
  }

  /**
   * signs this block's hash with a secret. If no hash, determines it first.
   * @param {Buffer} secret to sign with
   */
  signBlock(secret) {
    if (this.hash === undefined) this.hash = this.determineHash();

    this.sig = Crypto.encode(
      Crypto.signMessage(Crypto.decode(this.hash), secret)
    );
  }
}

module.exports = BlockBuilder.Block;
