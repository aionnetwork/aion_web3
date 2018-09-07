var FakeIpcProvider = require('./helpers/FakeIpcProvider');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');

// // set the etheeumProvider
// var provider1 = new FakeHttpProvider();
// var provider2 = new FakeIpcProvider();
// provider1.bzz = 'http://givenProvider:8500';
// provider2.bzz = 'http://swarm-gateways.net';
//
// if (typeof window !== 'undefined') {
//     global.ethereumProvider = provider1;
// }
// if (typeof window !== 'undefined') {
//     window.ethereumProvider = provider1;
// }


var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var Eth = require('../packages/web3-eth');
var Personal = require('../packages/web3-eth-personal');
var Accounts = require('../packages/web3-eth-accounts');
var Contract = require('../packages/web3-eth-contract');
var Net = require('../packages/web3-net');


var tests = [{
    Lib: Web3
},{
    Lib: Eth
},{
    Lib: Personal
},{
    Lib: Net
},{
    Lib: Accounts
}];



describe('lib/web3/setProvider', function () {
    it('Web3 submodules should set the provider using constructor', function () {

        var provider1 = new FakeHttpProvider();
        var provider2 = new FakeIpcProvider();
        provider1.bzz = 'http://localhost:8500';
        provider2.bzz = 'http://swarm-gateways.net';

        var provider3 = new FakeHttpProvider();
        provider3.bzz = 'http://localhost2:8500';

        var lib = new Web3(provider1);
        var lib2 = new Web3(provider3);

        assert.equal(lib.eth.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.net.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.personal.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.Contract.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.accounts.currentProvider.constructor.name, provider1.constructor.name);

        assert.equal(lib.eth._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.net._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.personal._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.Contract._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.accounts._requestManager.provider.constructor.name, provider1.constructor.name);

        assert.equal(lib2.eth.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.net.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.personal.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.Contract.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.accounts.currentProvider.constructor.name, provider3.constructor.name);

        assert.equal(lib2.eth._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.net._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.personal._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.Contract._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.accounts._requestManager.provider.constructor.name, provider3.constructor.name);


        lib.setProvider(provider2);

        assert.equal(lib.eth.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.net.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.personal.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.Contract.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.accounts.currentProvider.constructor.name, provider2.constructor.name);

        assert.equal(lib.eth._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.net._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.personal._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.Contract._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.accounts._requestManager.provider.constructor.name, provider2.constructor.name);

        assert.equal(lib2.eth.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.net.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.personal.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.Contract.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.accounts.currentProvider.constructor.name, provider3.constructor.name);

        assert.equal(lib2.eth._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.net._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.personal._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.Contract._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.eth.accounts._requestManager.provider.constructor.name, provider3.constructor.name);


    });


    tests.forEach(function (test) {
        it(test.Lib.name +' should set the provider using constructor', function () {

            var provider1 = new FakeHttpProvider();
            var lib;


            if(test.swarm) {

                lib = new test.Lib('http://localhost:8500');

                assert.equal(lib.currentProvider, 'http://localhost:8500');

            } else {

                lib = new test.Lib(provider1);

                assert.equal(lib.currentProvider.constructor.name, provider1.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider1.constructor.name);
            }

        });
        it(test.Lib.name +' should set the provider using setProvider, after empty init', function () {

            var provider1 = new FakeHttpProvider();
            var lib = new test.Lib();



            if(test.swarm) {

                assert.isNull(lib.currentProvider);

                lib.setProvider('http://localhost:8500');

                assert.equal(lib.currentProvider, 'http://localhost:8500');

            } else {

                assert.isNull(lib.currentProvider);
                assert.isNull(lib._requestManager.provider);

                lib.setProvider(provider1);

                assert.equal(lib.currentProvider.constructor.name, provider1.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider1.constructor.name);
            }

        });
        it(test.Lib.name +' should set the provider using constructor, and change later using setProvider', function () {

            var provider1 = new FakeHttpProvider();
            var provider2 = new FakeIpcProvider();
            var swarmProvider1 = 'http://localhost:8500';
            var swarmProvider2 = 'http://swarm-gateways.net';

            var lib;


            if(test.swarm) {

                lib = new test.Lib(swarmProvider1);

                assert.equal(lib.currentProvider, swarmProvider1);

                lib.setProvider(swarmProvider2);

                assert.equal(lib.currentProvider, swarmProvider2);

                lib.setProvider(swarmProvider1);

                assert.equal(lib.currentProvider, swarmProvider1);

            } else {

                lib = new test.Lib(provider1);

                assert.equal(lib.currentProvider.constructor.name, provider1.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider1.constructor.name);

                lib.setProvider(provider2);

                assert.equal(lib.currentProvider.constructor.name, provider2.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider2.constructor.name);

                lib.setProvider(provider1);

                assert.equal(lib.currentProvider.constructor.name, provider1.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider1.constructor.name);
            }

        });
    });


});

