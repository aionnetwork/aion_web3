var testMethod = require('./helpers/test.method.js');
var Eth = require('../packages/web3-eth');

var eth = new Eth();

var method = 'sign';

var accounts = require('./fixtures/accounts')
var address = accounts[0].address;
var checksumAddress = accounts[0].checksumAddress;
var privateKey = accounts[0].privateKey;

var tests = [{
    args: ['Hello World!$*', address],
    formattedArgs: [address, '0x48656c6c6f20576f726c6421242a'],
    result: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c13fbaa048dcdfe1715c042f702ac6abe8ae9d7c0e77a1072cf2d717c03f83687066e6d25e99c7ffc33f9c1f54ae2534a16d2a612426e1dee941f435b2e1456c0f',
    formattedResult: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c13fbaa048dcdfe1715c042f702ac6abe8ae9d7c0e77a1072cf2d717c03f83687066e6d25e99c7ffc33f9c1f54ae2534a16d2a612426e1dee941f435b2e1456c0f',
    call: 'eth_'+ method
},{
    useLocalWallet: function (web3) {
        web3.eth.accounts.wallet.add(privateKey);
    },
    args: ['Hello World!$*', address],
    formattedArgs: [address, '0x48656c6c6f20576f726c6421242a'],
    result: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c13fbaa048dcdfe1715c042f702ac6abe8ae9d7c0e77a1072cf2d717c03f83687066e6d25e99c7ffc33f9c1f54ae2534a16d2a612426e1dee941f435b2e1456c0f',
    formattedResult: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c13fbaa048dcdfe1715c042f702ac6abe8ae9d7c0e77a1072cf2d717c03f83687066e6d25e99c7ffc33f9c1f54ae2534a16d2a612426e1dee941f435b2e1456c0f',
    call: null
},{
    args: ['Hello Wolrd!$*', address],
    formattedArgs: [address, '0x48656c6c6f20576f6c726421242a'],
    result: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c196e79ece96f17429495927def01eec3734673836762da7f46df3f78266051e2e052d9a4646eaa22d900d46a73c60bb824f452d64209f1de828f51544dce3830e',
    formattedResult: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c196e79ece96f17429495927def01eec3734673836762da7f46df3f78266051e2e052d9a4646eaa22d900d46a73c60bb824f452d64209f1de828f51544dce3830e',
    call: 'eth_'+ method
},{
    useLocalWallet: function (web3) {
        web3.eth.accounts.wallet.add(privateKey);
    },
    args: ['Hello Wolrd!$*', address],
    formattedArgs: [address, '0x48656c6c6f20576f6c726421242a'],
    result: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c196e79ece96f17429495927def01eec3734673836762da7f46df3f78266051e2e052d9a4646eaa22d900d46a73c60bb824f452d64209f1de828f51544dce3830e',
    formattedResult: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c196e79ece96f17429495927def01eec3734673836762da7f46df3f78266051e2e052d9a4646eaa22d900d46a73c60bb824f452d64209f1de828f51544dce3830e',
    call: null
}];

testMethod.runTests('eth', method, tests);

