var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Web3 = require('../packages/web3');
var Accounts = require("./../packages/web3-eth-accounts");
var chai = require('chai');
var assert = chai.assert;
var accounts = require('./fixtures/accounts');

var clone = function(object) {
    return object ? JSON.parse(JSON.stringify(object)) : [];
};

describe("eth", function() {
    describe("accounts", function() {

        // For each test
        accounts.forEach(function(test, i) {

            it("signTransaction must compare to eth_signTransaction", function(done) {
                var ethAccounts = new Accounts();

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                testAccount.signTransaction(test.transaction).then(function(tx) {
                        assert.equal(tx.rawTransaction, test.rawTransaction);
                        done();
                    })
                    .catch(done);
            });

            xit("signTransaction using the iban as \"to\" must compare to eth_signTransaction", function(done) {
                var ethAccounts = new Accounts();

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                var transaction = clone(test.transaction);
                transaction.to = transaction.toIban;
                delete transaction.toIban;
                testAccount.signTransaction(transaction).then(function(tx) {
                        assert.equal(tx.rawTransaction, test.rawTransaction);
                        done();
                    })
                    .catch(done);
            });

            it("signTransaction will call for nonce", function(done) {
                var provider = new FakeHttpProvider();
                var web3 = new Web3(provider);

                provider.injectResult('0xa');
                provider.injectValidation(function(payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'eth_getTransactionCount');
                    assert.deepEqual(payload.params, [test.address, "latest"]);
                });

                var ethAccounts = new Accounts(web3);

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                var transaction = clone(test.transaction);
                delete transaction.nonce;
                testAccount.signTransaction(transaction)
                    .then(function(tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    })
                    .catch(done);
            });

            it("signTransaction will call for gasPrice", function(done) {
                var provider = new FakeHttpProvider();
                var web3 = new Web3(provider);

                provider.injectResult('0x5022');
                provider.injectValidation(function(payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'eth_gasPrice');
                    assert.deepEqual(payload.params, []);
                });

                var ethAccounts = new Accounts(web3);

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                var transaction = clone(test.transaction);
                delete transaction.gasPrice;
                testAccount.signTransaction(transaction)
                    .then(function(tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    })
                    .catch(done);
            });

            it("signTransaction will call for type", function(done) {
                var provider = new FakeHttpProvider();
                var web3 = new Web3(provider);

                provider.injectResult(1);
                provider.injectValidation(function(payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'net_version');
                    assert.deepEqual(payload.params, []);
                });

                var ethAccounts = new Accounts(web3);

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                var transaction = clone(test.transaction);
                delete transaction.type;
                testAccount.signTransaction(transaction)
                    .then(function(tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    })
                    .catch(done);
            });

            it("signTransaction will call for nonce, gasPrice and type", function(done) {
                var provider = new FakeHttpProvider();
                var web3 = new Web3(provider);

                // provider.injectResult(1);
                /*provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'net_version');
                    assert.deepEqual(payload.params, []);
                });*/
                provider.injectResult(1);
                provider.injectValidation(function(payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'eth_gasPrice');
                    assert.deepEqual(payload.params, []);
                });
                provider.injectResult(1);
                provider.injectValidation(function(payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'eth_getTransactionCount');
                    assert.deepEqual(payload.params, [test.address, "latest"]);
                });

                var ethAccounts = new Accounts(web3);

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                var transaction = clone(test.transaction);
                delete transaction.type;
                delete transaction.gasPrice;
                delete transaction.nonce;
                testAccount.signTransaction(transaction)
                    .then(function(tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    })
                    .catch(done);
            });

            it("recoverTransaction, must recover signature", function(done) {
                var ethAccounts = new Accounts();

                var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                assert.equal(testAccount.address, test.address);

                testAccount.signTransaction(test.transaction).then(function(tx) {
                        assert.equal(ethAccounts.recoverTransaction(tx.rawTransaction), test.address);
                        done()
                    })
                    .catch(done);
            });
        });
    });
});