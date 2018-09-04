var Accounts = require("./../packages/web3-eth-accounts");
var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();

var tests = [
    {
        address: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
        privateKey: '0x6df86a106f599c78ab9b2ad593b2983038edf706a52b24bfa895b49066a7f2a03ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c1'
    },
    {
        address: '0xa09d19c066f341220d914414c42e5e796e7e4daf83a9abf4581b1670403bbd15',
        privateKey: '0x29379825937c50f0e13453673c5083bcf9853ef69ebb129f2db106db4966cf5efe6820305cf2cd29719d7c924fc495542100d5f499d4b758205bee05dd33896b'
    },
    {
        address: '0xa06f640ced8bd31eb9e191887adde74888e9ca31fd8545dae3ae896773ccbc4f',
        privateKey: '0xe6edbf765e724684cacc2c7cc0c8bbac98c1c672b8701108c6e2c2cf25523dec085aa353d4ebd256c4601838714cac4dfd96feee86bc03777247a085b7220ee1'
    }
]

describe("eth", function () {
    describe("accounts", function () {
        var ethAccounts = new Accounts();

        tests.forEach(function (test) {
            it("create eth.account, and compare to aion java test data", function() {

                // create account
                var account = ethAccounts.privateKeyToAccount(test.privateKey);

                // compare addresses
                assert.equal(account.address, test.address);
            });

        });
    });
});
