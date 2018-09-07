var testMethod = require('./helpers/test.method.js');

var method = 'getAccounts';
var call = 'eth_accounts';

var accounts = require('./fixtures/accounts')
var address = accounts[0].address;
var checksumAddress = accounts[0].checksumAddress;

var tests = [{
    result: [address, address],
    formattedResult: [checksumAddress, checksumAddress],
    call: call
}];


testMethod.runTests('eth', method, tests);

