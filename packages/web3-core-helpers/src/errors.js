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
    InvalidNumberOfParams: function(got, expected, method) {
        return new Error('Invalid number of parameters for "'+ method +'". Got '+ got +' expected '+ expected +'!');
    },
    InvalidConnection: function(host) {
        return new Error('CONNECTION ERROR: Couldn\'t connect to node '+ host +'.');
    },
    InvalidProvider: function() {
        return new Error('Provider not set or invalid');
    },
    InvalidResponse: function(result) {
        var message = !!result && !!result.error && !!result.error.message ? result.error.message : 'Invalid JSON RPC response: ' + JSON.stringify(result);
        return new Error(message);
    },
    ConnectionTimeout: function(ms) {
        return new Error('CONNECTION TIMEOUT: timeout of ' + ms + ' ms achived');
    },
    InvalidInstantiation: function() {
        return new Error('You need to instantiate using the "new" keyword.')
    },
    BlockTimeoutError: function(blocks) {
        return new Error('Transaction was not mined within ' + blocks + ' blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!')
    },
    PollingTimeoutError: function(seconds) {
        return new Error('Transaction was not mined within' + seconds + ' seconds, please make sure your transaction was properly sent. Be aware that it might still be mined!');
    },
    TransactionOutOfGasError: function(json) {
        return new Error('Transaction ran out of gas. Please provide more gas:\n' + json);
    },
    RevertedTransactionError: function(json) {
        return new Error('Transaction has been reverted by the EVM:\n' + json);
    },
    ContractCodeStorageError: function() {
        return new Error('The contract code couldn\'t be stored, please check your gas limit.');
    },
    MissingCoreProperty: function(property) {
        return new Error('When creating a method you need to provide at least the "' + property + '" property.');
    },
    MissingContractAddress: function() {
        return new Error('The transaction receipt didn\'t contain a contract address.');
    },
    MissingReceiptOrBlockHash: function() {
        return new Error('Receipt missing or blockHash null');
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
    },
    FailedSubscription: function(err) {
        return new Error('Failed to subscribe to new newBlockHeaders to confirm the transaction receipts.\n' + err);
    },
    NoSubscriptionSupport: function(name) {
        return new Error('The provider doesn\'t support subscriptions: ' + name);
    },
    UnspecificedJSONRPCParams: function(params) {
        return new Error('JSONRPC method should be specified for params: "'+ params +'"!');
    },
    SubscriptionAlreadyInstantiated: function {
        return new Error('Only a callback is allowed as parameter on an already instantiated subscription.');
    }
};
