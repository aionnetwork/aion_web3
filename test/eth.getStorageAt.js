var testMethod = require('./helpers/test.method.js');
var Eth = require('../packages/web3-eth');

var eth = new Eth();

var method = 'getStorageAt';

var accounts = require('./fixtures/accounts')
var address = accounts[0].address;
var checksumAddress = accounts[0].checksumAddress;

var tests = [{
    args: [address, 2], // checksum address
    formattedArgs: [address, '0x2', eth.defaultBlock],
    result: '0x47d33b2',
    formattedResult: '0x47d33b2',
    call: 'eth_'+ method
},{
    args: [address, 2, 0],
    formattedArgs: [address, '0x2', '0x0'],
    result: '0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855',
    formattedResult: '0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855',
    call: 'eth_'+ method
},{
    args: [address, 0xb, 0x0],
    formattedArgs: [address, '0xb', '0x0'],
    result: '0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855',
    formattedResult: '0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855',
    call: 'eth_'+ method
}, {
    args: [address, 0xb, 'latest'],
    formattedArgs: [address, '0xb', 'latest'],
    result: '0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855',
    formattedResult: '0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855',
    call: 'eth_'+ method
}];

testMethod.runTests('eth', method, tests);

