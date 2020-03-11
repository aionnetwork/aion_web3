var chai = require('chai');
var assert = chai.assert;
var formatters = require('../packages/web3-core-helpers/src/formatters.js');

var accounts = require('./fixtures/accounts')
var address0 = accounts[0].address;
var address1 = accounts[1].address;

var tests = [
    { input: address0, result: address0 },
    { input: address1, result: address1},
];

var errorTests = [
    '0x0c5496aee77c1ba1f0854206a26dda82a81d6d8',
    '0x0c5496aee77c1ba1f0854206a26dda82a81d6d8',
    '00c5496aee77c1ba1f0854206a26dda82a81d6d',
    'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZE',
    '0x',
    {},
    [],
    ''
];

describe('formatters', function () {
    describe('inputAddressFormatter correct addresses', function () {
        tests.forEach(function(test){
            it('should return the correct value', function () {
                assert.deepEqual(formatters.inputAddressFormatter(test.input), test.result);
            });
        });
    });
});


describe('formatters', function () {
    describe('inputAddressFormatter wrong addresses', function () {
        errorTests.forEach(function(test){
            it('should throw an exception', function () {
                assert.throws(function () {
                    formatters.inputAddressFormatter(test);
                }, null, null, 'Should throw:'+ test);
            });
        });
    });
});
