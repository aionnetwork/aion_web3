var chai = require('chai');
var assert = chai.assert;
var Abi = require('../packages/web3-eth-abi');

var tests = [{
    params: ['uint128', '0x00000000000000000000000000000010'],
    result: "16"
},{
    params: ['string', '0x000000000000000000000000000000100000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'],
    result: "Hello!%!"
}];

describe('decodeParameter', function () {
    tests.forEach(function (test) {
        it('should convert correctly', function () {
            assert.equal(Abi.decodeParameter.apply(Abi, test.params), test.result);
        });
    });
});
