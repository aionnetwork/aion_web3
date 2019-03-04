var chai = require('chai');
var assert = chai.assert;
var formatters = require('../packages/web3-core-helpers/src/formatters.js');
var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Eth = require('../packages/web3-eth');
var Method = require('../packages/web3-core-method');

var address = '0x1234567890123456789012345678901234567891';


describe('lib/web3/method', function () {
    describe('buildCall', function () {
        it('should return a promise and resolve it', function (done) {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter.bind({defaultBlock: 'latest'})]
            });
            method.setRequestManager(eth._requestManager);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    data: '0xa123456'
                }, "latest"]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456'
            }).then(function (result) {

                assert.deepEqual(result, '0x1234567453543456321456321');

                done();
            });

        });
        it('should return a promise and fail it', function (done) {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter.bind({defaultBlock: 'latest'})]
            });
            method.setRequestManager(eth._requestManager);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    data: '0xa123456'
                },"latest"]);
            });
            provider.injectError({
                message: 'Wrong!',
                code: 1234
            });


            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456'
            })
            .catch(function (error) {
                assert.deepEqual(error, {
                    message: 'Wrong!',
                    code: 1234
                });

                done();
            });

        });

        it('should return an error, if the outputFormatter returns an error', function (done) {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter.bind({defaultBlock: 'latest'})],
                outputFormatter: function (result) {
                    return new Error('Error!');
                }
            });
            method.setRequestManager(eth._requestManager);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    data: '0xa123456'
                }, "latest"]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456'
            }, function (err, result) {

                assert.isTrue(err instanceof Error);
                assert.isUndefined(result);

                done();
            });

        });

        it('should return an error, if the outputFormatter throws', function (done) {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'call',
                call: 'eth_call',
                params: 2,
                inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter.bind({defaultBlock: 'latest'})],
                outputFormatter: function (result) {
                    throw new Error('Error!');
                }
            });
            method.setRequestManager(eth._requestManager);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_call');
                assert.deepEqual(payload.params, [{
                    from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    data: '0xa123456'
                }, "latest"]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456'
            }, function (err, result) {

                assert.isTrue(err instanceof Error);
                assert.isUndefined(result);

                done();
            });

        });

        it('should fill in gasPrice if not given', function (done) {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_gasPrice');
                assert.deepEqual(payload.params, []);
            });
            provider.injectResult('0xffffdddd'); // gas price

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    data: '0xa123456',
                    gasPrice: '0xffffdddd'
                }]);

                done();

            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456'
            });

        });

        var succeedOnReceipt = function () {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    value: '0xa',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fake newBlock
            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x1234567',
                    result: {
                        blockNumber: '0x10'
                    }
                }
            });

            // receipt
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            provider.injectResult({
                contractAddress: address,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                blockNumber: '0xa',
                blockHash: '0xafff',
                gasUsed: '0x0'
            });

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_unsubscribe');
                assert.deepEqual(payload.params, ['0x1234567']);
            });
            provider.injectResult(true); // unsubscribe result

            return send;
        };

        xit('should use promise "then" when subscribing and checking for receipt if "sendTransaction"', function (done) {

            var send = succeedOnReceipt();

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                value: '0xa',
                gasPrice: '23435234234'
            }).then(function (result) {


                assert.deepEqual(result, {
                    contractAddress: address,
                    cumulativeGasUsed: 10,
                    transactionIndex: 3,
                    blockNumber: 10,
                    blockHash: '0xafff',
                    gasUsed: 0
                });

                done();
            });

        });

        xit('should use on("receipt", ...) when subscribing and checking for receipt if "sendTransaction"', function (done) {

            var send = succeedOnReceipt();

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                value: '0xa',
                gasPrice: '23435234234'
            }).on('receipt', function (result) {


                assert.deepEqual(result, {
                    contractAddress: address,
                    cumulativeGasUsed: 10,
                    transactionIndex: 3,
                    blockNumber: 10,
                    blockHash: '0xafff',
                    gasUsed: 0
                });

                done();
            });

        });


        var succeedwhenDeploying = function () {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager); // second parameter accounts

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    data: '0xa123456',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fake newBlock
            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x1234567',
                    result: {
                        blockNumber: '0x10'
                    }
                }
            });

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            // receipt
            provider.injectResult({
                contractAddress: address,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                blockNumber: '0xa',
                blockHash: '0xafff',
                gasUsed: '0x0'
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getCode');
                assert.deepEqual(payload.params, [address, 'latest']);
            });
            // code result
            provider.injectResult('0x321');

            return send;
        };

        xit('should use promise "then" when subscribing and checking for receipt and code if "sendTransaction" deploying contract', function (done) {

            var send = succeedwhenDeploying();

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).then(function (result) {

                assert.deepEqual(result, {
                    contractAddress: address,
                    cumulativeGasUsed: 10,
                    transactionIndex: 3,
                    blockNumber: 10,
                    blockHash: '0xafff',
                    gasUsed: 0
                });

                done();
            })
            .catch(done);

        });

        xit('should use on("receipt", ...) when subscribing and checking  for receipt and code if "sendTransaction" deploying contract', function (done) {

            var send = succeedwhenDeploying();

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).on('receipt', function (result) {

                assert.deepEqual(result, {
                    contractAddress: address,
                    cumulativeGasUsed: 10,
                    transactionIndex: 3,
                    blockNumber: 10,
                    blockHash: '0xafff',
                    gasUsed: 0
                });

                done();
            });

        });

        var failOnCodeEmpty = function () {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    data: '0xa123456',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fake newBlock
            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x1234567',
                    result: {
                        blockNumber: '0x10'
                    }
                }
            });

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            // receipt
            provider.injectResult({
                contractAddress: address,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                blockNumber: '0xa',
                blockHash: '0xafff',
                gasUsed: '0x0'
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getCode');
                assert.deepEqual(payload.params, [address, 'latest']);
            });
            // code result
            provider.injectResult('0x');

            return send;
        };

        xit('should fail on promise when subscribing and check for receipt and code if "sendTransaction" and deploying contract: error if code is empty', function (done) {

            var send = failOnCodeEmpty();

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).catch(function (error) {
                assert.instanceOf(error, Error);
                done();
            });

        });

        xit('should fail with on("error", ...) when subscribing and check for receipt and code if "sendTransaction" and deploying contract: error if code is empty', function (done) {

            var send = failOnCodeEmpty();

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).on('error', function (error) {
                assert.instanceOf(error, Error);
                done();
            });

        });

        var failOnMissingAddress = function () {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    data: '0xa123456',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fake newBlock
            provider.injectNotification({
                method: 'eth_subscription',
                params: {
                    subscription: '0x1234567',
                    result: {
                        blockNumber: '0x10'
                    }
                }
            });

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });
            // receipt
            provider.injectResult({
                contractAddress: null,
                cumulativeGasUsed: '0xa',
                transactionIndex: '0x3',
                blockNumber: '0xa',
                blockHash: '0xafff',
                gasUsed: '0x0'
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_unsubscribe');
                assert.deepEqual(payload.params, ['0x1234567']);
            });
            // code result
            provider.injectResult(true);

            return send;
        };

        it('should fail on promise when subscribing and check for receipt and code if "sendTransaction" and deploying contract: error if receipt has no contract address', function (done) {
            var send = failOnMissingAddress();

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).catch(function (error) {
                assert.instanceOf(error, Error);
                done();
            });

        });
        it('should fail with on("error", ...) when subscribing and check for receipt and code if "sendTransaction" and deploying contract: error if receipt has no contract address', function (done) {
            var send = failOnMissingAddress();

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).on('error', function (error) {
                assert.instanceOf(error, Error);
            }).catch(function (error) {
                // also run catch!
                assert.instanceOf(error, Error);
                done();
            });

        });

        var failOnTimeout = function () {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    data: '0xa123456',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fire 50 fake newBlocks
            for (i = 0; i < 51; i++) {
                setTimeout(function () {
                    provider.injectNotification({
                        method: 'eth_subscription',
                        params: {
                            subscription: '0x1234567',
                            result: {
                                blockNumber: '0x10'
                            }
                        }
                    });
                },i);

                // receipt
                provider.injectResult(null);
            }

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });

            return send;

        };

        it('should fail with promise when subscribing and check for receipt and code if "sendTransaction" and deploying contract: if not receipt after 50 blocks', function (done) {
            var send = failOnTimeout();

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).catch(function (error) {
                assert.instanceOf(error, Error);
                done();
            });
        });
        it('should fail with on("error", ...) when subscribing and check for receipt and code if "sendTransaction" and deploying contract: if not receipt after 50 blocks', function (done) {
            var send = failOnTimeout();

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                data: '0xa123456',
                gasPrice: '23435234234'
            }).on('error', function (error) {
                assert.instanceOf(error, Error);
                done();
            });

        });

        it('should give confirmation receipts with on("confirmation", ...) when subscribing "sendTransaction"', function (done) {
            var provider = new FakeHttpProvider();
            var eth = new Eth(provider);
            var method = new Method({
                name: 'sendTransaction',
                call: 'eth_sendTransaction',
                params: 1,
                inputFormatter: [formatters.inputTransactionFormatter]
            });
            method.setRequestManager(eth._requestManager, eth);

            // generate send function
            var send = method.buildCall();

            // add results
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_sendTransaction');
                assert.deepEqual(payload.params, [{
                    from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                    gasPrice: "0x574d94bba"
                }]);
            });
            provider.injectResult('0x1234567453543456321456321'); // tx hash

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
            });
            provider.injectResult(null);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_subscribe');
                assert.deepEqual(payload.params, ['newHeads']);
            });
            provider.injectResult('0x1234567'); // subscription id

            // fire 50 fake newBlocks
            for (i = 0; i < 30; i++) {

                setTimeout(function () {
                    provider.injectNotification({
                        method: 'eth_subscription',
                        params: {
                            subscription: '0x1234567',
                            result: {
                                blockNumber: '0x10'
                            }
                        }
                    });
                }, i);

                // receipt
                provider.injectResult({
                    contractAddress: null,
                    cumulativeGasUsed: '0xa',
                    transactionIndex: '0x3',
                    blockNumber: '0xa',
                    blockHash: '0xafff',
                    gasUsed: '0x0'
                });
            }

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'eth_getTransactionReceipt');
                assert.deepEqual(payload.params, ['0x1234567453543456321456321']);
            });


            var countConf = 0;

            send({
                from: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
                gasPrice: '23435234234'
            })
            .on('transactionHash', function(result){
                assert.deepEqual(result, '0x1234567453543456321456321');
            })
            .on('receipt', function(result){

                assert.deepEqual(result, {
                    contractAddress: null,
                    cumulativeGasUsed: 10,
                    transactionIndex: 3,
                    blockNumber: 10,
                    blockHash: '0xafff',
                    gasUsed: 0
                });

            })
            .on('confirmation', function (conf, receipt) {

                assert.deepEqual(receipt, {
                    contractAddress: null,
                    cumulativeGasUsed: 10,
                    transactionIndex: 3,
                    blockNumber: 10,
                    blockHash: '0xafff',
                    gasUsed: 0
                });

                assert.deepEqual(conf, countConf);

                countConf++;

                if(conf === 12) {
                    done();
                }
            });

        });
    });
});