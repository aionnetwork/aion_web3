/*
 * Copyright (c) 2017-2018 Aion foundation.
 *
 *     This file is part of the aion network project.
 *
 *     The aion network project is free software: you can redistribute it 
 *     and/or modify it under the terms of the GNU General Public License 
 *     as published by the Free Software Foundation, either version 3 of 
 *     the License, or any later version.
 *
 *     The aion network project is distributed in the hope that it will 
 *     be useful, but WITHOUT ANY WARRANTY; without even the implied 
 *     warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *     See the GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the aion network project source files.  
 *     If not, see <https://www.gnu.org/licenses/>.
 *
 * Contributors:
 *     Aion foundation.
 *     Marek Kotewicz <marek@parity.io>
 *     Fabian Vogelsteller <fabian@frozeman.de>
 */

var _ = require('underscore');
var aionjsUnit = require('./aion-unit.js');
var utils = require('./utils.js');
var solidityBlake2b256 = require('./solidityBlake2b256.js');
var randomHex = require('randomhex');
var aionLib = require('aion-lib');

/**
 * Fires an error in an event emitter and callback and returns the eventemitter
 *
 * @method _fireError
 * @param {Object} error a string, a error, or an object with {message, data}
 * @param {Object} emitter
 * @param {Function} reject
 * @param {Function} callback
 * @return {Object} the emitter
 */
var _fireError = function (error, emitter, reject, callback) {
    /*jshint maxcomplexity: 10 */

    // add data if given
    if(_.isObject(error) && !(error instanceof Error) &&  error.data) {
        if(_.isObject(error.data) || _.isArray(error.data)) {
            error.data = JSON.stringify(error.data, null, 2);
        }

        error = error.message +"\n"+ error.data;
    }

    if(_.isString(error)) {
        error = new Error(error);
    }

    if (_.isFunction(callback)) {
        callback(error);
    }
    if (_.isFunction(reject)) {
        // suppress uncatched error if an error listener is present
        // OR suppress uncatched error if an callback listener is present
        if (emitter &&
            (_.isFunction(emitter.listeners) &&
            emitter.listeners('error').length) || _.isFunction(callback)) {
            emitter.catch(function(){});
        }
        // reject later, to be able to return emitter
        setTimeout(function () {
            reject(error);
        }, 1);
    }

    if(emitter && _.isFunction(emitter.emit)) {
        // emit later, to be able to return emitter
        setTimeout(function () {
            emitter.emit('error', error);
            emitter.removeAllListeners();
        }, 1);
    }

    return emitter;
};

/**
 * Should be used to create full function/event name from json abi
 *
 * @method _jsonInterfaceMethodToString
 * @param {Object} json
 * @return {String} full function/event name
 */
var _jsonInterfaceMethodToString = function (json) {
    if (_.isObject(json) && json.name && json.name.indexOf('(') !== -1) {
        return json.name;
    }

    return json.name + '(' + _flattenTypes(false, json.inputs).join(',') + ')';
};


/**
 * Should be used to flatten json abi inputs/outputs into an array of type-representing-strings
 *
 * @method _flattenTypes
 * @param {bool} includeTuple
 * @param {Object} puts
 * @return {Array} parameters as strings
 */
var _flattenTypes = function(includeTuple, puts)
{
    // console.log("entered _flattenTypes. inputs/outputs: " + puts)
    var types = [];

    puts.forEach(function(param) {
        if (typeof param.components === 'object') {
            if (param.type.substring(0, 5) !== 'tuple') {
                throw new Error('components found but type is not tuple; report on GitHub');
            }
            var suffix = '';
            var arrayBracket = param.type.indexOf('[');
            if (arrayBracket >= 0) { suffix = param.type.substring(arrayBracket); }
            var result = _flattenTypes(includeTuple, param.components);
            // console.log("result should have things: " + result)
            if(_.isArray(result) && includeTuple) {
                // console.log("include tuple word, and its an array. joining...: " + result.types)
                types.push('tuple(' + result.join(',') + ')' + suffix);
            }
            else if(!includeTuple) {
                // console.log("don't include tuple, but its an array. joining...: " + result)
                types.push('(' + result.join(',') + ')' + suffix);
            }
            else {
                // console.log("its a single type within a tuple: " + result.types)
                types.push('(' + result + ')');
            }
        } else {
            // console.log("its a type and not directly in a tuple: " + param.type)
            types.push(param.type);
        }
    });

    return types;
};


/**
 * Should be called to get ascii from it's hex representation
 *
 * @method hexToAscii
 * @param {String} hex
 * @returns {String} ascii string representation of hex value
 */
var hexToAscii = function(hex) {
    if (!utils.isHexStrict(hex))
        throw new Error('The parameter must be a valid HEX string.');

    var str = "";
    var i = 0, l = hex.length;
    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i+=2) {
        var code = parseInt(hex.substr(i, 2), 16);
        str += String.fromCharCode(code);
    }

    return str;
};

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 *
 * @method asciiToHex
 * @param {String} str
 * @returns {String} hex representation of input string
 */
var asciiToHex = function(str) {
    if(!str)
        return "0x00";
    var hex = "";
    for(var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        var n = code.toString(16);
        hex += n.length < 2 ? '0' + n : n;
    }

    return "0x" + hex;
};



/**
 * Returns value of unit in nAmp
 *
 * @method getUnitValue
 * @param {String} unit the unit to convert to, default aion
 * @returns {BN} value of the unit (in nAmp)
 * @throws error if the unit is not correct:w
 */
var getUnitValue = function (unit) {
    unit = unit ? unit.toLowerCase() : 'aion';
    if (!aionjsUnit.unitMap[unit]) {
        throw new Error('This unit "'+ unit +'" doesn\'t exist, please use the one of the following units' + JSON.stringify(aionjsUnit.unitMap, null, 2));
    }
    return unit;
};

/**
 * Takes a number of nAmp and converts it to any other aion unit.
 *
 * Possible units are:
 *   SI Short   SI Full        
 * - namp       uaion    
 * - uamp       maion      
 * - mamp       caion  
 * - amp        daion
 * -            aion
 *
 *              
 * @method fromNAmp
 * @param {Number|String} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert to, default aion
 * @return {String|Object} When given a BN object it returns one as well, otherwise a number
 */
var fromNAmp = function(number, unit) {
    unit = getUnitValue(unit);

    if(!utils.isBN(number) && !_.isString(number)) {
        throw new Error('Please pass numbers as strings or BigNumber objects to avoid precision errors.');
    }

    return utils.isBN(number) ? aionjsUnit.fromNAmp(number, unit) : aionjsUnit.fromNAmp(number, unit).toString(10);
};

/**
 * Takes a number of a unit and converts it to nAmp.
 *
 * Possible units are:
 *   SI Short   SI Full        
 * - namp       uaion    
 * - uamp       maion      
 * - mamp       caion  
 * - amp        daion
 * -            aion
 *
 * @method toNAmp
 * @param {Number|String|BN} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert from, default aion
 * @return {String|Object} When given a BN object it returns one as well, otherwise a number
 */
var toNAmp = function(number, unit) {
    unit = getUnitValue(unit);

    if(!utils.isBN(number) && !_.isString(number)) {
        throw new Error('Please pass numbers as strings or BigNumber objects to avoid precision errors.');
    }

    return utils.isBN(number) ? aionjsUnit.toNAmp(number, unit) : aionjsUnit.toNAmp(number, unit).toString(10);
};

/**
 * Converts to a checksum address
 *
 * @method toChecksumAddress
 * @param {String} address the given HEX address
 * @return {String}
 */
var toChecksumAddress = function (address) {
    if (typeof address === 'undefined') return '';

    if(!/^(0x)?[0-9a-f]{64}$/i.test(address))
        throw new Error('Given address "'+ address +'" is not a valid Aion address.');

    return aionLib.accounts.createChecksumAddress(address);
};

module.exports = {
    _fireError: _fireError,
    _jsonInterfaceMethodToString: _jsonInterfaceMethodToString,
    _flattenTypes: _flattenTypes,
    // extractDisplayName: extractDisplayName,
    // extractTypeName: extractTypeName,
    randomHex: randomHex,
    _: _,
    BN: utils.BN,
    isBN: utils.isBN,
    isBigNumber: utils.isBigNumber,
    isHex: utils.isHex,
    isHexStrict: utils.isHexStrict,
    blake2b256: utils.blake2b256,
    sha3: utils.sha3,
    keccak256: utils.sha3,
    solidityBlake2b256: solidityBlake2b256,
    isAddress: utils.isAddress,
    checkAddressChecksum: utils.checkAddressChecksum,
    toChecksumAddress: toChecksumAddress,
    toHex: utils.toHex,
    toBN: utils.toBN,

    bytesToHex: utils.bytesToHex,
    hexToBytes: utils.hexToBytes,

    hexToNumberString: utils.hexToNumberString,

    hexToNumber: utils.hexToNumber,
    toDecimal: utils.hexToNumber, // alias

    numberToHex: utils.numberToHex,
    fromDecimal: utils.numberToHex, // alias

    hexToUtf8: utils.hexToUtf8,
    hexToString: utils.hexToUtf8,
    toUtf8: utils.hexToUtf8,

    utf8ToHex: utils.utf8ToHex,
    stringToHex: utils.utf8ToHex,
    fromUtf8: utils.utf8ToHex,

    hexToAscii: hexToAscii,
    toAscii: hexToAscii,
    asciiToHex: asciiToHex,
    fromAscii: asciiToHex,

    unitMap: aionjsUnit.unitMap,
    toNAmp: toNAmp,
    fromNAmp: fromNAmp,

    padLeft: utils.leftPad,
    leftPad: utils.leftPad,
    padRight: utils.rightPad,
    rightPad: utils.rightPad,
    toTwosComplement: utils.toTwosComplement
};

