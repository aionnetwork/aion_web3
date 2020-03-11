var testMethod = require('./helpers/test.method.js');

var method = 'getBlockTransactionCount';


var tests = [{
    args: ['0x4e65fda2159562a496f9f3522f8922f89122a3088497a122a3088497a'],
    formattedArgs: ['0x4e65fda2159562a496f9f3522f8922f89122a3088497a122a3088497a'],
    result: '0xb',
    formattedResult: 11,
    call: 'eth_getBlockTransactionCountByHash'
},{
    args: ['0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0'],
    formattedArgs: ['0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0'],
    result: '0xb',
    formattedResult: 11,
    call: 'eth_getBlockTransactionCountByHash'
},{
    args: [436],
    formattedArgs: ['0x1b4'],
    result: '0xb',
    formattedResult: 11,
    call: 'eth_getBlockTransactionCountByNumber'
},{
    args: ['pending'],
    formattedArgs: ['pending'],
    result: '0xb',
    formattedResult: 11,
    call: 'eth_getBlockTransactionCountByNumber'
}];

testMethod.runTests('eth', method, tests);

