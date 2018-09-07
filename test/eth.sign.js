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
    result: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c11108042d43cde677ebf2cfe02a3dcf895157f3714a05f69ae7faeda8c469e012ce6b158379e14024804f5e1aa565a544dd946e3bd1286777ac9931db8918cf03',
    formattedResult: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c11108042d43cde677ebf2cfe02a3dcf895157f3714a05f69ae7faeda8c469e012ce6b158379e14024804f5e1aa565a544dd946e3bd1286777ac9931db8918cf03',
    call: 'eth_'+ method
},{
    useLocalWallet: function (web3) {
        web3.eth.accounts.wallet.add(privateKey);
    },
    args: ['Hello World!$*', address],
    formattedArgs: [address, '0x48656c6c6f20576f726c6421242a'],
    result: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c11108042d43cde677ebf2cfe02a3dcf895157f3714a05f69ae7faeda8c469e012ce6b158379e14024804f5e1aa565a544dd946e3bd1286777ac9931db8918cf03',
    formattedResult: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c11108042d43cde677ebf2cfe02a3dcf895157f3714a05f69ae7faeda8c469e012ce6b158379e14024804f5e1aa565a544dd946e3bd1286777ac9931db8918cf03',
    call: null
},{
    args: ['Hello Wolrd!$*', address],
    formattedArgs: [address, '0x48656c6c6f20576f6c726421242a'],
    result: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c13624fa4c833937ffd8582499ad142b15e995e3f75f275cf1c15362d23f4df75158453be47cbd82dd7c5f86019bad88317d39896f8a629c89536f7fb4fd954f0f',
    formattedResult: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c13624fa4c833937ffd8582499ad142b15e995e3f75f275cf1c15362d23f4df75158453be47cbd82dd7c5f86019bad88317d39896f8a629c89536f7fb4fd954f0f',
    call: 'eth_'+ method
},{
    useLocalWallet: function (web3) {
        web3.eth.accounts.wallet.add(privateKey);
    },
    args: ['Hello Wolrd!$*', address],
    formattedArgs: [address, '0x48656c6c6f20576f6c726421242a'],
    result: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c13624fa4c833937ffd8582499ad142b15e995e3f75f275cf1c15362d23f4df75158453be47cbd82dd7c5f86019bad88317d39896f8a629c89536f7fb4fd954f0f',
    formattedResult: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c13624fa4c833937ffd8582499ad142b15e995e3f75f275cf1c15362d23f4df75158453be47cbd82dd7c5f86019bad88317d39896f8a629c89536f7fb4fd954f0f',
    call: null
}];

testMethod.runTests('eth', method, tests);

