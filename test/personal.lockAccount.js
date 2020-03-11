var testMethod = require('./helpers/test.method.js');

var method = 'lockAccount';


var tests = [{
    args: ['0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0'], // checksum address
    formattedArgs: ['0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0'],
    result: true,
    formattedResult: true,
    call: 'personal_'+ method
},{
    args: ['0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0'],
    formattedArgs: ['0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0'],
    result: true,
    formattedResult: true,
    call: 'personal_'+ method
}];

testMethod.runTests(['eth','personal'], method, tests);
