var chai = require('chai');
var assert = chai.assert;
var hashutil = require('../packages/aion-lib/src/crypto.js');

var inputVal = '123vnfsgj364hbdfh';
var inputVal2 = '00000000000000000000000000000000'; 

describe('blake2b128', function () {
	it('should hash correctly', function () {
    	var res = hashutil.blake2b128(inputVal);
        assert.equal(res.toString('hex'), '28208714050628dcb1118a16492a5dfc')
	});

	it('should hash correctly', function () {
    	var res = hashutil.blake2b128(inputVal2);
        assert.equal(res.toString('hex'), 'ff0f22492f44bac4c4b30ae58d0e8daa')
    });
});

describe('blake2b256', function () {
	it('should hash correctly', function () {
    	var res = hashutil.blake2b256(inputVal);
        assert.equal(res.toString('hex'), '4e590cc616d8c3a0099cb70911c92e86da57a183bb253352bad4ec90d60f7c24')
	});

	it('should hash correctly', function () {
    	var res = hashutil.blake2b256(inputVal2);
        assert.equal(res.toString('hex'), '89eb0d6a8a691dae2cd15ed0369931ce0a949ecafa5c3f93f8121833646e15c3')
    });

});