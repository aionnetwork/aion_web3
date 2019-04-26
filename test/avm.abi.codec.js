let chai = require('chai');
let assert = chai.assert;
let utils = require('../packages/web3-avm-abi/src/coder-utils');
let Abi = require('../packages/web3-avm-abi');

let abi = new Abi();

var tests = [{
    type: [ 'byte' ],
    value: [ 65 ],
    data: '0x0141',
}, {
    type: [ 'boolean' ], 
    value: [ true ],
    data: '0x0201',
}, {
    type: [ 'char' ],
    value: [ 'x' ],
    data: '0x030078',
}, {
    type: [ 'short' ],
    value: [ 65 ],
    data: '0x040041',
}, {
    type: [ 'int' ],
    value: [ 1 ],
    data: '0x0500000001',
}, {
    type: [ 'long' ],
    value: [ 1 ],
    data: '0x060000000000000001',
}, {
    type: [ 'float' ],
    value: [ 1.5 ],
    data: '0x073fc00000',
}, {
    type: [ 'double' ],
    value: [ 1.5 ],
    data: '0x083ff8000000000000',
}, {
    type: [ 'byte[]' ],
    value: [ [64, 65, 66] ],
    data: '0x110003404142',
}, {
    type: [ 'boolean[]' ],
    value: [ [false, true, false] ],
    data: '0x120003000100',
}, {
    type: [ 'char[]' ],
    value: [ ['c', 'a', 't'] ],
    data: '0x130003006300610074',
}, {
    type: [ 'short[]' ],
    value: [ [64, 65, 66] ],
    data: '0x140003004000410042',
}, {
    type: [ 'int[]' ],
    value: [ [1, 2, 3] ],
    data: '0x150003000000010000000200000003',
}, {
    type: [ 'long[]' ],
    value: [ [1, 2, 3] ],
    data: '0x160003000000000000000100000000000000020000000000000003',
}, {
    type: [ 'float[]' ],
    value: [ [1.2, 2.3, 3.4] ],
    data: '0x1700033f99999a401333334059999a',
}, {
    type: [ 'double[]' ],
    value: [ [1.2, 2.3, 3.4] ],
    data: '0x1800033ff33333333333334002666666666666400b333333333333',
}, {
    type: [ 'string' ],
    value: [ 'Hello World' ],
    data: '0x21000b48656c6c6f20576f726c64',
}, {
    type: [ 'address' ],
    value: [ '0xA0707404B9BE7a5F630fCed3763d28FA5C988964fDC25Aa621161657a7Bf4b89' ],
    data: '0x22a0707404b9be7a5f630fced3763d28fa5c988964fdc25aa621161657a7bf4b89',
}, {
    type: [ 'string[]' ],
    value: [ ['Cats', 'are', 'silly'] ],
    data: '0x312100032100044361747321000361726521000573696c6c79',
}, {
    type: [ 'address[]' ],
    value: [ ['0xA0707404B9BE7a5F630fCed3763d28FA5C988964fDC25Aa621161657a7Bf4b89', 
              '0xA0c6Ed9486e9137802D0acdCd9a0499241872F648B51a5AB49a534A0D440F62c', 
              '0xA04055a0FaB3d6288f26296Dfa2a4A44b934c35A21aEC63a2b6141388F301BBa'] ],
    data: '0x3122000322a0707404b9be7a5f630fced3763d28fa5c988964fdc25aa621161657a7bf4b8922a0c6ed9486e9137802d0acdcd9a0499241872f648b51a5ab49a534a0d440f62c22a04055a0fab3d6288f26296dfa2a4a44b934c35a21aec63a2b6141388f301bba',
}, {
    type: [ 'byte[][]' ],
    value: [ [[64, 65, 66], [67, 68, 69]] ],
    data: '0x31110002110003404142110003434445',
}, {
    type: [ 'boolean[][]' ],
    value: [ [[true, false, true], [false, true, false]] ],
    data: '0x31120002120003010001120003000100',
}, {
    type: [ 'char[][]' ],
    value: [ [['c', 'a', 't'], ['d', 'o', 'g']] ],
    data: '0x311300021300030063006100741300030064006f0067',
}, {
    type: [ 'short[][]' ],
    value: [ [[64, 65, 66], [67, 68, 69]] ],
    data: '0x31140002140003004000410042140003004300440045',
}, {
    type: [ 'int[][]' ],
    value: [ [[1, 2, 3], [4, 5, 6]] ],
    data: '0x31150002150003000000010000000200000003150003000000040000000500000006',
}, {
    type: [ 'long[][]' ],
    value: [ [[1, 2, 3], [4, 5, 6]] ],
    data: '0x31160002160003000000000000000100000000000000020000000000000003160003000000000000000400000000000000050000000000000006',
}, {
    type: [ 'float[][]' ],
    value: [ [[1.2, 2.3, 3.4], [4.5, 5.6, 6.7]] ],
    data: '0x311700021700033f99999a401333334059999a1700034090000040b3333340d66666',
}, {
    type: [ 'double[][]' ],
    value: [ [[1.2, 2.3, 3.4], [4.5, 5.6, 6.7]] ],
    data: '0x311800021800033ff33333333333334002666666666666400b33333333333318000340120000000000004016666666666666401acccccccccccd',
}, {
    type: [ 'string' ],
    value: [ null ],
    data: '0x3221',
}, {
    type: [ 'address' ],
    value: [ null ],
    data: '0x3222',
}, {
    type: [ 'address[]' ],
    value: [ null ],
    data: '0x3231',
}, {
    type: [ 'byte[][]' ],
    value: [ null ],
    data: '0x3231',
}, {
    type: [ 'boolean[][]' ],
    value: [ [null, [true, false, true]] ],
    data: '0x311200023212120003010001',
}, {
    type: [ 'char[][]' ],
    value: [ [['c', 'a', 't'], null] ],
    data: '0x311300021300030063006100743213',
}, {
    type: [ 'short[][]' ],
    value: [ [[], [67, 68, 69]] ],
    data: '0x31140002140000140003004300440045',
}, {
    type: [ 'int[][]' ],
    value: [ [[1, 2, 3], []] ],
    data: '0x31150002150003000000010000000200000003150000'
}]

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have floating values
        if(isFloat(this[i]) && isFloat(array[i])) {
            let float1 = Math.round(this[i] * 100) / 100;
            let float2 = Math.round(array[i] * 100) / 100;
            if(float1 === float2) return true;
            else return false;
        }

        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false}); 

describe('AVM ABI Encoder/Decoder', function () {
    tests.forEach(function (test) {

        it('Encoding Data Type ' + test.type, function() {
            let data = utils.hexlify(abi.encode(test.type, test.value));
            assert.equal(data, test.data);
        });

        it('Decoding Data ' + test.data + ' for Data Type ' + test.type, function() {
            let result = abi.decode(test.type[0], test.data);
            if(Array.isArray(result)) {
                assert.equal(result.equals(test.value[0]), true);
            } else {
                assert.equal(result, test.value[0]);
            }
        });
    });
});