let randomHex = require('randomhex')
let numberToBn = require('number-to-bn')
let {isEmpty, isArray, isString, isNumber} = require('underscore')
let BN = require('bn.js')
let values = require('./values')
let patterns = require('./patterns')

let copyString = val => '' + val

/**
 * True if string starts with '0x'
 * @param {string} val
 * @return {boolean}
 */
let startsWithZeroX = val =>
  isString(val) === true && patterns.zeroX.test(val) === true

/**
 * Removes '0x' from a string
 * @param {string} val
 * @return {string} checkAddressChecksum
 */
let removeLeadingZeroX = val =>
  startsWithZeroX(val) === true ? val.replace(patterns.zeroX, '') : val

/**
 * Put the 0x at the beginning of a string
 * @param {string} val
 * @return {string}
 */
let prependZeroX = val =>
  startsWithZeroX(val) === false ? values.zeroX + val : val

/**
 * Strips '0x' and turns it into a Buffer
 * @param {string} val
 * @return {buffer}
 */
let hexToBuffer = val => toBuffer(val)

let bufferToHex = val => val.toString('hex')

let bufferToZeroXHex = val => prependZeroX(bufferToHex(val))

/**
 * Random Buffer of a size
 * @param {number} size
 * @return {buffer}
 */
let randomHexBuffer = (size = values.hex.randomHexSize) =>
  hexToBuffer(removeLeadingZeroX(randomHex(size)))

/**
 * True if a string is hex
 * @param {string} val
 * @return {boolean}
 */
let isHex = val => isString(val) === true && patterns.hex.test(val) === true

/**
 * True if two buffers have the same length and bytes
 * @param {buffer} buf1
 * @param {buffer} buf2
 * @return {boolean}
 */
function equalBuffers(buf1, buf2) {
  if (buf1.length !== buf2.length) {
    return false
  }

  return buf1.every((byte, index) => {
    return buf2[index] === byte
  })
}

/**
 * Gracefully try to convert anything into a buffer
 * @param {object} val anything
 * @param {string} encoding hex, utf8
 * @return {buffer}
 */
function toBuffer(val, encoding) {
  if (val === undefined || val === null) {
    return Buffer.from([])
  }

  // buffer or array
  if (isArray(val) === true || Buffer.isBuffer(val) === true) {
    return Buffer.from(val)
  }

  if (isNumber(val) === true || BN.isBN(val) === true) {
    // to array from BN is an array of bytes
    return Buffer.from(numberToBn(val).toArray())
  }

  // string
  if (isString(val) === true && isEmpty(encoding) === true) {
    // hex
    if (startsWithZeroX(val) === true || isHex(val) === true) {
      return Buffer.from(removeLeadingZeroX(val), 'hex')
    }
  }

  // anything else
  return Buffer.from(val, encoding)
}

let isBuffer = val => Buffer.isBuffer(val)

function toNumber(val) {
  if (typeof val === 'number') {
    return val
  }

  if (isHex(val) === true) {
    return new BN(removeLeadingZeroX(val), 'hex').toNumber()
  }

  if (BN.isBN(val) === true) {
    return val.toNumber()
  }

  throw new Error(`unknown format "${typeof val}" ${val}`)
}

module.exports = {
  copyString,
  startsWithZeroX,
  removeLeadingZeroX,
  prependZeroX,
  hexToBuffer,
  bufferToHex,
  bufferToZeroXHex,
  randomHexBuffer,
  Buffer,
  equalBuffers,
  toBuffer,
  isBuffer,
  isHex,
  toNumber
}
