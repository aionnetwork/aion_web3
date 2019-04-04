var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

var accounts = require('./fixtures/accounts')

var tests = [
    { value: function () {}, is: false},
    { value: new Function(), is: false},
    { value: 'function', is: false},
    { value: {}, is: false},
    { value: '0xc6d9d2cd449a754c494264e1809c50e34d64562b', is: false },
    { value: 'c6d9d2cd449a754c494264e1809c50e34d64562b', is: false },
    { value: '0xE247A45c287191d435A8a5D72A7C8dc030451E9F', is: false },
    { value: '0xE247a45c287191d435A8a5D72A7C8dc030451E9F', is: false },
    { value: '0xe247a45c287191d435a8a5d72a7c8dc030451e9f', is: false },
    { value: '0xE247A45C287191D435A8A5D72A7C8DC030451E9F', is: false },
    { value: '0XE247A45C287191D435A8A5D72A7C8DC030451E9F', is: false },
    { value: '0xP06f640ced8bd31eb9e191887adde74888e9ca31fd8545dae3ae896773ccbc4f', is: false },
    { value: '0x006f640ced8bd31eb9e191887adde74888e9ca31fd8545dae3ae896773ccbc4f', is: true },
    { value: '0xc00dcc9fe51c73767fad07cd4da990a8aa7487f40ba5718f711b4fdc09ae5b6e', is: true},
    { value: 'c00dcc9fe51c73767fad07cd4da990a8aa7487f40ba5718f711b4fdc09ae5b6e', is: true}
];

accounts.forEach(function(item) {
    tests.push({
        value: item.address,
        is: true
    });
});

describe('lib/utils/utils', function () {
    describe('isAddress', function () {
        tests.forEach(function (test) {
            it('shoud test if value ' + test.value + ' is address: ' + test.is, function () {
                assert.equal(utils.isAddress(test.value), test.is);
            });
        });
    });
});
