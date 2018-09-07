var testMethod = require('./helpers/test.method.js');

var method = 'unlockAccount';


var tests = [{
    args: ['0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0', 'P@ssw0rd!'], // checksum address
    formattedArgs: ['0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0', 'P@ssw0rd!', null],
    result: true,
    formattedResult: true,
    call: 'personal_'+ method
},{
    args: ['0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0', 'P@ssw0rd!', 10],
    formattedArgs: ['0xa0202797a7aff86fec1a5d8b7cacea276de5bcfc2e8b14878c9ba48d7d5330a0', 'P@ssw0rd!', 10],
    result: true,
    formattedResult: true,
    call: 'personal_'+ method
}];

testMethod.runTests(['eth','personal'], method, tests);
