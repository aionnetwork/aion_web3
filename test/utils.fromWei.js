var assert = require('assert');
var utils = require('../packages/web3-utils');

describe('lib/utils/utils', function () {
    describe('fromNAmp', function () {
        it('should return the correct value', function () {

            assert.equal(utils.fromNAmp('1000000000000000000', 'nAmp'),   '1000000000000000000');
            assert.equal(utils.fromNAmp('1000000000000000000', 'uAmp'),   '1000000000000000');
            assert.equal(utils.fromNAmp('1000000000000000000', 'mAmp'),   '1000000000000');
            assert.equal(utils.fromNAmp('1000000000000000000', 'Amp'),    '1000000000');
            assert.equal(utils.fromNAmp('1000000000000000000', 'uAION'),  '1000000');
            assert.equal(utils.fromNAmp('1000000000000000000', 'mAION'),  '1000');
            assert.equal(utils.fromNAmp('1000000000000000000', 'cAION'),  '100');
            assert.equal(utils.fromNAmp('1000000000000000000', 'dAION'),  '10');
            assert.equal(utils.fromNAmp('1000000000000000000', 'AION'),   '1');

        });
    });
});

