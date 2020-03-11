var chai = require('chai');
var assert = chai.assert;

global.ethereumProvider = {bzz: 'http://givenProvider:8500'};


describe('Web3.providers.givenProvider', function () {
    describe('should be set if ethereumProvider is available ', function () {

        it('when instantiating Web3', function () {

            var Web3 = require('../packages/web3');

            assert.deepEqual(Web3.givenProvider, global.ethereumProvider);

        });

        it('when instantiating Eth', function () {

            var Eth = require('../packages/web3-eth');

            assert.deepEqual(Eth.givenProvider, global.ethereumProvider);

        });

    });
});

