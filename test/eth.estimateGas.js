var testMethod = require('./helpers/test.method.js');

var method = 'estimateGas';
var address = '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0';

var tests = [{
    args: [{
        to: address,
        data: '0x23455654',
        gas: 11,
        gasPrice: 11
    }],
    formattedArgs: [{
        to: address,
        data: '0x23455654',
        gas: '0xb',
        gasPrice: '0xb'
    }],
    result: '0x31981',
    formattedResult: 203137,
    call: 'eth_'+ method
}];

testMethod.runTests('eth', method, tests);

