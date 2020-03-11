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

let validNonA0PrefixAddresses = [
	"0000000000000000000000000000000000000000000000000000000000000200",
	"08efa07244bacb5dc92daef46474560b57e9cfc2be62072fa21decf64051a317",
	"0a0b61014dc764640ee6087095faf68dfeb4e4b9ee681225611fea65932c93e4",
	"1318abaea6686c79eaa4ba37f5eef843bd065e74560ed1094133641b4f2395b8",
	"24a970ec53022623d95989e3340ff180a843c8645841699c4c19a227287901cf",
	"38dd1ae75523611bed9d4b647016dc8b0735c42317bd03e9bd65ceca69e8c46c",
	"64b09d162e2f91d3308381f28c02b9d0e5cb4270a43465b696e1db6210aad189",
	"7b8289c4b1ada70af8794b508f6db000ca25f1d1821c053da302a0403f73b29e",
	"aebf26d4d5438304e277a3d5104a3b056d8617f586f33560d4b2e7984a2bfe01",
	"af504da64d6cb7ec06a462b2c43a3cb4e482db3b41fde42b537f4c64fedc894b",
	"af694e98b964b275d723c2c66e224739d97d36125bba985215bca1075656b82e",
	"c00dcc9fe51c73767fad07cd4da990a8aa7487f40ba5718f711b4fdc09ae5b6e",
	"cb68ed818e6f712b315d53e0cce541b2d2e4c0d101ef1fcc91bccef1c21dffd7",
	"d801109bab93a4ab71c16e85389d9c366a23a975693cbdcc7e6db85561f1d5ce",
	"f5079727f0c503b5eae232dbd303128338576fc1db867892ae07dcc920691ab9"
];

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

  return patterns.address.test(val) === true || 
      (patterns.hash.test(val) && validNonA0PrefixAddresses.indexOf(val.replace(/^0x/, "")) > 0)
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
