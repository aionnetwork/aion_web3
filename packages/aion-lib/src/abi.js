/**
 * ABI encoding and decoding
 * @module abi
 */

let padStart = require('lodash.padstart')
let padEnd = require('lodash.padend')
let {isString, isObject, isArray, isNumber} = require('underscore')
let BN = require('bn.js')

let {
  copyString,
  prependZeroX,
  toBuffer,
  removeLeadingZeroX,
  bufferToHex
} = require('./formats')

let {keccak256} = require('./crypto')
let solidity = require('./solidity')
let values = require('./values')
let {createChecksumAddress} = require('./accounts')

/**
 * Shared between function and event signatures. Creates a name/type combination
 * and hashes it to get the hex signature.
 * @param {string} val
 * @return {string} hash
 */
function fnHashBuffer(val) {
  let op

  if (isString(val) === true) {
    op = copyString(val)
  }

  if (isObject(val) === true) {
    op = copyString(val.name)

    if (isArray(val.inputs) === true) {
      op += '(' + val.inputs.map(item => item.type).join(',') + ')'
    }
  }

  return keccak256(op).slice(0, values.solidity.types.function.byteLength)
}

/**
 * Pad left or right depending on direction
 * @param {string} direction left or right
 * @param {number} length
 * @param {string} val
 * @return {string}
 */
let abiPad = (direction, length, val) => {
  return (direction === 'left' ? padStart : padEnd)(val, length, '0')
}

/**
 * Encode padded ABI string value
 * @param {string} val
 * @return {string} hex
 */
function encodeAbiString(val) {
  let buf = toBuffer(val)
  let bufHex = buf.toString('hex')
  let valOp = abiPad(
    values.solidity.types.string.pad,
    values.solidity.types.string.stringLength,
    bufHex
  )
  return valOp
}

/**
 * Encode padded boolean to ABI format
 * @param {boolean} val
 * @return {string}
 */
function encodeAbiBoolean(val) {
  return copyString(
    val === true
      ? values.solidity.types.bool.one
      : values.solidity.types.bool.zero
  )
}

/**
 * A padded ABI formatted number
 * @param {number} val
 * @return {string}
 */
function encodeAbiNumber(val) {
  return abiPad(
    values.solidity.types.uint.pad,
    values.solidity.types.uint.stringLength,
    toBuffer(val).toString('hex')
  )
}

/**
 * ABI encoded Aion address
 * @param {string} val
 * @return {string}
 */
function encodeAbiAddress(val) {
  return removeLeadingZeroX(val).toLowerCase()
}

// replaces the need for switch case
let abiTypeEncoders = {
  string: encodeAbiString,
  bytes: encodeAbiString,
  bool: encodeAbiBoolean,
  uint: encodeAbiNumber,
  int: encodeAbiNumber,
  fixed: encodeAbiNumber,
  ufixed: encodeAbiNumber,
  address: encodeAbiAddress
}

/**
 * Encode event to its ABI signature
 * @method encodeEventSignature
 * @param {string|object} val
 * @return {string}
 */
function encodeEventSignature(val) {
  return prependZeroX(fnHashBuffer(val).toString('hex'))
}

/**
 * Encode function to its ABI signature
 * @method encodeFunctionSignature
 * @param {string|object} val
 * @return {string}
 */
function encodeFunctionSignature(val) {
  return prependZeroX(
    fnHashBuffer(val)
      .slice(0, values.solidity.types.function.byteLengthEncoded)
      .toString('hex')
  )
}

/**
 * Array reducer summing up all the items
 * @param {number} op accumulator
 * @param {number} item
 * @return {number}
 */
let sumLengthReduction = (op, item) => (op = op + item.length)

/**
 * Input an array of strings and calculate the length in bytes
 * @param {array} val
 * @return {number}
 */
let stringArrayByteLength = val => val.reduce(sumLengthReduction, 0) / 2

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
function encodeParametersIntermediate({types, params}) {
  let parsedTypes = types.map(solidity.parseType)

  let useTopLevelOffsets = parsedTypes.some(
    item => item.hasDynamicDimensions === true
  )

  let op = []
  let rows = []

  parsedTypes.forEach((parsedType, paramIndex) => {
    let param = params[paramIndex]
    let {baseType, dimensions, hasDimensions, hasDynamicDimensions} = parsedType
    let valueEncoder = abiTypeEncoders[baseType]
    let paramOp = []
    let paramLen = 0

    function addParamItem(item) {
      paramOp.push(valueEncoder(item))
    }

    if (isArray(param) === false) {
      paramLen = 1
      addParamItem(param)
    }

    if (isArray(param) === true) {
      paramLen = param.length
      if (hasDynamicDimensions === true) {
        paramOp.push(encodeAbiNumber(paramLen))
      }
      param.forEach(addParamItem)
    }

    let rowByteLen = stringArrayByteLength(paramOp)

    rows.push({
      hasDimensions,
      dimensions,
      rowByteLen,
      paramLen,
      paramOp
    })
  })

  let offset = 0

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

  rows.forEach(item => {
    op = op.concat(item.paramOp)
  })

  return {
    parsedTypes,
    rows,
    lines: op
  }
}

/**
 * Encode a list of parameters to ABI signature
 * @method encodeParameters
 * @param {array} types
 * @param {array} params
 * @return {string}
 */
function encodeParameters(types, params) {
  let op = encodeParametersIntermediate({types, params})
  op = op.lines
  op = op.join('')
  op = prependZeroX(op)
  return op
}

/**
 * Encode parameter to ABI signature
 * @method encodeParameter
 * @param {string} type
 * @param {string|array|object} param
 * @return {string}
 */
function encodeParameter(type, param) {
  return encodeParameters([type], [param])
}

/**
 * Encode function call to ABI signature
 * @method encodeFunctionCall
 * @param {object} jsonInterface
 * @param {array} params
 * @return {string}
 */
function encodeFunctionCall(jsonInterface, params) {
  let functionName = jsonInterface.name
  let functionHash = encodeFunctionSignature(functionName)
  let types = jsonInterface.inputs.map(item => item.type)
  let typesParams = removeLeadingZeroX(encodeParameters(types, params))
  return functionHash + typesParams
}

function decodeAbiString(val) {
  return toBuffer(val).toString('utf8')
}

function decodeAbiBytes(val) {
  return toBuffer(val)
}

function decodeAbiBoolean(val) {
  return val.pop() === 1 ? true : false
}

function decodeAbiNumber(val) {
  return new BN(bufferToHex(val), 'hex').toNumber();
}

function decodeAbiAddress(val) {
  return createChecksumAddress(toBuffer(val).toString('hex'))
}

let abiTypeDecodes = {
  string: decodeAbiString,
  bytes: decodeAbiBytes,
  bool: decodeAbiBoolean,
  uint: decodeAbiNumber,
  int: decodeAbiNumber,
  fixed: decodeAbiNumber,
  ufixed: decodeAbiNumber,
  address: decodeAbiAddress
}

/**
 * Decode the parameters hex into an array of decoded values
 * @method decodeParameters
 * @param {array} types
 * @param {string} val
 * @return {array}
 */
function decodeParameters(types, val) {
  let typeList = []

  if (isArray(types) === true && isString(types[0]) === true) {
    // array of string types
    typeList = types
  }

  if (isArray(types) === true && isString(types[0].type) === true) {
    // json interface
    typeList = types.map(item => item.type)
  }

  if (isObject(types) === true && types.type !== undefined) {
    // one from decode paramter
    typeList = [types.type]
  }

  let parsedTypes = typeList.map(solidity.parseType)

  let useTopLevelOffsets = parsedTypes.length > 1 && parsedTypes.some(
    item => item.hasDynamicDimensions === true
  )

  let bytes = toBuffer(val)
  let op = []
  let cursor = 0
  let previousByteLength = 16
  let outerOffsets = []

  function readBytes(length) {
    let op = bytes.slice(cursor, cursor + length)
    cursor += length
    return op
  }

  if (useTopLevelOffsets === true) {
    parsedTypes.forEach(() => {
      outerOffsets.push(decodeAbiNumber(readBytes(16)))
    })
    console.log('outerOffsets', outerOffsets)
  }

  parsedTypes.forEach((parsedType, paramIndex) => {
    let {baseType, dimensions, hasDimensions, hasDynamicDimensions} = parsedType
    let {byteLength} = values.solidity.types[baseType]
    let dynamicType = values.solidity.types[baseType].dynamic
    let valueDecoder = abiTypeDecodes[baseType]
    let offset = 0
    let innerOffsets = []
    let paramOp = []

    if (hasDynamicDimensions === true) {
      dimensions.forEach(() => {
        innerOffsets.push(decodeAbiNumber(readBytes(16)))
      })
      console.log('inner offsets', innerOffsets)
    }

    //
    // simple single type param
    //
    if (hasDimensions === false) {
      console.log('simple single type param')
      op.push(valueDecoder(readBytes(byteLength)))
      return
    }

    //
    // simple fixed-length array
    //
    if (hasDimensions === true && hasDynamicDimensions === false) {
      console.log('simple fixed-length array')
      let {length} = dimensions[0]
      for (let i = 0; i < length; i += 1) {
        paramOp.push(valueDecoder(readBytes(byteLength)))
      }
      return op.push(paramOp)
    }

    //
    // shifting to complex mode with offsets
    //

    //
    // we know it's an array now
    //
    let {length} = dimensions[0]

    if (isNumber(length) === true) {
      console.log('array with length')
      for (let i = 0; i < length; i += 1) {
        paramOp.push(valueDecoder(readBytes(byteLength)))
      }
      return op.push(paramOp)
    }

    console.log('dynamic array')

    dimensions.forEach((dimension, dimensionIndex) => {
      let {dynamic, length} = dimension
      let dimensionOp = []

      if (dynamic === true) {
        length = decodeAbiNumber(readBytes(16))
      }

      for (let i = 0; i < length; i += 1) {
        paramOp.push(valueDecoder(readBytes(byteLength)))
      }

      // paramOp.push(dimensionOp)
    })

    op.push(paramOp)
  })

  return op
}

/**
 * Decode a parameter value from it's ABI encoding
 * @method decodeParameter
 * @param {string} type
 * @param {string} val
 * @return {string}
 */
function decodeParameter(type, val) {
  return decodeParameters([type], val)[0]
}

/**
 * ABI decoded log data
 * @method decodeLog
 * @param {array} inputs
 * @param {string} val
 * @param {array} topics
 * @return {array}
 */
function decodeLog(/*inputs, val, topics*/) {
  throw new Error(`decodeLog not yet implemented`)
}

module.exports = {
  // for testing and analyzing
  encodeParametersIntermediate,

  // web3 implementations
  encodeFunctionSignature,
  encodeEventSignature,
  encodeParameter,
  encodeParameters,
  encodeFunctionCall,
  decodeParameter,
  decodeParameters,
  decodeLog
}
