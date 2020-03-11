var chai = require('chai');
var assert = chai.assert;
var Web3Abi = require('../packages/web3-eth-abi');

var tests = [{
    params: [[{
        type: 'string',
        name: 'myString'
    },{
        type: 'uint256',
        name: 'myNumber',
        indexed: true
    },{
        type: 'uint8',
        name: 'mySmallNumber',
        indexed: true
    }], '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000',
    ['0x000000000000000000000000000000000000000000000000000000000000f310', '0x0000000000000000000000000000000000000000000000000000000000000010']],
    result: {
        '0': 'Hello%!',
        '1': '62224',
        '2': '16',
        myString: 'Hello%!',
        myNumber: '62224',
        mySmallNumber: '16',
        "__length__": 3
    }
},{
    params: [[{
        type: 'bytes',
        name: 'HelloBytes'
    },{
        type: 'uint8',
        name: 'myNumberWork',
        indexed: true
    }], '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000',
        ['0x00000000000000000000000000000000000000000000000000000000000000f3']],
    result: {
        '0': '0x48656c6c6f2521',
        '1': '243',
        HelloBytes: '0x48656c6c6f2521',
        myNumberWork: '243',
        "__length__": 2
    }
},{
    params: [[{
        type: 'bytes32',
        name: 'HelloBytes',
        indexed: true
    },{
        type: 'bool',
        name: 'IsTrue',
        indexed: true
    },{
        type: 'uint8',
        name: 'myNumberWork',
        indexed: true
    }], '',
        ['0xffdd0000000000000000000000000000000000000000000000000000000000f3','0x0000000000000000000000000000000000000000000000000000000000000001','0x00000000000000000000000000000000000000000000000000000000000000f3']],
    result: {
        '0': '0xffdd0000000000000000000000000000000000000000000000000000000000f3',
        '1': true,
        '2': '243',
        HelloBytes: '0xffdd0000000000000000000000000000000000000000000000000000000000f3',
        IsTrue: true,
        myNumberWork: '243',
        "__length__": 3
    }
},{
    params: [[{
        type: 'string',
        name: 'MyString',
        indexed: true
    },{
        type: 'bool',
        name: 'IsTrue',
        indexed: true
    },{
        type: 'uint8',
        name: 'myNumberWork',
        indexed: true
    }], '',
        ['0xffdd000000000000000000000000000000000000000000000000000000000003','0x0000000000000000000000000000000000000000000000000000000000000000','0x000000000000000000000000000000000000000000000000000000000000fd44']],
    result: {
        '0': '0xffdd000000000000000000000000000000000000000000000000000000000003',
        '1': false,
        '2': '68',
        MyString: '0xffdd000000000000000000000000000000000000000000000000000000000003',
        IsTrue: false,
        myNumberWork: '68',
        "__length__": 3
    }
},{
    params: [[{
        indexed: true, name: "from", type: "address"
    },
        {
            indexed: true, name: "to", type: "address"
        },
        {
            indexed: false, name: "amount", type: "uint256"
        },
        {
            indexed: false, name: "narrative", type: "string"
        }], '0x0000000000000000000000000000000000000000000000000000000000002710000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000067465737420780000000000000000000000000000000000000000000000000000',
        ['0x000000000000000000000000ae653250b4220835050b75d3bc91433246903a95', '0x00000000000000000000000094011c67bc1e6448ed4b8682047358ca6cd09470']],
    result: {
        '0': '0xae653250B4220835050B75D3bC91433246903A95',
        '1': '0x94011c67BC1E6448ed4b8682047358ca6cD09470',
        '2': '10000',
        '3': 'test x',
        from: '0xae653250B4220835050B75D3bC91433246903A95',
        to: '0x94011c67BC1E6448ed4b8682047358ca6cD09470',
        amount: '10000',
        narrative: 'test x',
        __length__: 4
    }
},{
    params: [[{
        indexed: true, name: "from", type: "address"
    },
        {
            indexed: true, name: "to", type: "address"
        },
        {
            indexed: false, name: "amount", type: "uint256"
        },
        {
            indexed: false, name: "narrative", type: "string"
        }], '0x00000000000000000000000000000000000000000000000000000000000027100000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000',
        ['0x000000000000000000000000ae653250b4220835050b75d3bc91433246903a95', '0x00000000000000000000000094011c67bc1e6448ed4b8682047358ca6cd09470']],
    result: {
        '0': '0xae653250B4220835050B75D3bC91433246903A95',
        '1': '0x94011c67BC1E6448ed4b8682047358ca6cD09470',
        '2': '10000',
        '3': 'Hello!%!',
        from: '0xae653250B4220835050B75D3bC91433246903A95',
        to: '0x94011c67BC1E6448ed4b8682047358ca6cD09470',
        amount: '10000',
        narrative: 'Hello!%!',
        __length__: 4
    }
}];

xdescribe('decodeLog', function () {
    tests.forEach(function (test) {
        it('should convert correctly', function () {
            assert.deepEqual(Web3Abi.decodeLog.apply(Web3Abi, test.params), test.result);
        });
    });
});
