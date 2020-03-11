var chai = require('chai');
var BigNumber = require('./../node_modules/bignumber.js');
let BN = require('bn.js');
var assert = chai.assert;
var formats = require('../packages/aion-lib/src/formats.js');

var inputVal = '123vnfsgj364hbdfh';
var inputVal2 = '00000000000000000000000000000000';

var buffer1 = new Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
var buffer2 = new Buffer([0x62, 0x75, 0x66, 0x66, 0x25, 0x62]);
var buffer1Short = new Buffer([0x62, 0x75, 0x66, 0x66]);
var buffer1Copy = new Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);

describe('equalBuffers', function () {
	it('buffer should be equal to it self', function () {
    	var result = formats.equalBuffers(buffer1, buffer1);	
    	assert.equal(result, true);
	});

	it('buffers should not be equal', function () {
    	var result = formats.equalBuffers(buffer1, buffer2);	
    	assert.equal(result, false);		
    });

    it('buffers should not be equal', function () {
    	var result = formats.equalBuffers(buffer1, buffer1Short);	
    	assert.equal(result, false);		
    });

    it('identical buffers be equal', function () {
    	var result = formats.equalBuffers(buffer1, buffer1Copy);	
    	assert.equal(result, true);		
    });
});

var number = 20;
var hex = number.toString(16);
var bigNum = new BN(number);
var notANumber = 'not number';

describe('toNumber', function () {
	it('number should convert correctly', function () {
    	var result = formats.toNumber(number);	
    	assert.equal(result, number);
	});

	it('hex should convert correctly', function () {
    	var result = formats.toNumber(hex);	
    	assert.equal(result, number);
	});

	it('bignumber should convert correctly', function () {
    	var result = formats.toNumber(bigNum);	
    	assert.equal(result, number);
	});	

	it('string should not convert correctly', function () {
		try {
			var result = formats.toNumber(notANumber);	
		} catch (error) {

		}
	});	
});
