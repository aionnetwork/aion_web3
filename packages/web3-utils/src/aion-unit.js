const BN = require('bn.js');
const numberToBN = require('number-to-bn');

const zero = new BN(0);
const negative1 = new BN(-1);

// complete aion unit map
const unitMap = {
  'namp':         '1', // eslint-disable-line
  'uamp':         '1000', // eslint-disable-line
  'mamp':         '1000000', // eslint-disable-line
  'amp':          '1000000000', // eslint-disable-line
  'uaion':        '1000000000000', // eslint-disable-line
  'maion':        '1000000000000000', // eslint-disable-line
  'caion':        '10000000000000000', // eslint-disable-line
  'daion':        '100000000000000000', // eslint-disable-line
  'aion':         '1000000000000000000', // eslint-disable-line
};

/**
 * Returns value of unit in nAmp
 *
 * @method getValueOfUnit
 * @param {String} unit the unit to convert to, default aion
 * @returns {BigNumber} value of the unit (in uAmp)
 * @throws error if the unit is not correct:w
 */
function getValueOfUnit(unitInput) {
  const unit = unitInput ? unitInput.toLowerCase() : 'aion';
  var unitValue = unitMap[unit]; // eslint-disable-line

  if (typeof unitValue !== 'string') {
    throw new Error(`[aion-unit] the unit provided ${unitInput} doesn't exists, please use the one of the following units ${JSON.stringify(unitMap, null, 2)}`);
  }

  return new BN(unitValue, 10);
}

function numberToString(arg) {
  if (typeof arg === 'string') {
    if (!arg.match(/^-?[0-9.]+$/)) {
      throw new Error(`while converting number to string, invalid number value '${arg}', should be a number matching (^-?[0-9.]+).`);
    }
    return arg;
  } else if (typeof arg === 'number') {
    return String(arg);
  } else if (typeof arg === 'object' && arg.toString && (arg.toTwos || arg.dividedToIntegerBy)) {
    if (arg.toPrecision) {
      return String(arg.toPrecision());
    } else { // eslint-disable-line
      return arg.toString(10);
    }
  }
  throw new Error(`while converting number to string, invalid number value '${arg}' type ${typeof arg}.`);
}

function fromNAmp(nAmpInput, unit, optionsInput) {
  var nAmp = numberToBN(nAmpInput); // eslint-disable-line
  var negative = nAmp.lt(zero); // eslint-disable-line
  const base = getValueOfUnit(unit);
  const baseLength = unitMap[unit].length - 1 || 1;
  const options = optionsInput || {};

  if (negative) {
    nAmp = nAmp.mul(negative1);
  }

  var fraction = nAmp.mod(base).toString(10); // eslint-disable-line

  while (fraction.length < baseLength) {
    fraction = `0${fraction}`;
  }

  if (!options.pad) {
    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
  }

  var whole = nAmp.div(base).toString(10); // eslint-disable-line

  if (options.commify) {
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  var value = `${whole}${fraction == '0' ? '' : `.${fraction}`}`; // eslint-disable-line

  if (negative) {
    value = `-${value}`;
  }

  return value;
}

function toNAmp(aionInput, unit) {
  var aion = numberToString(aionInput); // eslint-disable-line
  const base = getValueOfUnit(unit);
  const baseLength = unitMap[unit].length - 1 || 1;

  // Is it negative?
  var negative = (aion.substring(0, 1) === '-'); // eslint-disable-line
  if (negative) {
    aion = aion.substring(1);
  }

  if (aion === '.') { throw new Error(`[aion-unit] while converting number ${aionInput} to nAmp, invalid value`); }

  // Split it into a whole and fractional part
  var comps = aion.split('.'); // eslint-disable-line
  if (comps.length > 2) { throw new Error(`[aion-unit] while converting number ${aionInput} to nAmp,  too many decimal points`); }

  var whole = comps[0], fraction = comps[1]; // eslint-disable-line

  if (!whole) { whole = '0'; }
  if (!fraction) { fraction = '0'; }
  if (fraction.length > baseLength) { throw new Error(`[aion-unit] while converting number ${aionInput} to nAmp, too many decimal places`); }

  while (fraction.length < baseLength) {
    fraction += '0';
  }

  whole = new BN(whole);
  fraction = new BN(fraction);
  var nAmp = (whole.mul(base)).add(fraction); // eslint-disable-line

  if (negative) {
    nAmp = nAmp.mul(negative1);
  }

  return new BN(nAmp.toString(10), 10);
}

module.exports = {
  unitMap,
  numberToString,
  getValueOfUnit,
  fromNAmp,
  toNAmp,
};