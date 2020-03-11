/**
*@module AVM coder-utils
*/
var BN = require('bn.js');
//var BigNumber = require('big-number');
var BigNumber = require('bignumber.js');
var aionLib = require('aion-lib');
var HexCharacters = '0123456789abcdef';

 /**
 *
 *@function getAddress
 *@desc Gets the right Coder based on the Param passed
 *@param {string} val - string value.
 * 
 */ 
function getAddress(val) {
  return aionLib.accounts.createChecksumAddress(val);
}

function addSlice(array) {
    if (array.slice) { return array; }

    array.slice = function() {
        var args = Array.prototype.slice.call(arguments);
        return Buffer.from(Array.prototype.slice.apply(array, args));
    }

    return array;
}

function endianEncoding(uint8s)
{
    this._uint8s = uint8s;
    this._index = 0;

    this.getWrittenLength = function()
    {
        return this._index;
    }

    this.writeOne = function(oneByte)
    {
        this._uint8s[this._index] = oneByte;
        this._index += 1;
    }

    this.writeTwo = function(twoBytes)
    {
        this._uint8s[this._index] = twoBytes >> 8;
        this._uint8s[this._index + 1] = twoBytes;
        this._index += 2;
    }

    this.writeFour = function(fourBytes)
    {
        this._uint8s[this._index] = fourBytes >> 24;
        this._uint8s[this._index + 1] = fourBytes >> 16;
        this._uint8s[this._index + 2] = fourBytes >> 8;
        this._uint8s[this._index + 3] = fourBytes;
        this._index += 4;
    }

    this.writeLength = function(length)
    {
        this.writeTwo(length);
    }

    this.writeBytes = function(buffer, length)
    {
        for (i = 0; i < length; ++i)
        {
            this._uint8s[this._index + i] = buffer[i];
        }
        this._index += length;
    }
}

function isHexString(value, length) {
    if (typeof(value) !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false
    }
    if (length && value.length !== 2 + 2 * length) { return false; }
    return true;
}

function arrayify(value) {
    if (value == null) {
        throw new Error('cannot convert null value to array');
    }
    if (!!(value.toHexString)) {
        value = value.toHexString();
    }
    if (typeof (value) === 'string') {
        var match = value.match(/^(0x)?[0-9a-fA-F]*$/);
        if (!match) {
            throw new Error('invalid hexidecimal string');
        }
        if (match[1] !== '0x') {
            throw new Error('hex string must have 0x prefix');
        }
        value = value.substring(2);
        if (value.length % 2) {
            value = '0' + value;
        }
        var result = [];
        for (var i = 0; i < value.length; i += 2) {
            result.push(parseInt(value.substr(i, 2), 16));
        }
        return addSlice(new Uint8Array(result));
    }
    if (isArrayish(value)) {
        return addSlice(new Uint8Array(value));
    }
    return aionLib.formats.toBuffer(value);
}

function defineProperty(object, name, value) {
    Object.defineProperty(object, name, {
        enumerable: true,
        value: value,
        writable: false,
    });
}

function padZeros(value, length) {
    value = arrayify(value);

    if (length < value.length) { throw new Error('cannot pad'); }

    var result = Buffer.alloc(length);
    result.set(value, length - value.length);
    return addSlice(result);
}

function bigNumberify(val) {
  return new BN(val);
}

/*function bigNumber(val) {
    //console.log('####start#####');
    //console.log(bigNumberify(val));
    //console.log(BigNumber(val).toString(256));
    //console.log('####end#####');
  //return '0x'+BigNumber(val).toString(16);
  //return bigNumberify(val);
  var bigint64 = new BigInt64Array();
  return bigint64.of(val);
}*/
function hexToBn(hex) {
  hex = hex.substring(2,hex.length);//remove 0x
  if (hex.length % 2) {
    hex = '0' + hex;
  }

  var highbyte = parseInt(hex.slice(0, 2), 16)
  var bn = BigInt('0x'+hex);

  if (0x80 & highbyte) {
    // bn = ~bn; WRONG in JS (would work in other languages)

    // manually perform two's compliment (flip bits, add one)
    // (because JS binary operators are incorrect for negatives)
    bn = BigInt('0b' + bn.toString(2).split('').map(function (i) {
      return '0' === i ? 1 : 0
    }).join('')) + BigInt(1);
    // add the sign character to output string (bytes are unaffected)
    bn = -bn;
  }

  return bn;
}

function bnToHex(bn) {
  var pos = true;
  bn = BigInt(bn);

  // I've noticed that for some operations BigInts can
  // only be compared to other BigInts (even small ones).
  // However, <, >, and == allow mix and match
  if (bn < 0) {
    pos = false;
    bn = bitnot(bn);
  }

  var base = 16;
  var hex = bn.toString(base);
  if (hex.length % 2) {
    hex = '0' + hex;
  }

  // Check the high byte _after_ proper hex padding
  var highbyte = parseInt(hex.slice(0, 2), 16);
  var highbit = (0x80 & highbyte);

  if (pos && highbit) {
    // A 32-byte positive integer _may_ be
    // represented in memory as 33 bytes if needed
    hex = '00' + hex;
  }

  return hex;
}

function bitnot(bn) {
  // JavaScript's bitwise not doesn't work on negative BigInts (bn = ~bn; // WRONG!)
  // so we manually implement our own two's compliment (flip bits, add one)
  bn = -bn;
  var bin = (bn).toString(2)
  var prefix = '';
  while (bin.length % 8) {
    bin = '0' + bin;
  }
  if ('1' === bin[0] && -1 !== bin.slice(1).indexOf('1')) {
    prefix = '11111111';
  }
  bin = bin.split('').map(function (i) {
    return '0' === i ? '1' : '0';
  }).join('');
  return BigInt('0b' + prefix + bin) + BigInt(1);
}


function bigNumber(bn,direction=null) { 
  if(direction !== null){
    return hexToBn(bn);    
  }else{
    return "0x"+bnToHex(bn);
  }
}

function bufToBn(buf) {
  var hex = [];
  u8 = Int8Array.from(buf);

  u8.forEach(function (i) {
    var h = i.toString(16);
    if (h.length % 2) { h = '0' + h; }
    hex.push(h);
  });

  return BigInt('0x' + hex.join('')).toString(10);
}

function bigNumberifyhex(val) {
  return new BN(val,16);
}

function concat(objects) {
    var arrays = [];
    var length = 0;
    for (var i = 0; i < objects.length; i++) {
        var object = arrayify(objects[i])
        arrays.push(object);
        length += object.length;
    }

    var result = Buffer.alloc(length);
    var offset = 0;
    for (var i = 0; i < arrays.length; i++) {
        result.set(arrays[i], offset);
        offset += arrays[i].length;
    }

    return addSlice(result);
}

function toUtf8Bytes(str) {
    var result = [];
    var offset = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 128) {
            result[offset++] = c;
        } else if (c < 2048) {
            result[offset++] = (c >> 6) | 192;
            result[offset++] = (c & 63) | 128;
        } else if (((c & 0xFC00) == 0xD800) && (i + 1) < str.length && ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
            // Surrogate Pair
            c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
            result[offset++] = (c >> 18) | 240;
            result[offset++] = ((c >> 12) & 63) | 128;
            result[offset++] = ((c >> 6) & 63) | 128;
            result[offset++] = (c & 63) | 128;
        } else {
            result[offset++] = (c >> 12) | 224;
            result[offset++] = ((c >> 6) & 63) | 128;
            result[offset++] = (c & 63) | 128;
        }
    }

    return arrayify(result);
}

function toUtf8String(bytes) {
    bytes = arrayify(bytes);

    var result = '';
    var i = 0;

    // Invalid bytes are ignored
    while(i < bytes.length) {
        var c = bytes[i++];
        if (c >> 7 == 0) {
            // 0xxx xxxx
            result += String.fromCharCode(c);
            continue;
        }

        // Invalid starting byte
        if (c >> 6 == 0x02) { continue; }

        // Multibyte; how many bytes left for thus character?
        var extraLength = null;
        if (c >> 5 == 0x06) {
            extraLength = 1;
        } else if (c >> 4 == 0x0e) {
            extraLength = 2;
        } else if (c >> 3 == 0x1e) {
            extraLength = 3;
        } else if (c >> 2 == 0x3e) {
            extraLength = 4;
        } else if (c >> 1 == 0x7e) {
            extraLength = 5;
        } else {
            continue;
        }

        // Do we have enough bytes in our data?
        if (i + extraLength > bytes.length) {

            // If there is an invalid unprocessed byte, try to continue
            for (; i < bytes.length; i++) {
                if (bytes[i] >> 6 != 0x02) { break; }
            }
            if (i != bytes.length) continue;

            // All leftover bytes are valid.
            return result;
        }

        // Remove the UTF-8 prefix from the char (res)
        var res = c & ((1 << (8 - extraLength - 1)) - 1);

        var count;
        for (count = 0; count < extraLength; count++) {
            var nextChar = bytes[i++];

            // Is the char valid multibyte part?
            if (nextChar >> 6 != 0x02) {break;};
            res = (res << 6) | (nextChar & 0x3f);
        }

        if (count != extraLength) {
            i--;
            continue;
        }

        if (res <= 0xffff) {
            result += String.fromCharCode(res);
            continue;
        }

        res -= 0x10000;
        result += String.fromCharCode(((res >> 10) & 0x3ff) + 0xd800, (res & 0x3ff) + 0xdc00);
    }

    return result;
}

function isArrayish(value) {
    if (!value || parseInt(value.length) != value.length || typeof(value) === 'string') {
        return false;
    }

    for (var i = 0; i < value.length; i++) {
        var v = value[i];
        if (v < 0 || v >= 256 || parseInt(v) != v) {
            return false;
        }
    }

    return true;
}

function hexlify(value) {

    if (value && value.toHexString) {
        return value.toHexString();
    }

    if (typeof(value) === 'number') {
        if (value < 0) {
            throw new Error('cannot hexlify negative value');
        }

        var hex = '';
        while (value) {
            hex = HexCharacters[value & 0x0f] + hex;
            value = parseInt(value / 16);
        }

        if (hex.length) {
            if (hex.length % 2) { hex = '0' + hex; }
            return '0x' + hex;
        }

        return '0x00';
    }

    if (isHexString(value)) {
        if (value.length % 2) {
            value = '0x0' + value.substring(2);
        }
        return value;
    }

    if (isArrayish(value)) {
        var result = [];
        for (var i = 0; i < value.length; i++) {
             var v = value[i];
             result.push(HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f]);
        }
        return '0x' + result.join('');
    }

    throw new Error('invalid hexlify value');
}

function defineReadOnly(object, name, value) {
    Object.defineProperty(object, name, {
        enumerable: true,
        value: value,
        writable: false,
    });
}

module.exports = {
    arrayify: arrayify,
    defineProperty: defineProperty,
    padZeros: padZeros,
    bigNumberify: bigNumberify,
    bigNumber: bigNumber,
    bigNumberifyhex: bigNumberifyhex,
    getAddress: getAddress,
    concat: concat,
    toUtf8Bytes: toUtf8Bytes,
    toUtf8String: toUtf8String,
    hexlify: hexlify,
    endianEncoding: endianEncoding,
    bufToBn: bufToBn,
    defineReadOnly: defineReadOnly
}
