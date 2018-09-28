var chai = require('chai');
var utils = require('../packages/web3-utils');

var assert = chai.assert;

describe('lib/utils/utils', function () {
    describe('toNAmp', function () {
        it('should return the correct value', function () {

            assert.equal(utils.toNAmp('1', 'nAmp'),   '1');
            assert.equal(utils.toNAmp('1', 'uAmp'),   '1000');
            assert.equal(utils.toNAmp('1', 'mAmp'),   '1000000');
            assert.equal(utils.toNAmp('1', 'Amp'),    '1000000000');
            assert.equal(utils.toNAmp('1', 'uAION'),  '1000000000000');
            assert.equal(utils.toNAmp('1', 'mAION'),  '1000000000000000');
            assert.equal(utils.toNAmp('1', 'cAION'),  '10000000000000000');
            assert.equal(utils.toNAmp('1', 'dAION'),  '100000000000000000');
            assert.equal(utils.toNAmp('1', 'AION'),   '1000000000000000000');

            assert.throws(function () {utils.toNAmp(1, 'nAmp1');}, Error);
        });
    });
});

