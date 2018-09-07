var chai = require('chai');
var assert = chai.assert;
var Eth = require('../packages/web3-eth');
var Web3 = require('../packages/web3');

var eth = new Eth();

var accounts = require('./fixtures/accounts')
var address = accounts[0].address;
var checksumAddress = accounts[0].checksumAddress;

describe('web3.eth', function () {
    describe('defaultAccount', function () {
        it('should check if defaultAccount is set to proper value', function () {
            assert.equal(eth.defaultAccount, null);
            assert.equal(eth.personal.defaultAccount, null);
            assert.equal(eth.Contract.defaultAccount, null);
            assert.equal(eth.getCode.method.defaultAccount, null);
        });
        it('should set defaultAccount for all sub packages is set to proper value, if Eth package is changed', function () {
            eth.defaultAccount = address;

            assert.equal(eth.defaultAccount, checksumAddress);
            assert.equal(eth.personal.defaultAccount, checksumAddress);
            assert.equal(eth.Contract.defaultAccount, checksumAddress);
            assert.equal(eth.getCode.method.defaultAccount, checksumAddress);
        });
        it('should fail if address is invalid, wich is to be set to defaultAccount', function () {

            assert.throws(function(){ eth.defaultAccount = '0x17F33b27Bb249a2DBab4C0612BF9CaF4C1950855'; });

        });
        it('should have different values for two Eth instances', function () {

            var eth1 = new Eth();
            eth1.defaultAccount = address;
            assert.equal(eth1.defaultAccount, checksumAddress);

            var eth2 = new Eth();
            assert.equal(eth2.defaultAccount, null);

        });
        it('should have different values for two Web3 instances', function () {

            var web31 = new Web3();
            web31.eth.defaultAccount = address;
            assert.equal(web31.eth.defaultAccount, checksumAddress);

            var web32 = new Web3();
            assert.equal(web32.eth.defaultAccount, null);

        });
    });
});

