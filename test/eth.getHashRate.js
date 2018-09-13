var testMethod = require('./helpers/test.method.js');

var method = 'getHashrate';


var tests = [{
    result: '3.14159',
    formattedResult: "3.14159",
    call: 'eth_hashrate'
}];


testMethod.runTests('eth', method, tests);

