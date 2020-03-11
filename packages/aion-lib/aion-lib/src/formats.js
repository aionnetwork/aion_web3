'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var randomHex = require('randomhex');
var numberToBn = require('number-to-bn');

var _require = require('underscore'),
    isEmpty = _require.isEmpty,
    isArray = _require.isArray,
    isString = _require.isString,
    isNumber = _require.isNumber;

var BN = require('bn.js');
var values = require('./values');
var patterns = require('./patterns');

var copyString = function copyString(val) {
  return '' + val;
};

/**
 * True if string starts with '0x'
 * @param {string} val
 * @return {boolean}
 */
var startsWithZeroX = function startsWithZeroX(val) {
  return isString(val) === true && patterns.zeroX.test(val) === true;
};

/**
 * Removes '0x' from a string
 * @param {string} val
 * @return {string} checkAddressChecksum
 */
var removeLeadingZeroX = function removeLeadingZeroX(val) {
  return startsWithZeroX(val) === true ? val.replace(patterns.zeroX, '') : val;
};

/**
 * Put the 0x at the beginning of a string
 * @param {string} val
 * @return {string}
 */
var prependZeroX = function prependZeroX(val) {
  return startsWithZeroX(val) === false ? values.zeroX + val : val;
};

/**
 * Strips '0x' and turns it into a Buffer
 * @param {string} val
 * @return {buffer}
 */
var hexToBuffer = function hexToBuffer(val) {
  return toBuffer(val);
};

var bufferToHex = function bufferToHex(val) {
  return val.toString('hex');
};

var bufferToZeroXHex = function bufferToZeroXHex(val) {
  return prependZeroX(bufferToHex(val));
};

/**
 * Random Buffer of a size
 * @param {number} size
 * @return {buffer}
 */
var randomHexBuffer = function randomHexBuffer() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : values.hex.randomHexSize;
  return hexToBuffer(removeLeadingZeroX(randomHex(size)));
};

/**
 * True if a string is hex
 * @param {string} val
 * @return {boolean}
 */
var isHex = function isHex(val) {
  return isString(val) === true && patterns.hex.test(val) === true;
};

/**
 * True if two buffers have the same length and bytes
 * @param {buffer} buf1
 * @param {buffer} buf2
 * @return {boolean}
 */
function equalBuffers(buf1, buf2) {
  if (buf1.length !== buf2.length) {
    return false;
  }

  return buf1.every(function (byte, index) {
    return buf2[index] === byte;
  });
}

/**
 * Gracefully try to convert anything into a buffer
 * @param {object} val anything
 * @param {string} encoding hex, utf8
 * @return {buffer}
 */
function toBuffer(val, encoding) {
  if (val === undefined || val === null) {
    return Buffer.from([]);
  }

  // buffer or array
  if (isArray(val) === true || Buffer.isBuffer(val) === true) {
    return Buffer.from(val);
  }

  if (isNumber(val) === true || BN.isBN(val) === true) {
    // to array from BN is an array of bytes
    return Buffer.from(numberToBn(val).toArray());
  }

  // string
  if (isString(val) === true && isEmpty(encoding) === true) {
    // hex
    if (startsWithZeroX(val) === true || isHex(val) === true) {
      return Buffer.from(removeLeadingZeroX(val), 'hex');
    }
  }

  // anything else
  return Buffer.from(val, encoding);
}

var isBuffer = function isBuffer(val) {
  return Buffer.isBuffer(val);
};

function toNumber(val) {
  if (typeof val === 'number') {
    return val;
  }

  if (isHex(val) === true) {
    return new BN(removeLeadingZeroX(val), 'hex').toNumber();
  }

  if (BN.isBN(val) === true) {
    return val.toNumber();
  }

  throw new Error('unknown format "' + (typeof val === 'undefined' ? 'undefined' : _typeof(val)) + '" ' + val);
}

module.exports = {
  copyString: copyString,
  startsWithZeroX: startsWithZeroX,
  removeLeadingZeroX: removeLeadingZeroX,
  prependZeroX: prependZeroX,
  hexToBuffer: hexToBuffer,
  bufferToHex: bufferToHex,
  bufferToZeroXHex: bufferToZeroXHex,
  randomHexBuffer: randomHexBuffer,
  Buffer: Buffer,
  equalBuffers: equalBuffers,
  toBuffer: toBuffer,
  isBuffer: isBuffer,
  isHex: isHex,
  toNumber: toNumber
};