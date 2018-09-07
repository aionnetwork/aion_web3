var testMethod = require('./helpers/test.method.js');

var method = 'getTransactionFromBlock';

var accounts = require('./fixtures/accounts')
var address = accounts[0].address;
var checksumAddress = accounts[0].checksumAddress;

var txResult = {
    "status": "mined",
    "hash":"0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
    "nonce":"0xb",
    "blockHash": "0x6fd9e2a26ab",
    "blockNumber": "0x15df",
    "transactionIndex":  "0x1",
    "from":address,
    "to":address,
    "value":"0x7f110",
    "gas": "0x7f110",
    "gasPrice":"0x09184e72a000",
    "input":"0x603880600c6000396000f30060"
};
var formattedTxResult = {
    "status": "mined",
    "hash":"0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
    "nonce":11,
    "blockHash": "0x6fd9e2a26ab",
    "blockNumber": 5599,
    "transactionIndex":  1,
    "from":checksumAddress, // checksum address
    "to":checksumAddress, // checksum address
    "value": '520464',
    "gas": 520464,
    "gasPrice": '10000000000000',
    "input":"0x603880600c6000396000f30060"
};

var tests = [{
    args: ['0x2dbab4c0612bf9caf4c195085547dc0612bf9caf4c1950855', 2],
    formattedArgs: ['0x2dbab4c0612bf9caf4c195085547dc0612bf9caf4c1950855', '0x2'],
    result: txResult,
    formattedResult: formattedTxResult,
    call: 'eth_getTransactionByBlockHashAndIndex'
},{
    args: [436, 11],
    formattedArgs: ['0x1b4', '0xb'],
    result: txResult,
    formattedResult: formattedTxResult,
    call: 'eth_getTransactionByBlockNumberAndIndex'
}];

testMethod.runTests('eth', method, tests);

