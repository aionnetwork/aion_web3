'use strict';

/*

all these functions should work with a byte array while in other places
there is a lot of monkey-business about 0x, strings, hex, and etc.

*/

var blake2b = require('blake2b');
var nacl = require('tweetnacl');
var node = typeof global === 'undefined' ? require('crypto-browserify') : require('crypto');
var scrypt = require('scryptsy');
var jsSha3 = require('js-sha3');

function blake2b128(val) {
  // 16
  var out = Buffer.alloc(blake2b.BYTES_MIN);
  blake2b(blake2b.BYTES_MIN).update(val).digest(out);
  return out;
}

function blake2b256(val) {
  // 32
  var out = Buffer.alloc(blake2b.BYTES);
  blake2b(blake2b.BYTES).update(val).digest(out);
  return out;
}

function keccak256(val) {
  return jsSha3.keccak256(val);
}

module.exports = {
  blake2b128: blake2b128,
  blake2b256: blake2b256,
  nacl: nacl,
  node: node,
  scrypt: scrypt,
  keccak256: keccak256
};