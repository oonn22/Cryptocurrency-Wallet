const Crypto = require("../Crypto/Crypto.js");
const Block = require("./Block.js");

/**
 * An account on the DAG and the keys required to control it
 */
class Wallet {
  constructor(address, encryptedSecret) {
    this.address = address;
    this.inChain = [];
    this.outChain = [];
    this.encrypted = encryptedSecret;
    this.nodeURL = "https://oonn22-node.tk:2096";
  }

  /**
   * Creates a new wallet object
   * @param {String} password
   * @param {Uint8Array} secret
   * @param {undefined | String} encryptedSecret
   * @returns
   */
  static async createWallet(password) {
    let secret = Crypto.newSecret();
    let address = Crypto.getPublic(secret);
    let encryptedSecret = await Crypto.encrypt(secret, password);

    return new Wallet(address, encryptedSecret);
  }

  /**
   * Decrypts a wallet secret using a password
   * @param {String} password
   * @returns
   */
  async decryptSecret(password) {
    return await Crypto.decrypt(this.encrypted, password);
  }

  /**
   * Retrieves and updates account information from the network
   */
  async getAccount() {
    try {
      let res = await fetch(
        this.nodeURL + "/accounts/account?address=" + this.address
      );
      let json = await res.json();

      this.inChain = Wallet._objectArrayToBlockArray(json.inChain);
      this.outChain = Wallet._objectArrayToBlockArray(json.outChain);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Determines an accounts balance after refreshing it from the node
   * @returns {Number}
   */
  async getBalance() {
    await this.getAccount();
    return this._determineBalance();
  }

  /**
   * Creates an outgoing block from this wallet, and sends it to a node
   * @param {Number} amount
   * @param {String} recipient
   * @param {String} passwd if secret not included, passwd needed to sign transaction
   * @param {Uint8Array | undefined} secret
   * @returns {boolean}
   */
  async sendTransaction(amount, recipient, passwd, secret = undefined) {
    if (secret === undefined) secret = await this.decryptSecret(passwd);
    if (secret === null) return false;

    await this.getAccount(); //refreshes account to ensure we have the latest blocks

    let block = Block()
      .withAmount(amount)
      .withSender(this.address)
      .withRecipient(recipient);

    if (this.outChain.length === 0)
      block.withPreviousHash(
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
      );
    else block.withPreviousHash(this.outChain[this.outChain.length - 1].hash);

    block = block.build();
    block.signBlock(secret);

    try {
      let res = await fetch(this.nodeURL + "/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(block),
        mode: "cors",
      });

      let json = await res.json();

      if (res.status === 200 || res.status === 201) return true;
      else return false;
    } catch (err) {
      console.log("Error Sending transaction:");
      console.log(err);
      return false;
    }
  }

  /**
   * Determines an accounts balance
   * @returns {Number}
   */
  _determineBalance() {
    let balance = 0;

    this.inChain.forEach((block) => {
      balance += block.amount;
    });

    this.outChain.forEach((block) => {
      balance -= block.amount;
    });

    return balance;
  }

  /**
   * A way to convert arrays of objects containing block data to an array of blocks
   * @param {Object[]} array
   * @return {Block[]}
   */
  static _objectArrayToBlockArray(array) {
    let blockArray = [];

    array.forEach((blockData) => {
      blockArray.push(Block(blockData).build());
    });

    return blockArray;
  }
}

module.exports = Wallet;
