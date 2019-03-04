var Accounts = require("./../packages/web3-eth-accounts");
var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();
var accounts = require('./fixtures/accounts');


describe("eth", function () {
    describe("accounts", function () {

        accounts.forEach(function (test, i) {

            it("sign data using a string", function() {
                var ethAccounts = new Accounts();

                var data = ethAccounts.sign(test.message, test.privateKey);

                assert.equal(data.signature, test.signature);
            });

            it("sign data using a utf8 encoded hex string", function() {
                var ethAccounts = new Accounts();

                var data = web3.utils.isHexStrict(test.message) ? test.message : web3.utils.utf8ToHex(test.message);
                var data = ethAccounts.sign(data, test.privateKey);

                assert.equal(data.signature, test.signature);
            });


            it("recover signature using a string", function() {
                var ethAccounts = new Accounts();

                var address = ethAccounts.recover(test.message, test.signature);

                assert.equal(address, test.address);
            });

            it("recover signature using a string and preFixed", function() {
                var ethAccounts = new Accounts();

                var address = ethAccounts.recover(ethAccounts.hashMessage(test.message), test.signature, true);

                assert.equal(address, test.address);
            });

            it("recover signature using a aion-pub-sig", function() {
                var ethAccounts = new Accounts();

                var signed = ethAccounts.sign(test.message, test.privateKey);
                var signature = signed.signature;
                var address = ethAccounts.recover(ethAccounts.hashMessage(test.message), signature, true);

                assert.equal(address, test.address);
            });

            it("recover signature (pre encoded) using a signature object", function() {
                var ethAccounts = new Accounts();

                var data = web3.utils.isHexStrict(test.message) ? test.message : web3.utils.utf8ToHex(test.message);
                var signed = ethAccounts.sign(data, test.privateKey);
                var address = ethAccounts.recover(signed);

                assert.equal(address, test.address);
            });

            it("recover signature using a signature object", function() {
                var ethAccounts = new Accounts();

                var signed = ethAccounts.sign(test.message, test.privateKey);
                var address = ethAccounts.recover(signed);

                assert.equal(address, test.address);
            });

            it("recover signature (pre encoded) using aion-pub-sig", function() {
                var ethAccounts = new Accounts();

                var data = web3.utils.isHexStrict(test.message) ? test.message : web3.utils.utf8ToHex(test.message);
                var signed = ethAccounts.sign(data, test.privateKey);
                var signature = signed.signature;
                var address = ethAccounts.recover(test.message, signature);

                assert.equal(address, test.address);
            });

            it("recover signature using aion-pub-sig", function() {
                var ethAccounts = new Accounts();

                var signed = ethAccounts.sign(test.message, test.privateKey);
                var signature = signed.signature;
                var address = ethAccounts.recover(test.message, signature);

                assert.equal(address, test.address);
            });
        });
    });
});