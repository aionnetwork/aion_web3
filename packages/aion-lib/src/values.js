/*

These are used as defaults usually if the API consumer does not provide their
own. For security purposes someone should at some point inspect the default
values.

*/

let values = Object.freeze({
  //
  // used in many places to add or remove this value
  //
  zeroX: '0x',
  //
  // eth-lib/nat
  // whatever that is it uses these values extensively
  //
  nat: {
    zero: '0x0',
    one: '0x1'
  },
  //
  // utils.toHex
  // randomHex
  //
  hex: {
    zero: '0x00',
    one: '0x01',
    // used for creating accounts
    // 32 bytes was used for the eth module
    // SECURITY: is this secure enough?
    randomHexSize: 32
  },
  //
  // Aion solidity
  //
  maxIntSize: 128,
  rpc: {
    url: 'http://127.0.0.1:8545'
  },
  addresses: {
    // addresses start with 0xAO identifier
    identifier: new Buffer('a0', 'hex'),
    // without 0x
    nonNumericLength: 64,
    // with 0x
    numericLength: 66,
    bytesLength: 32
  },
  //
  // crypto defaults
  // mostly taken from ethereum web3
  // SECURITY: should have a look some time
  //
  crypto: {
    saltLength: 32,
    ivLength: 16,
    kdf: 'script',
    dklen: 32,
    pbkdf2: {
      c: 262144,
      prf: 'hmac-sha256',
      digest: 'sha256'
    },
    scrypt: {
      n: 8192,
      r: 8,
      p: 2
    },
    cipherIvAlgorithm: 'aes-128-ctr',
    uuidRandomBytes: 16
  },
  //
  // solidity types
  //
  solidity: {
    //
    // utils.solidityPack
    //
    pack: {
      zero: '00',
      one: '01'
    },

    dimensionStartChar: '[',
    dimensionEndChar: ']',
    dimensionsDynamic: '[]',
    /*

    solidity type-specific information

    */
    types: {
      function: {
        // encoded(hashed) signature is short
        byteLengthEncoded: 4,
        bytelength: 16
      },
      bool: {
        pad: 'left',
        byteLength: 16,
        stringLength: 32,
        zero: '00000000000000000000000000000000',
        one: '00000000000000000000000000000001'
      },
      uint: {
        pad: 'left',
        byteLength: 16,
        stringLength: 32,
        numeric: true
      },
      int: {
        pad: 'left',
        byteLength: 16,
        stringLength: 32,
        numeric: true
      },
      fixed: {
        pad: 'left',
        byteLength: 16,
        stringLength: 32,
        numeric: true
      },
      ufixed: {
        pad: 'left',
        byteLength: 16,
        stringLength: 32,
        numeric: true
      },
      address: {
        // acts as uint256
        // the only exception
        pad: 'left',
        byteLength: 32,
        stringLength: 64
      },
      bytes: {
        pad: 'right',
        dynamic: true,
        byteLength: 32,
        stringLength: 64
      },
      string: {
        pad: 'right',
        dynamic: true,
        byteLength: 32,
        stringLength: 64
      }
    },
    numericTypes: ['uint', 'int', 'fixed', 'ufixed']
  }
})

module.exports = values
