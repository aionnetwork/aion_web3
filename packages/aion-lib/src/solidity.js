let {isArray} = require('underscore')
let patterns = require('./patterns')
let values = require('./values')

/**
 * Parse the solidity type and give relevant information such is dimensions
 * @param {string} val
 * @return {object}
 */
function parseType(val) {
  let baseType = patterns.solidityTypeNoLength.exec(val)
  let bitLength = patterns.typeN.exec(val)
  let dimensions = val.match(patterns.solidityDimensions)
  let hasDimensions
  let hasDynamicDimensions

  if (baseType !== null) {
    baseType = baseType[1]
  }

  if (bitLength !== null) {
    bitLength = parseInt(bitLength[1], 10)
  }

  // bytes and string are dynamic

  if (dimensions !== null) {
    dimensions = dimensions.map(item => {
      let op = {}
      let digit = item.match(patterns.solidityDimensionDigit)

      // having [] is dynamic
      op.dynamic = item === values.solidity.dimensionsDynamic

      // otherwise the user specified a fixed length
      if (digit !== null) {
        op.length = parseInt(digit[0], 10)
      }

      return op
    })
  }

  // has [] or [6] or [][2]
  hasDimensions = isArray(dimensions) === true

  // has [] or [][]
  hasDynamicDimensions =
    hasDimensions === true &&
    isArray(dimensions) === true &&
    dimensions.some(item => item.dynamic === true)

  return {
    baseType,
    bitLength,
    dimensions,
    hasDimensions,
    hasDynamicDimensions
  }
}

module.exports = {
  parseType
}
