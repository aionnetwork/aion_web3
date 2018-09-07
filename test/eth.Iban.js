var chai = require('chai');
var assert = chai.assert;
var Eth = require('../packages/web3-eth');
var eth = new Eth();

var tests = [
    {
        direct: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS',
        address: '0x00000000000000000000000000C5496Aee77c1ba1F0854206A26dDa82a81D6d8' // checksum address
    },
    {
        direct: 'XE1222Q908LN1QBBU6XUQSO1OHWJIOS46OO',
        address: '0x00000000000000000000000011c5496AeE77C1Ba1F0854206A26dDA82a81D6D8'
    },
    {
        direct: 'XE75JRZCTTLBSYEQBGAS7GID8DKR7QY0QA3',
        address: '0x000000000000000000000000a94f5374FCE5EDbC8E2A8697C15331677E6Ebf0b' // checksum address
    },
    {
        error: true,
        direct: 'XE81ETHXREGGAVOFYORK',
        address: '0xHELLO' // checksum address
    }
];

describe('eth', function () {
    describe('Iban', function () {
        tests.forEach(function (test) {
            it('toAddress() should transform iban to address: ' +  test.address, function () {
                if(test.error) {
                    assert.throws(eth.Iban.toAddress.bind(eth.Iban, test.direct));
                } else {
                    assert.deepEqual(eth.Iban.toAddress(test.direct), test.address);
                }
            });
            it('toIban() should transform address to iban: ' +  test.address, function () {
                if(test.error) {
                    assert.throws(eth.Iban.toIban.bind(eth, test.address));
                } else {
                    assert.deepEqual(eth.Iban.toIban(test.address), test.direct);
                }
            });
        });
    });
});

