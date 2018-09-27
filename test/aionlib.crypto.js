var chai = require('chai');
var assert = chai.assert;
var hashutil = require('../packages/aion-lib/src/crypto.js');

var inputVal = '123vnfsgj364hbdfh';
var inputVal2 = '00000000000000000000000000000000';
var blake128ResLength = 16;
var blake256ResLength = 32; 

describe('blake2b128', function () {
	it('should hash correctly', function () {
    	var res = hashutil.blake2b128(inputVal);
    	assert.equal(res.length, blake128ResLength);
	});

	it('should hash correctly', function () {
    	var res = hashutil.blake2b128(inputVal2);
		assert.equal(res.length, blake128ResLength);			
    });

    it('should hash consistantly', function () {
    	var res1 = hashutil.blake2b128(inputVal);
    	var res2 = hashutil.blake2b128(inputVal);
    	assert.equal(res1.toString(), res2.toString(), 'hashes should b the same');
    })
});

describe('blake2b256', function () {
	it('should hash correctly', function () {
    	var res = hashutil.blake2b256(inputVal);
    	assert.equal(res.length, blake256ResLength);
	});

	it('should hash correctly', function () {
    	var res = hashutil.blake2b256(inputVal2);
		assert.equal(res.length, blake256ResLength);			
    });

    it('should hash consistantly', function () {
    	var res1 = hashutil.blake2b256(inputVal);
    	var res2 = hashutil.blake2b256(inputVal);
    	assert.equal(res1.toString(), res2.toString(), 'hashes should b the same');
    })
});