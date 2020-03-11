var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var FakeHttpProvider = require('./helpers/FakeIpcProvider');

var web3 = new Web3();

// use sendTransaction as dummy
var method = 'call';

var accounts = require('./fixtures/accounts')
var address = accounts[0].address;
var checksumAddress = accounts[0].checksumAddress;

var tests = [{
    input: {
        'from': address,
        'to': address
    },
    formattedInput: [{
        'from': address,
        'to': address
    }, 'latest'],
    result: '0xb',
    formattedResult: '0xb',
    call: 'eth_'+ method
}];

describe('async', function () {
    tests.forEach(function (test, index) {
        it('test callback: ' + index, function (done) {

            // given
            var provider = new FakeHttpProvider();
            web3.setProvider(provider);
            provider.injectResult(test.result);
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, test.formattedInput);
            });

            // when
            web3.eth[method](test.input, function(error, result){

                // then
                assert.isNull(error);
                assert.strictEqual(test.formattedResult, result);

                done();
            });

        });

        it('test promise: ' + index, function (done) {

            // given
            var provider = new FakeHttpProvider();
            web3.setProvider(provider);
            provider.injectResult(test.result);
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, test.formattedInput);
            });

            // when
            web3.eth[method](test.input)
            .then(function(result){

                // then
                assert.strictEqual(test.formattedResult, result);

                done();
            });

        });

        it('error test callback: ' + index, function (done) {

            // given
            var provider = new FakeHttpProvider();
            web3.setProvider(provider);
            provider.injectError({
                    message: test.result,
                    code: -32603
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, test.formattedInput);
            });

            // when
            web3.eth[method](test.input, function(error, result){

                // then
                assert.isUndefined(result);
                assert.strictEqual(test.formattedResult, error.message);

                done();
            }).catch(function () {

            });

        });

        it('error test promise: ' + index, function (done) {

            // given
            var provider = new FakeHttpProvider();
            web3.setProvider(provider);
            provider.injectError({
                message: test.result,
                code: -32603
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, test.formattedInput);
            });

            // when
            web3.eth[method](test.input)
            .catch(function(error){

                // then
                assert.strictEqual(test.formattedResult, error.message);

                done();
            });

        });
    });
});

