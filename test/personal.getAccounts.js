var testMethod = require('./helpers/test.method.js');

var method = 'getAccounts';

var accounts = require('./fixtures/accounts')
var address = accounts[0].address;
var checksumAddress = accounts[0].checksumAddress;


var tests = [{
    result: [address],
    formattedResult: [checksumAddress], // checksum address
    call: 'personal_listAccounts'
}];

testMethod.runTests(['eth','personal'], method, tests);
