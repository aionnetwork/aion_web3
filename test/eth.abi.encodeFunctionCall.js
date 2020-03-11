var chai = require('chai');
var assert = chai.assert;
var Abi = require('../packages/web3-eth-abi');

var tests = [{
    params: [{
        name: 'myMethod',
        type: 'function',
        inputs: [{
            type: 'uint128',
            name: 'myNumber'
        },{
            type: 'string',
            name: 'myString'
        }]
    }, ['2345675643', 'Hello!%']],
    result: '0xaaed82c10000000000000000000000008bd02b7b000000000000000000000000000000200000000000000000000000000000000748656c6c6f212500000000000000000000000000000000000000000000000000'
},{
    params: [{
        name: 'myOtherMethod',
        type: 'function',
        inputs: [{
            type: 'uint16',
            name: 'myNumberdd'
        },{
            type: 'bytes32',
            name: 'myBytes'
        }]
    }, [2323, '0x234567432145678543213456']],
    result: '0xed6d6f85000000000000000000000000000009132345674321456785432134560000000000000000000000000000000000000000'
},{
    params: [{
        name: 'myMethod',
        type: 'function',
        inputs: [{
            type: 'uint128',
            name: 'myNumber'
        },{
            type: 'bytes',
            name: 'myBytes'
        }]
    }, ['2345675643', '0x23456743214567854321ffffdddddd']],
    result: '0x42a233ac0000000000000000000000008bd02b7b000000000000000000000000000000200000000000000000000000000000000f23456743214567854321ffffdddddd0000000000000000000000000000000000'
}];

describe('encodeFunctionCall', function () {
    tests.forEach(function (test) {
        it('should convert correctly', function () {
            assert.equal(Abi.encodeFunctionCall.apply(Abi, test.params), test.result);
        });
    });
});
