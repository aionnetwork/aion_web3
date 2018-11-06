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
    result: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c190407e7524b15c27c24429020561c0fd1813b18b0b7dc6e0c9c751c6da7f22d440b4cd55833137722017922b9c93406e0d923da098956fe66e6f733d8461b60d',
    formattedResult: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c190407e7524b15c27c24429020561c0fd1813b18b0b7dc6e0c9c751c6da7f22d440b4cd55833137722017922b9c93406e0d923da098956fe66e6f733d8461b60d',
    call: 'eth_'+ method
},{
    useLocalWallet: function (web3) {
        web3.eth.accounts.wallet.add(privateKey);
    },
    args: ['Hello World!$*', address],
    formattedArgs: [address, '0x48656c6c6f20576f726c6421242a'],
    result: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c190407e7524b15c27c24429020561c0fd1813b18b0b7dc6e0c9c751c6da7f22d440b4cd55833137722017922b9c93406e0d923da098956fe66e6f733d8461b60d',
    formattedResult: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c190407e7524b15c27c24429020561c0fd1813b18b0b7dc6e0c9c751c6da7f22d440b4cd55833137722017922b9c93406e0d923da098956fe66e6f733d8461b60d',
    call: null
},{
    args: ['Hello Wolrd!$*', address],
    formattedArgs: [address, '0x48656c6c6f20576f6c726421242a'],
    result: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c1913368042ccf052bcdd130aeda490b1169cf4947835d16953433f67b94516797269d6c73c83f7993896d651986efe83748dbc2079b3b824611e78520bbd1490d',
    formattedResult: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c1913368042ccf052bcdd130aeda490b1169cf4947835d16953433f67b94516797269d6c73c83f7993896d651986efe83748dbc2079b3b824611e78520bbd1490d',
    call: 'eth_'+ method
},{
    useLocalWallet: function (web3) {
        web3.eth.accounts.wallet.add(privateKey);
    },
    args: ['Hello Wolrd!$*', address],
    formattedArgs: [address, '0x48656c6c6f20576f6c726421242a'],
    result: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c1913368042ccf052bcdd130aeda490b1169cf4947835d16953433f67b94516797269d6c73c83f7993896d651986efe83748dbc2079b3b824611e78520bbd1490d',
    formattedResult: '0x3ddfb8596435b9530b5e635736c801c1403578b85e582d98dd7a322ddfb1e4c1913368042ccf052bcdd130aeda490b1169cf4947835d16953433f67b94516797269d6c73c83f7993896d651986efe83748dbc2079b3b824611e78520bbd1490d',
    call: null
}];

testMethod.runTests('eth', method, tests);

