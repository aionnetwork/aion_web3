var testMethod = require('./helpers/test.method.js');
var Eth = require('../packages/web3-eth');

var eth = new Eth();

var method = 'getBalance';

var accounts = require('./fixtures/accounts')
var address = accounts[0].address;
var checksumAddress = accounts[0].checksumAddress;

var tests = [{
    args: [address, 2],
    formattedArgs: [address, '0x2'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
},{
    args: [address, '0x1'],
    formattedArgs: [address, '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: [address, 0x1],
    formattedArgs: [address, '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: [address],
    formattedArgs: [address, eth.defaultBlock],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: [address, 0x1],
    formattedArgs: [address, '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: [address, 0x1], // checksum address
    formattedArgs: [address, '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
},
    {
    args: [address, 0x1],
    formattedArgs: [address, '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: [address, 0x1],
    formattedArgs: [address, '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: [address, 0x1],
    formattedArgs: [address, '0x1'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: [address],
    formattedArgs: [address, 'latest'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}, {
    args: [address],
    formattedArgs: [address, 'latest'],
    result: '0x31981',
    formattedResult: '203137',
    call: 'eth_'+ method
}];

testMethod.runTests('eth', method, tests);

