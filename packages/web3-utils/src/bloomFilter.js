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
 *     Bas van Kervel <bas@ethereum.org>
 */ 

/**
 * Ethereum bloom filter support.
 *
 * TODO UNDOCUMENTED
 *
 * @module bloom
 * @class [bloom] bloom
 */

var utils = require("./utils.js");

function codePointToInt(codePoint) {
    if (codePoint >= 48 && codePoint <= 57) { /*['0'..'9'] -> [0..9]*/
        return codePoint-48;
    }

    if (codePoint >= 65 && codePoint <= 70) { /*['A'..'F'] -> [10..15]*/
        return codePoint-55;
    }

    if (codePoint >= 97 && codePoint <= 102) { /*['a'..'f'] -> [10..15]*/
        return codePoint-87;
    }

    throw "invalid bloom";
}

function testBytes(bloom, bytes) {
    var hash = utils.blake2b256(bytes).replace('0x','');

    for (var i = 0; i < 12; i += 4) {
        // calculate bit position in bloom filter that must be active
        var bitpos = ((parseInt(hash.substr(i, 2), 16) << 8) + parseInt(hash.substr((i+2), 2), 16)) & 2047;

        // test if bitpos in bloom is active
        var code = codePointToInt(bloom.charCodeAt(bloom.length - 1 - Math.floor(bitpos/4)));
        var offset = 1 << (bitpos % 4);

        if ((code&offset) !== offset) {
            return false;
        }
    }

    return true;
}

/**
 * Returns true if address is part of the given bloom.
 * note: false positives are possible.
 *
 * @method testAddress
 * @param {String} hex encoded bloom
 * @param {String} address in hex notation
 * @returns {Boolean} topic is (probably) part of the block
 */
var testAddress = function(bloom, address) {
    if (!utils.isBloom(bloom)) {
        throw new Error('Invalid bloom given');
    }
    if (!utils.isAddress(address)) {
        throw new Error('Invalid address given: "'+ address +'\"');
    }

    return testBytes(bloom, address);
};

/**
 * Returns true if the topic is part of the given bloom.
 * note: false positives are possible.
 *
 * @method hasTopic
 * @param {String} hex encoded bloom
 * @param {String} address in hex notation
 * @returns {Boolean} topic is (probably) part of the block
 */
var testTopic = function(bloom, topic) {
    if (!utils.isBloom(bloom)) throw "invalid bloom";
    if (!utils.isTopic(topic)) throw "invalid topic";

    return testBytes(bloom, topic);
};

module.exports = {
    testAddress: testAddress,
    testTopic:   testTopic
};
