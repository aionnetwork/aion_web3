'use strict';

/**
 * ABI encoding and decoding
 * @module abi
 */

var padStart = require('lodash.padstart');
var padEnd = require('lodash.padend');

var _require = require('underscore'),
    isString = _require.isString,
    isObject = _require.isObject,
    isArray = _require.isArray,
    isNumber = _require.isNumber;

var BN = require('bn.js');

var _require2 = require('./formats'),
    copyString = _require2.copyString,
    prependZeroX = _require2.prependZeroX,
    toBuffer = _require2.toBuffer,
    removeLeadingZeroX = _require2.removeLeadingZeroX,
    bufferToHex = _require2.bufferToHex;

var _require3 = require('./crypto'),
    keccak256 = _require3.keccak256;

var solidity = require('./solidity');
var values = require('./values');

var _require4 = require('./accounts'),
    createChecksumAddress = _require4.createChecksumAddress;

/**
 * Shared between function and event signatures. Creates a name/type combination
 * and hashes it to get the hex signature.
 * @param {string} val
 * @return {string} hash
 */


function fnHashBuffer(val) {
  var op = void 0;

  if (isString(val) === true) {
    op = copyString(val);
  }

  if (isObject(val) === true) {
    op = copyString(val.name);

    if (isArray(val.inputs) === true) {
      op += '(' + val.inputs.map(function (item) {
        return item.type;
      }).join(',') + ')';
    }
  }

  return keccak256(op).slice(0, values.solidity.types.function.byteLength);
}

/**
 * Pad left or right depending on direction
 * @param {string} direction left or right
 * @param {number} length
 * @param {string} val
 * @return {string}
 */
var abiPad = function abiPad(direction, length, val) {
  return (direction === 'left' ? padStart : padEnd)(val, length, '0');
};

/**
 * Encode padded ABI string value
 * @param {string} val
 * @return {string} hex
 */
function encodeAbiString(val) {
  var buf = toBuffer(val);
  var bufHex = buf.toString('hex');
  var valOp = abiPad(values.solidity.types.string.pad, values.solidity.types.string.stringLength, bufHex);
  return valOp;
}

/**
 * Encode padded boolean to ABI format
 * @param {boolean} val
 * @return {string}
 */
function encodeAbiBoolean(val) {
  return copyString(val === true ? values.solidity.types.bool.one : values.solidity.types.bool.zero);
}

/**
 * A padded ABI formatted number
 * @param {number} val
 * @return {string}
 */
function encodeAbiNumber(val) {
  return abiPad(values.solidity.types.uint.pad, values.solidity.types.uint.stringLength, toBuffer(val).toString('hex'));
}

/**
 * ABI encoded Aion address
 * @param {string} val
 * @return {string}
 */
function encodeAbiAddress(val) {
  return removeLeadingZeroX(val).toLowerCase();
}

// replaces the need for switch case
var abiTypeEncoders = {
  string: encodeAbiString,
  bytes: encodeAbiString,
  bool: encodeAbiBoolean,
  uint: encodeAbiNumber,
  int: encodeAbiNumber,
  fixed: encodeAbiNumber,
  ufixed: encodeAbiNumber,
  address: encodeAbiAddress

  /**
   * Encode event to its ABI signature
   * @method encodeEventSignature
   * @param {string|object} val
   * @return {string}
   */
};function encodeEventSignature(val) {
  return prependZeroX(fnHashBuffer(val).toString('hex'));
}

/**
 * Encode function to its ABI signature
 * @method encodeFunctionSignature
 * @param {string|object} val
 * @return {string}
 */
function encodeFunctionSignature(val) {
  return prependZeroX(fnHashBuffer(val).slice(0, values.solidity.types.function.byteLengthEncoded).toString('hex'));
}

/**
 * Array reducer summing up all the items
 * @param {number} op accumulator
 * @param {number} item
 * @return {number}
 */
var sumLengthReduction = function sumLengthReduction(op, item) {
  return op = op + item.length;
};

/**
 * Input an array of strings and calculate the length in bytes
 * @param {array} val
 * @return {number}
 */
var stringArrayByteLength = function stringArrayByteLength(val) {
  return val.reduce(sumLengthReduction, 0) / 2;
};

/**
 * Converts from arrays of types and params into a data structure
 *
 * It's used by other functions in this module to build ABI encoding and
 * to give better information if the developer is curious to know
 * each line of bytes.
 *
 * @param {array} options.types
 * @param {array} options.params
 * @return {object}
 */
function encodeParametersIntermediate(_ref) {
  var types = _ref.types,
      params = _ref.params;

  var parsedTypes = types.map(solidity.parseType);

  var useTopLevelOffsets = parsedTypes.some(function (item) {
    return item.hasDynamicDimensions === true;
  });

  var op = [];
  var rows = [];

  parsedTypes.forEach(function (parsedType, paramIndex) {
    var param = params[paramIndex];
    var baseType = parsedType.baseType,
        dimensions = parsedType.dimensions,
        hasDimensions = parsedType.hasDimensions,
        hasDynamicDimensions = parsedType.hasDynamicDimensions;

    var valueEncoder = abiTypeEncoders[baseType];
    var paramOp = [];
    var paramLen = 0;

    function addParamItem(item) {
      paramOp.push(valueEncoder(item));
    }

    if (isArray(param) === false) {
      paramLen = 1;
      addParamItem(param);
    }

    if (isArray(param) === true) {
      paramLen = param.length;
      if (hasDynamicDimensions === true) {
        paramOp.push(encodeAbiNumber(paramLen));
      }
      param.forEach(addParamItem);
    }

    var rowByteLen = stringArrayByteLength(paramOp);

    rows.push({
      hasDimensions: hasDimensions,
      dimensions: dimensions,
      rowByteLen: rowByteLen,
      paramLen: paramLen,
      paramOp: paramOp
    });
  });

  var offset = 0;

  /*if (useTopLevelOffsets === true) {
    // first item is this many bytes down
    offset += rows.length * 16
    op.push(encodeAbiNumber(offset))
     rows.forEach((item, index) => {
      if (index === rows.length - 1) {
        return
      }
      offset += item.rowByteLen
      op.push(encodeAbiNumber(offset))
    })
  }*/

  rows.forEach(function (item) {
    op = op.concat(item.paramOp);
  });

  return {
    parsedTypes: parsedTypes,
    rows: rows,
    lines: op
  };
}

/**
 * Encode a list of parameters to ABI signature
 * @method encodeParameters
 * @param {array} types
 * @param {array} params
 * @return {string}
 */
function encodeParameters(types, params) {
  var op = encodeParametersIntermediate({ types: types, params: params });
  op = op.lines;
  op = op.join('');
  op = prependZeroX(op);
  return op;
}

/**
 * Encode parameter to ABI signature
 * @method encodeParameter
 * @param {string} type
 * @param {string|array|object} param
 * @return {string}
 */
function encodeParameter(type, param) {
  return encodeParameters([type], [param]);
}

/**
 * Encode function call to ABI signature
 * @method encodeFunctionCall
 * @param {object} jsonInterface
 * @param {array} params
 * @return {string}
 */
function encodeFunctionCall(jsonInterface, params) {
  var functionName = jsonInterface.name;
  var functionHash = encodeFunctionSignature(functionName);
  var types = jsonInterface.inputs.map(function (item) {
    return item.type;
  });
  var typesParams = removeLeadingZeroX(encodeParameters(types, params));
  return functionHash + typesParams;
}

function decodeAbiString(val) {
  return toBuffer(val).toString('utf8');
}

function decodeAbiBytes(val) {
  return toBuffer(val);
}

function decodeAbiBoolean(val) {
  return val.pop() === 1 ? true : false;
}

function decodeAbiNumber(val) {
  return new BN(bufferToHex(val), 'hex').toNumber();
}

function decodeAbiAddress(val) {
  return createChecksumAddress(toBuffer(val).toString('hex'));
}

var abiTypeDecodes = {
  string: decodeAbiString,
  bytes: decodeAbiBytes,
  bool: decodeAbiBoolean,
  uint: decodeAbiNumber,
  int: decodeAbiNumber,
  fixed: decodeAbiNumber,
  ufixed: decodeAbiNumber,
  address: decodeAbiAddress

  /**
   * Decode the parameters hex into an array of decoded values
   * @method decodeParameters
   * @param {array} types
   * @param {string} val
   * @return {array}
   */
};function decodeParameters(types, val) {
  var typeList = [];

  if (isArray(types) === true && isString(types[0]) === true) {
    // array of string types
    typeList = types;
  }

  if (isArray(types) === true && isString(types[0].type) === true) {
    // json interface
    typeList = types.map(function (item) {
      return item.type;
    });
  }

  if (isObject(types) === true && types.type !== undefined) {
    // one from decode paramter
    typeList = [types.type];
  }

  var parsedTypes = typeList.map(solidity.parseType);

  var useTopLevelOffsets = parsedTypes.length > 1 && parsedTypes.some(function (item) {
    return item.hasDynamicDimensions === true;
  });

  var bytes = toBuffer(val);
  var op = [];
  var cursor = 0;
  var previousByteLength = 16;
  var outerOffsets = [];

  function readBytes(length) {
    var op = bytes.slice(cursor, cursor + length);
    cursor += length;
    return op;
  }

  if (useTopLevelOffsets === true) {
    parsedTypes.forEach(function () {
      outerOffsets.push(decodeAbiNumber(readBytes(16)));
    });
    console.log('outerOffsets', outerOffsets);
  }

  parsedTypes.forEach(function (parsedType, paramIndex) {
    var baseType = parsedType.baseType,
        dimensions = parsedType.dimensions,
        hasDimensions = parsedType.hasDimensions,
        hasDynamicDimensions = parsedType.hasDynamicDimensions;
    var byteLength = values.solidity.types[baseType].byteLength;

    var dynamicType = values.solidity.types[baseType].dynamic;
    var valueDecoder = abiTypeDecodes[baseType];
    var offset = 0;
    var innerOffsets = [];
    var paramOp = [];

    if (hasDynamicDimensions === true) {
      dimensions.forEach(function () {
        innerOffsets.push(decodeAbiNumber(readBytes(16)));
      });
      console.log('inner offsets', innerOffsets);
    }

    //
    // simple single type param
    //
    if (hasDimensions === false) {
      console.log('simple single type param');
      op.push(valueDecoder(readBytes(byteLength)));
      return;
    }

    //
    // simple fixed-length array
    //
    if (hasDimensions === true && hasDynamicDimensions === false) {
      console.log('simple fixed-length array');
      var _length = dimensions[0].length;

      for (var i = 0; i < _length; i += 1) {
        paramOp.push(valueDecoder(readBytes(byteLength)));
      }
      return op.push(paramOp);
    }

    //
    // shifting to complex mode with offsets
    //

    //
    // we know it's an array now
    //
    var length = dimensions[0].length;


    if (isNumber(length) === true) {
      console.log('array with length');
      for (var _i = 0; _i < length; _i += 1) {
        paramOp.push(valueDecoder(readBytes(byteLength)));
      }
      return op.push(paramOp);
    }

    console.log('dynamic array');

    dimensions.forEach(function (dimension, dimensionIndex) {
      var dynamic = dimension.dynamic,
          length = dimension.length;

      var dimensionOp = [];

      if (dynamic === true) {
        length = decodeAbiNumber(readBytes(16));
      }

      for (var _i2 = 0; _i2 < length; _i2 += 1) {
        paramOp.push(valueDecoder(readBytes(byteLength)));
      }

      // paramOp.push(dimensionOp)
    });

    op.push(paramOp);
  });

  return op;
}

/**
 * Decode a parameter value from it's ABI encoding
 * @method decodeParameter
 * @param {string} type
 * @param {string} val
 * @return {string}
 */
function decodeParameter(type, val) {
  return decodeParameters([type], val)[0];
}

/**
 * ABI decoded log data
 * @method decodeLog
 * @param {array} inputs
 * @param {string} val
 * @param {array} topics
 * @return {array}
 */
function decodeLog() /*inputs, val, topics*/{
  throw new Error('decodeLog not yet implemented');
}

module.exports = {
  // for testing and analyzing
  encodeParametersIntermediate: encodeParametersIntermediate,

  // web3 implementations
  encodeFunctionSignature: encodeFunctionSignature,
  encodeEventSignature: encodeEventSignature,
  encodeParameter: encodeParameter,
  encodeParameters: encodeParameters,
  encodeFunctionCall: encodeFunctionCall,
  decodeParameter: decodeParameter,
  decodeParameters: decodeParameters,
  decodeLog: decodeLog
};