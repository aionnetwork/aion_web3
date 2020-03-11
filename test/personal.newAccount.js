var testMethod = require('./helpers/test.method.js');

var method = 'newAccount';

var accounts = require('./fixtures/accounts')
var address = accounts[0].address;
var checksumAddress = accounts[0].checksumAddress;


var tests = [{
    args: ['P@ssw0rd!'],
    formattedArgs: ['P@ssw0rd!'],
    result: [address],
    formattedResult: [checksumAddress], // checksum address
    call: 'personal_newAccount'
}];

testMethod.runTests(['eth','personal'], method, tests);

