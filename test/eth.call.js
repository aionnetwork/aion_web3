var testMethod = require('./helpers/test.method.js');

var method = 'call';

var tests = [{
    args: [{
        to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
        data: '0x23455654',
        gas: 11,
        gasPrice: 11
    }],
    formattedArgs: [{
        to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
        data: '0x23455654',
        gas: '0xb',
        gasPrice: '0xb'
    }, 'latest'],
    result: '0x31981',
    formattedResult: '0x31981',
    call: 'eth_'+ method
},{
    args: [{
        to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
        data: '0x23455654',
        gas: 11,
        gasPrice: 11
    }, 11],
    formattedArgs: [{
        to: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
        data: '0x23455654',
        gas: '0xb',
        gasPrice: '0xb'
    }, '0xb'],
    result: '0x31981',
    formattedResult: '0x31981',
    call: 'eth_'+ method
}];

testMethod.runTests('eth', method, tests);

