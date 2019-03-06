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
 
"use strict";

module.exports = {
    ErrorResponse: function(result) {
        var message = !!result && !!result.error && !!result.error.message ? result.error.message : JSON.stringify(result);
        if (result && result.error && result.error.data)
            message += "..." + result.error.data;
        return new Error('Returned error: ' + message);
    },
    MissingCoreProperty: function(property) {
        return new Error('When creating a method you need to provide at least the "' + property + '" property.')
    },
    InvalidNumberOfParams: function(got, expected, method) {
        return new Error('Invalid number of parameters for "'+ method +'". Got '+ got +' expected '+ expected +'!');
    },
    InvalidConnection: function(host) {
        return new Error('CONNECTION ERROR: Couldn\'t connect to node '+ host +'.');
    },
    InvalidProvider: function() {
        return new Error('Provider not set or invalid');
    },
    InvalidInstantiation: function() {
        return new Error('You need to instantiate using the "new" keyword.')
    },
    InvalidResponse: function(result) {
        var message = !!result && !!result.error && !!result.error.message ? result.error.message : 'Invalid JSON RPC response: ' + JSON.stringify(result);
        return new Error(message);
    },
    ConnectionTimeout: function(ms) {
        return new Error('CONNECTION TIMEOUT: timeout of ' + ms + ' ms achived');
    },
    TxInputFormatterDataInputError: function() {
        return new Error('You can\'t have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.');
    },
    InputTransactionFormatterUndefinedFromField: function() {
        return new Error('The send transactions "from" field must be defined!');
    },
    InputAddressFormatterInvalidAddress: function(address) {
        return new Error('Provided address "'+ address +'" is invalid, the capitalization checksum test failed, or its an indrect IBAN address which can\'t be converted.')
    },
    OutputTransactionReceiptFormatterInvalidReceipt: function(receipt) {
        return new Error('Received receipt is invalid: ' + receipt);
    },
    TxInputFormatterDataHexError: function() {
        return new Error('The data field must be HEX encoded data.');
    },
    InputZipfileBase64FormatterInvalidArray: function() {
        return new Error('This must be a list of .sol filepaths');
    },
    InputZipfileBase64FormatterInvalidContract: function() {
        return new Error('One of the provided filepaths does not include a valid .sol file');
    }
};
