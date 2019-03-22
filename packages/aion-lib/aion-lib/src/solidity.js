'use strict';

var _require = require('underscore'),
    isArray = _require.isArray;

var patterns = require('./patterns');
var values = require('./values');

/**
 * Parse the solidity type and give relevant information such is dimensions
 * @param {string} val
 * @return {object}
 */
function parseType(val) {
  var baseType = patterns.solidityTypeNoLength.exec(val);
  var bitLength = patterns.typeN.exec(val);
  var dimensions = val.match(patterns.solidityDimensions);
  var hasDimensions = void 0;
  var hasDynamicDimensions = void 0;

  if (baseType !== null) {
    baseType = baseType[1];
  }

  if (bitLength !== null) {
    bitLength = parseInt(bitLength[1], 10);
  }

  // bytes and string are dynamic

  if (dimensions !== null) {
    dimensions = dimensions.map(function (item) {
      var op = {};
      var digit = item.match(patterns.solidityDimensionDigit);

      // having [] is dynamic
      op.dynamic = item === values.solidity.dimensionsDynamic;

      // otherwise the user specified a fixed length
      if (digit !== null) {
        op.length = parseInt(digit[0], 10);
      }

      return op;
    });
  }

  // has [] or [6] or [][2]
  hasDimensions = isArray(dimensions) === true;

  // has [] or [][]
  hasDynamicDimensions = hasDimensions === true && isArray(dimensions) === true && dimensions.some(function (item) {
    return item.dynamic === true;
  });

  return {
    baseType: baseType,
    bitLength: bitLength,
    dimensions: dimensions,
    hasDimensions: hasDimensions,
    hasDynamicDimensions: hasDynamicDimensions
  };
}

module.exports = {
  parseType: parseType
};