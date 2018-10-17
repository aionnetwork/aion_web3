var testMethod = require('./helpers/test.method.js');
var Eth = require('../packages/web3-eth');

var eth = new Eth();
var method = 'compileSolidity';

var source = "" + 
   "contract test {\n" +
   "   function multiply(uint a) returns(uint d) {\n" +
   "       return a * 7;\n" +
   "   }\n" +
   "}\n";

var tests = [{
	args: [source],
	formattedArgs: [source],
    result: 123,
    formattedResult: 123,
    call: 'eth_compileSolidity' 
}];


testMethod.runTests('eth', method, tests);
