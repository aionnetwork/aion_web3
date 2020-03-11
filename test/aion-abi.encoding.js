var chai = require('chai');
var assert = chai.assert;
var Abi = require('../packages/aion-lib/src/abi.js');

var encodeEventSignatureTests = [{
    params: [{
        name: 'myEvent',
        type: 'event',
        inputs: [{
            type: 'uint128',
            name: 'myNumber'
        },{
            type: 'bytes32',
            name: 'myBytes'
        }]
    }],
    result: '0x2236226bdca8de2f2bc9a5be931cb54acc7d73c5a829b22dc2b7e92af174f7d4'
},{
    params: [{
        name: 'SomeEvent',
        type: 'event',
        inputs: [{
            type: 'bytes',
            name: 'somebytes'
        },{
            type: 'byte16',
            name: 'myBytes'
        }]
    }],
    result: '0xab132b6cdd50f8d4d2ea33c3f140a9b3cf40f451540c69765c4842508bb13838'
},{
    params: [{
        name: 'AnotherEvent',
        type: 'event',
        inputs: []
    }],
    result: '0x601d819e31a3cd164f83f7a7cf9cb5042ab1acff87b773c68f63d059c0af2dc0'
}];

var encodeFunctionSignatureTests = [{
	params:[{
		name: 'myFunction',
		type: 'function',
		inputs: [{
			type: 'uint128',
			name: 'myNumber'
		},{
			type: 'bytes32',
			name: 'myBytes'
		}]
	}],
	result: '0xeabf647b8f8eda8815ce2b4b17c04ffa8a90128864990c859e7a3f65282e9802'.slice(0, 6)
},{
	params:[{
		name: 'myFunction',
		type: 'function',
		inputs: [{
			type: 'uint128',
			name: 'myNumber'
		},{
			type: 'bytes32',
			name: 'myBytes'
		}]
	}],
	result: '0xeabf647b8f8eda8815ce2b4b17c04ffa8a90128864990c859e7a3f65282e9802'.slice(0, 6)
}];

var encodeParameterTest = [{
	type: 'uint128',
	param: 20,
	result: '0x00000000000000000000000000000014'
},{
	type: 'bool',
	param: true,
	result: '0x00000000000000000000000000000001'
},{
	type: 'bytes32',
	param: 'myBytes',
	result: '0x6d79427974657300000000000000000000000000000000000000000000000000'
}];

var encodeParametersTests = [{
	types: ['uint128','uint128', 'bytes32'],
	params: [20, 20, 'myBytes'],
	result: '0x00000000000000000000000000000014000000000000000000000000000000146d79427974657300000000000000000000000000000000000000000000000000'
}];

var encodeParametersTests2 = [{
	types: ['bool','uint128', 'bytes32'],
	params: [true, 20, 'myBytes'],
	result: '0x00000000000000000000000000000001000000000000000000000000000000146d79427974657300000000000000000000000000000000000000000000000000'
}];

var decodeParameterTest = {
	type: 'uint128',
	param: '0x00000000000000000000000000000014',
	result: 20
};

var decodeParameterTest2 = {	
	type: 'bytes32',
	param: '0x6d79427974657300000000000000000000000000000000000000000000000000',
	result: 'myBytes'
};

var decodeParametersTests = [{
	types: ['uint128','uint128', 'bytes32'],
	params: '0x00000000000000000000000000000014000000000000000000000000000000146d79427974657300000000000000000000000000000000000000000000000000',
	result: [20, 20, 'myBytes']
}];

describe('encodeEventSignature', function () {
    encodeEventSignatureTests.forEach(function (test) {
        it('event signature should encode correctly', function () {
            assert.equal(Abi.encodeEventSignature.apply(Abi, test.params), test.result);
        });
    });
});

describe('encodeFunctionSignature', function () {
    encodeFunctionSignatureTests.forEach(function (test) {
    	it('function signature should encode correctly', function() {
    		assert.equal(Abi.encodeFunctionSignature.apply(Abi, test.params), test.result);
    	})
    });
});

//////
describe('encodeParameter', function(){
	encodeParameterTest.forEach(function (test) {
		it('parameter should encode correctly', function() {
			assert.equal(Abi.encodeParameter(test.type, test.param), test.result);
		})
	})
});

describe('encodeParameters', function(){
	encodeParametersTests.forEach(function (test) { 
		it('parameters should encode correctly', function() {
			assert.equal(Abi.encodeParameters(test.types, test.params), test.result);
		})
	})

	encodeParametersTests2.forEach(function (test) { 
		it('parameters should encode correctly', function() {
			assert.equal(Abi.encodeParameters(test.types, test.params), test.result);
		})
	})
});


describe('decodeParameter', function(){
	it('byte32 should decode correctly', function() {
		var s = Abi.decodeParameter(decodeParameterTest.type, decodeParameterTest.param);
		assert.equal(Abi.decodeParameter(decodeParameterTest.type, decodeParameterTest.param), decodeParameterTest.result);
	});

	// it('uint128 should decode correctly', function() {
	// 	var s = Abi.decodeParameter(decodeParameterTest2.type, decodeParameterTest2.param);
	// 	console.log('========', s.toString());
	// 	assert.equal(s.toString(), decodeParameterTest2.result);
	// });
});
