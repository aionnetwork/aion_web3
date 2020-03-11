var testMethod = require('./helpers/test.method.js');
var Eth = require('../packages/web3-eth');

var eth = new Eth();
var method = 'compileSolidityZip';

var source = ['./test/helpers/contracts/Import.sol', './test/helpers/contracts/Ticker.sol', './test/helpers/contracts/Wallet.sol'];

var tests = [{
	args: [source],
	formattedArgs: ['Import.sol', 'Ticker.sol', 'Wallet.sol'],
  	result: 123,
  	formattedResult: 123,
  	call: 'eth_compileSolidityZip' 
}];

testMethod.runTests('eth', method, tests);