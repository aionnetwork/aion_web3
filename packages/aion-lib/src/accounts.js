let {isString, isArray} = require('underscore')
let patterns = require('./patterns')
let values = require('./values')
let {blake2b256, nacl} = require('./crypto')

let {
  prependZeroX,
  removeLeadingZeroX,
  randomHexBuffer,
  bufferToZeroXHex,
  toBuffer
} = require('./formats')

// address + message signature length
let aionPubSigLen = nacl.sign.publicKeyLength + nacl.sign.signatureLength

function createKeyPair({entropy, privateKey}) {
  let kp
  let keyPair
  let ent
  let priv

  if (privateKey !== undefined) {
    priv = toBuffer(privateKey)
    kp = nacl.sign.keyPair.fromSecretKey(priv)
    keyPair = {
      _privateKey: priv,
      privateKey: bufferToZeroXHex(priv),
      publicKey: toBuffer(kp.publicKey)
    }
    return keyPair
  }

  if (entropy === undefined) {
    ent = randomHexBuffer()
  }

  if (typeof entropy === 'string') {
    ent = toBuffer(entropy)
  }

  // entropy sandwich
  ent = Buffer.concat([
    blake2b256(randomHexBuffer()), // bread
    blake2b256(ent), // peanut butter
    blake2b256(randomHexBuffer()) // bread 😉
  ])

  kp = nacl.sign.keyPair.fromSeed(ent.slice(0, nacl.sign.seedLength))
  priv = toBuffer(kp.secretKey)
  keyPair = {
    _privateKey: priv,
    privateKey: bufferToZeroXHex(priv),
    publicKey: toBuffer(kp.publicKey)
  }
  return keyPair
}

let isPrivateKey = val =>
  (isArray(val) === true || Buffer.isBuffer(val) === true) && val.length > 0

function createA0Address(publicKey) {
  let pkHash = Buffer.from(blake2b256(publicKey)).slice(1, 32)
  let address = Buffer.concat([values.addresses.identifier, pkHash], 32)
  return prependZeroX(address.toString('hex'))
}

function isAccountAddress(val) {
  if (val === undefined || isString(val) === false) {
    return false
  }

  return patterns.address.test(val) === true
}

function bit(arr, index) {
  let byteOffset = Math.floor(index / 8)
  let bitOffset = index % 8
  let uint8 = arr[byteOffset]
  return (uint8 >> bitOffset) & 0x1
}

function createChecksumAddress(val) {
  let address = removeLeadingZeroX(val.toLowerCase())
  let addressHash = blake2b256(toBuffer(address))

  return prependZeroX(
    address
      .split('')
      .map((item, index) => {
        let char = address[index]

        if (isNaN(char) === false) {
          // numeric
          return char
        }

        return bit(addressHash, index) === 1
          ? char.toUpperCase()
          : char.toLowerCase()
      })
      .join('')
  )
}

let isValidChecksumAddress = val => val === createChecksumAddress(val)

function equalAddresses(addr1, addr2) {
  return (
    removeLeadingZeroX(addr1.toLowerCase()) ===
    removeLeadingZeroX(addr2.toLowerCase())
  )
}

module.exports = {
  createKeyPair,
  isPrivateKey,
  createA0Address,
  isAccountAddress,
  createChecksumAddress,
  isValidChecksumAddress,
  equalAddresses,
  aionPubSigLen
}
