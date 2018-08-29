/*eslint-disable no-console*/
let {Buffer} = require('safe-buffer')
let {isBuffer} = Buffer
let assert = require('assert')
let Accounts = require('../../src/accounts')
let {equalAddresses} = require('../../src/lib/accounts')
let values = require('../../src/lib/values')
let {testProvider} = require('./fixtures')
let {prependZeroX} = require('../../src/lib/formats')

let msg = 'test message'
let password = 'test password'

describe('Accounts', () => {
  let accounts
  let signedTransactionAccount
  let signedTransaction

  it('initializes', () => {
    accounts = new Accounts(testProvider)
  })

  it('create', () => {
    let account = accounts.create()
    account.address.should.be.a.String
    account.address.startsWith(values.zeroX).should.be.exactly(true)
    assert(isBuffer(account.privateKey))
    account.signTransaction.should.be.a.Function
    account.sign.should.be.a.Function
    account.encrypt.should.be.a.Function
  })

  it('signTransaction', done => {
    let account = accounts.create()

    // for recovery below
    signedTransactionAccount = account.address

    let tx = {
      gas: 50000,
      gasLimit: 60000,
      gasPrice: 80000,
      to: account.address,
      from: account.address,
      value: 90000,
      data: 'test',
      nonce: 0
    }
    account.signTransaction(tx, (err, res) => {
      // console.log('err', err)
      // console.log('res', res)

      if (err !== null && err !== undefined) {
        console.error('error signTransaction', err)
        return done(err)
      }

      res.messageHash.should.be.a.String
      res.signature.should.be.a.String
      res.aionPubSig.should.be.a.String
      res.rawTransaction.should.be.a.String

      res.messageHash.startsWith('0x').should.be.exactly(true)
      res.signature.startsWith('0x').should.be.exactly(true)
      res.aionPubSig.startsWith('0x').should.be.exactly(true)
      res.rawTransaction.startsWith('0x').should.be.exactly(true)

      signedTransaction = res

      done()
    })
  })

  it('hashMessage', () => {
    accounts.hashMessage('test').should.be.a.String
  })

  it('sign', () => {
    let account = accounts.create()
    let signed = account.sign(msg, account.privateKey)
    signed.message.should.be.exactly(msg)
    signed.messageHash.should.be.a.String
    signed.messageHash.should.be.a.String
    signed.signature.should.be.a.String
  })

  // should read from signedTransaction.aionPubSig instead of signedTransaction.signature
  it('recover', () => {
    // from above signTransaction
    accounts
      .recover(signedTransaction)
      .should.be.exactly(signedTransactionAccount)

    // and another from signing a message
    let account = accounts.create()
    let {address, privateKey} = account
    let signed = account.sign(msg, privateKey)
    let recovery = accounts.recover(signed)
    assert.equal(equalAddresses(address, recovery), true)
  })

  it('recoverTransaction', () => {
    accounts
      .recoverTransaction(signedTransaction.rawTransaction)
      .should.be.exactly(signedTransactionAccount)
  })

  it('encrypt (scrypt, slow)', () => {
    let account = accounts.create()
    let keystore = accounts.encrypt(account.privateKey, password, {
      kdf: 'scrypt'
    })
    keystore.version.should.be.exactly(3)
  })

  it('encrypt (pbkdf2, slow)', () => {
    let account = accounts.create()
    let keystore = accounts.encrypt(account.privateKey, password, {
      kdf: 'pbkdf2'
    })
    keystore.version.should.be.exactly(3)
    keystore.address.should.be.a.String
    keystore.address.should.have.length(64)
    keystore.crypto.ciphertext.should.be.a.String
    keystore.crypto.cipherparams.iv.should.be.a.String
    keystore.crypto.cipher.should.be.a.String
    keystore.crypto.kdf.should.be.exactly('pbkdf2')
    keystore.crypto.kdfparams.should.be.an.Object
    keystore.crypto.mac.should.be.a.String
  })

  xit('decrypt (scrypt, slow)', () => {
    let account = accounts.create()
    let keystore = accounts.encrypt(account.privateKey, password, {
      kdf: 'scrypt'
    })
    let decryptedAccount = accounts.decrypt(keystore, password, true)
    assert.equal(account.address, decryptedAccount.address)
  })

  xit('decrypt (pbkdf2, slow)', () => {
    let account = accounts.create()
    let keystore = accounts.encrypt(account.privateKey, password, {
      kdf: 'pbkdf2'
    })
    let decryptedAccount = accounts.decrypt(keystore, password, true)
    assert.equal(account.address, decryptedAccount.address)
  })

  /*

  ported from:
  https://github.com/aionnetwork/aion/blob/tx_encoding_tests/modAion/test/org/aion/types/AionTransactionTest.java
  https://github.com/aionnetwork/aion/blob/tx_encoding_tests/modAion/test/org/aion/types/AionTransactionIntegrationTest.java

*/

  it('basicEncodingTest', done => {
    // Reference Data [AionTransactionIntegrationTest.java - tx_encoding_tests branch]
    let obj = JSON.parse(`{
      "privateKey": "ab5e32b3180abc5251420aecf1cd4ed5f6014757dbdcf595d5ddf907a43ebd4af2d9cac934c028a26a681fe2127d0b602496834d7cfddd0db8a7a45079428525",
      "tx": {
        "nrgPrice": 10000000000,
        "nrg": 1000000,
        "data": "a035872d6af8639ede962dfe7536b0c150b590f3234a922fb7064cd11971b58e",
        "to": "9aabf5b86690ca4cae3fada8c72b280c4b9302dd8dd5e17bd788f241d7e3045c",
        "type": 1,
        "nonce": "01",
        "value": "01",
        "timestamp": "00057380e1f5330b"
      },
      "ed_sig": "6b00ed09ecc49814092b498d49c49f23cdfa71746b2723696b04ce601e87f5a3858e68c7f7e69f913f7e0b303e16b5fc3fa92829e24d6085a45092f5118b140a",
      "raw": "f85b01a09aabf5b86690ca4cae3fada8c72b280c4b9302dd8dd5e17bd788f241d7e3045c01a0a035872d6af8639ede962dfe7536b0c150b590f3234a922fb7064cd11971b58e8800057380e1f5330b830f42408800000002540be40001",
      "signed": "f8bd01a09aabf5b86690ca4cae3fada8c72b280c4b9302dd8dd5e17bd788f241d7e3045c01a0a035872d6af8639ede962dfe7536b0c150b590f3234a922fb7064cd11971b58e8800057380e1f5330b830f42408800000002540be40001b860f2d9cac934c028a26a681fe2127d0b602496834d7cfddd0db8a7a450794285256b00ed09ecc49814092b498d49c49f23cdfa71746b2723696b04ce601e87f5a3858e68c7f7e69f913f7e0b303e16b5fc3fa92829e24d6085a45092f5118b140a",
      "aion_sig": "f2d9cac934c028a26a681fe2127d0b602496834d7cfddd0db8a7a450794285256b00ed09ecc49814092b498d49c49f23cdfa71746b2723696b04ce601e87f5a3858e68c7f7e69f913f7e0b303e16b5fc3fa92829e24d6085a45092f5118b140a"
    }`)

    // Generate new account with privateKey
    let privateKey = Buffer.from(obj.privateKey, 'hex')
    let account = accounts.privateKeyToAccount(privateKey)
    signedTransactionAccount = account.address
    // console.log(isPrivateKey(privateKey));
    // console.log(isBuffer(privateKey));

    // Modify parameter inputs as Buffer type
    let tx = obj.tx
    tx.nonce = Buffer.from(obj.tx.nonce, 'hex')
    tx.to = Buffer.from(obj.tx.to, 'hex')
    tx.value = Buffer.from(obj.tx.value, 'hex')
    tx.data = Buffer.from(obj.tx.data, 'hex')
    tx.timestamp = Buffer.from(obj.tx.timestamp, 'hex')
    tx.type = Buffer.alloc(1).writeUInt8(obj.tx.type, 0)
    tx.gasPrice = obj.tx.nrgPrice
    tx.gas = obj.tx.nrg

    account.signTransaction(tx, (err, res) => {
      if (err !== null && err !== undefined) {
        console.error('error signTransaction', err)
        return done(err)
      }
      signedTransaction = res
      // console.log(signedTransaction);
      signedTransaction.encoded.should.be.eql(prependZeroX(obj.raw))
      // signedTransaction.signature.should.be.eql(prependZeroX(obj.ed_sig))
      signedTransaction.aionPubSig.should.be.eql(prependZeroX(obj.aion_sig))
      signedTransaction.rawTransaction.should.be.eql(prependZeroX(obj.signed))
      done()
    })
  })
})
