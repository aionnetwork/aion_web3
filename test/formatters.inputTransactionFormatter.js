var chai = require('chai');
var assert = chai.assert;
var formatters = require('../packages/web3-core-helpers/src/formatters.js');

var accounts = require('./fixtures/accounts')
var address = accounts[0].address;
var checksumAddress = accounts[0].checksumAddress;

var tests = [{
    input: {
        data: '0x34234bf23bf4234',
        value: '100',
        from: address, // checksum address
        to: address,
        nonce: 1000,
        gas: 1000,
        gasPrice: '1000'
    },
    result: {
        data: '0x34234bf23bf4234',
        value: '0x64',
        from: address,
        to: address,
        nonce: '0x3e8',
        gas: '0x3e8',
        gasPrice: '0x3e8'
    }
},{
    input: {
        data: '0x34234bf23bf4234',
        value: '100',
        from: address,
        to: address // checksum address
    },
    result: {
        data: '0x34234bf23bf4234',
        value: '0x64',
        from: address,
        to: address
    }
},{
    input: {
        data: '0x34234bf23bf4234',
        value: '100',
        from: address,
        to: address,
        gas: '1000',
        gasPrice: '1000'
    },
    result: {
        data: '0x34234bf23bf4234',
        value: '0x64',
        from: address,
        to: address,
        gas: '0x3e8',
        gasPrice: '0x3e8'
    },
}];

describe('formatters', function () {
    describe('inputTransactionFormatter', function () {
        tests.forEach(function(test){
            it('should return the correct value', function () {
                assert.deepEqual(formatters.inputTransactionFormatter(test.input), test.result);
            });
        });
    });
});
