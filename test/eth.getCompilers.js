var testMethod = require('./helpers/test.method.js');

var method = 'getCompilers';


var tests = [{
    result: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
    formattedResult: '0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0',
    call: 'eth_getCompilers'
}];

testMethod.runTests('eth', method, tests);
