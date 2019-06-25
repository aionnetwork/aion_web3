var _ = require('underscore');
var BN = require('bn.js');
var BigNumber = require('bignumber.js');
var chai = require('chai');
var assert = chai.assert;
var utils = require('../packages/web3-utils');

// each "values" is one kind of parameter of the same type
var tests = [{
    values: [
        true,
        {value: true, type: 'bool'},
        {v: true, t: 'bool'},
        {v: true, type: 'bool'},
        {value: true, t: 'bool'}
    ],  expected: '0xee155ace9c40292074cb6aff8c9ccdd273c81648ff1149ef36bcea6ebb8a3e25'
},{
    values: [
        false,
        {value: false, type: 'bool'},
        {v: false, t: 'bool'},
        {v: false, type: 'bool'},
        {value: false, t: 'bool'}
    ],  expected: '0x03170a2e7597b7b7e3d84c05391d139a62b157e78786d8c082f29dcf4c111314'
},{
    values: [
        'Hello!%',
        {value: 'Hello!%', type: 'string'},
        {value: 'Hello!%', type: 'string'},
        {v: 'Hello!%', t: 'string'}
    ], expected: '0x7537c19eb479c4c478582d442c872f6af416133f534c1e9e96c753af1d6882c5'
},{
    values: [
        2345676856,
        '2345676856',
        new BN('2345676856'),
        new BigNumber('2345676856', 10),
        {v: '2345676856', t: 'uint128'},
        {v: new BN('2345676856'), t: 'uint128'},
        {v: '2345676856', t: 'uint'}
    ], expected: '0xebf2705748eeae69e88d6818c12d393a5e8252d0dba8d4e7787ef6a33a4e07c8'
},{
    values: [
        '2342342342342342342345676856',
        new BN('2342342342342342342345676856'),
        new BigNumber('2342342342342342342345676856', 10),
        {v: '2342342342342342342345676856', t: 'uint128'},
        {v: '2342342342342342342345676856', t: 'uint'}
    ], expected: '0xce1029811da97d6322587100fc6ca2b05fca58040d2e5e938b76f7cfeb7c6bbb'
// 5
},{
    values: [
        {v: '56', t: 'uint8'}
    ], expected: '0xf95f6b30745ba7cbab07ccc59fdc83be45649c4c964909b7675ff0b57b15f585'
},{
    values: [
        {v: '256', t: 'uint16'}
    ], expected: '0x8080778c30c20fa2ebc0ed18d2cbca1f30b027625c7d9d97f5d589721c91aeb6'
},{
    values: [
        {v: '3256', t: 'uint32'}
    ], expected: '0xf0d73e707f02cb546a7b8cfac2b73f3e1ff12ad67b70b6276722d3b261a62f71'
},{
    values: [
        {v: '454256', t: 'uint64'}
    ], expected: '0x7a95428e8f47606dbae95ee44f8a77686593f71047fa3191ea97d92cec960738'
},{
    values: [
        {v: '44454256', t: 'uint128'},
        {v: '44454256', t: 'int128'} // should be the same
    ], expected: '0x618051d2f3abece08819a91ea2683c2a74dadc7dbe01fc3f797d2b2d255c5a8a'
},{
    values: [
        {v: '3435454256', t: 'uint128'}
    ], expected: '0x3348175de26eaaaadd8e6dcddff29e2d5848b63793bd7c14c319c90272c6c694'
// 11
},{
    values: [
        '0x2345435675432144555ffffffffdd222222222222224444556553522',
        {v: '0x2345435675432144555ffffffffdd222222222222224444556553522', t: 'bytes'},
        {v: '2345435675432144555ffffffffdd222222222222224444556553522', t: 'bytes'},
        {error: true, v: '0x2345435675432144555ffffffffdd22222222222222444455655352', t: 'bytes'}
    ], expected: '0x01b43f462402f287c8389ec751e335a6b3ccab88f0bfce9bf0d180aed81900a4'
},{
    values: [
        -3435454256,
        new BN(-3435454256),
        new BN('-3435454256'),
        '-3435454256',
        {v: '-3435454256', t: 'int'},
        {v: '-3435454256', t: 'int128'}
    ], expected: '0x38936148884d70305b0adca7a6e5afcf3fd22fcb1989aebcd2fa6ba79431fdda'
// 13
},{
    values: [
        {v: '-36', t: 'int8'}
    ], expected: '0x220823288f31bdd951e37a80da8586f6e90c68de9ab062322788a77dddb041bf'
},{
    values: [
        {v: '0x22', t: 'bytes2'},
        {v: '22', t: 'bytes2'},
        {error: true, v: '0x222222', t: 'bytes2'}
    ], expected: '0x82b9af43fac3c2bceca7efa703992d5b2f8aab11ef78b2bbe48fe8046855434a'
},{
    values: [
        {v: '0x44222266', t: 'bytes4'},
        {v: '44222266', t: 'bytes4'}
    ], expected: '0x159e4fc8e66c267ca7114de3bb9e1ba0d40c3dfbfe24027337dd92008e1cb3c3'
},{
    values: [
        {v: '0x44555ffffffffdd222222222222224444556553522', t: 'bytes32'},
        {v: '44555ffffffffdd222222222222224444556553522', t: 'bytes32'}
    ], expected: '0x8210e97cbacde5f69f18d6f82f967ebf64add6656fa86158660e1c9a56df0a8e'
},{
    values: [
        '0xa044a8f0C78a8856FF69D438f8120A727ea8c9045ac728F51bAd94eaa6d648ce',
        '0xa044a8f0C78a8856FF69D438f8120A727ea8c9045ac728F51bAd94eaa6d648CE', // invalid checksum, should work as it is interpreted as address
        {v: '0xa044a8f0C78a8856FF69D438f8120A727ea8c9045ac728F51bAd94eaa6d648ce', t: 'address'},
        {error: true, v: '0xa044a8f0C78a8856FF69D438f8120A727ea8c9045ac728F51bAd94eaa6d648CE', t: 'address'},
        {v: '0xa044a8f0C78a8856FF69D438f8120A727ea8c9045ac728F51bAd94eaa6d648ce', t: 'bytes'},
        {v: '0xa044a8f0C78a8856FF69D438f8120A727ea8c9045ac728F51bAd94eaa6d648ce', t: 'bytes32'}
    ], expected: '0x8411333cc9f0251a2bf8c4e9e2d00f79161482b8fc60abd78292231155bb1747'
// 18
},{
    values: [
        {v: '36', t: 'int8'}
    ], expected: '0xf63498b4ae65be466e4a71878971b9c524458996450b0ff8262cddf3f0d99229'
},{
    values: [
        {v: '36', t: 'int128'}
    ], expected: '0xb1bb1a58581ea009ac0fa92b7f18b6500864b759ea114dc87d4ea6cdfb378de5'
},{
    values: [
        {v: [-12, 243], t: 'int[]'},
        {v: [-12, 243], t: 'int128[]'},
        {v: ['-12', '243'], t: 'int128[]'},
        {v: [new BN('-12'), new BN('243')], t: 'int128[]'},
        {v: ['-12', '243'], t: 'int128[2]'}
    ], expected: '0x558ea4880484b82605744ddc055b599900c5e2193a555bcbb60768a64766b910'
},{
    values: [
        {v: [12, 243], t: 'uint[]'},
        {v: [12, 243], t: 'uint128[]'},
        {v: ['12', '243'], t: 'uint128[]'},
        {v: [new BN('12'), new BN('243')], t: 'uint128[]'},
        {v: ['12', '243'], t: 'uint128[2]'},
        {error: true, v: ['12', '243'], t: 'uint128[1]'}
    ], expected: '0x5f6047a96325bbfa8b96e710b1456da6dc93532857b1685aabbf3e4920c83aeb'
},{
    values: [
        {v: ['0x234656', '0x23434234234ffff456'], t: 'bytes32[]'},
    ], expected: '0x2f97b9d6bc3815ff0e0cc8a5cf49a759d67b95951eb78a0651c5ac69312fea9d'
},{
    values: [
        {v: '0x234656', t: 'bytes16'},
        {v: '234656', t: 'bytes16'}
    ], expected: '0x5af956774a2c725434c7b81dd3e3d664fe5e2daba69d6ea8f1cfd6b8f38438a4'
},{
    values: [
        {v: ['0x234656', '0x23434234234ffff456'], t: 'bytes16[]'},
        {v: ['234656', '23434234234ffff456'], t: 'bytes16[]'}
    ], expected: '0x2f97b9d6bc3815ff0e0cc8a5cf49a759d67b95951eb78a0651c5ac69312fea9d'
},{
    values: [
        {v: ['0xa044a8f0C78a8856FF69D438f8120A727ea8c9045ac728F51bAd94eaa6d648ce', '0xa065Bd956cCadbaa0e07f09BEc43C88523A8993de2b5b5B36Aa2620219766Ae4'], t: 'address[]'},
        {v: ['0xa044a8f0C78a8856FF69D438f8120A727ea8c9045ac728F51bAd94eaa6d648ce', '0xa065Bd956cCadbaa0e07f09BEc43C88523A8993de2b5b5B36Aa2620219766Ae4'], t: 'address[2]'},
        {error: true, v: ['0x407d73d8a49eeb85D32Cf465507dd71d507100c1', '0xa065Bd956cCadbaa0e07f09BEc43C88523A8993de2b5b5B36Aa2620219766Ae4'], t: 'address[]'},
        {error: true, v: ['0xa044a8f0C78a8856FF69D438f8120A727ea8c9045ac728F51bAd94eaa6d648ce', '0xa065Bd956cCadbaa0e07f09BEc43C88523A8993de2b5b5B36Aa2620219766Ae4'], t: 'address[4]'}
    ], expected: '0xd74491dcdfe679053100b203d4c49b7bae23ce5bfb20fa873747f50167388e5b'
},{
    values: [
        {v: 0, t: 'uint'}
    ], expected: '0x94c1c088cc9453996779630ad3af45cbd92814828dd784cf2aa12df95d1b8afe'
},{
    values: [
        ['someValue'] // should error
    ], expected: ''
}];


describe('web3.solidityBlake2b256', function () {
    tests.forEach(function (test) {
        test.values.forEach(function (value) {
            it('should hash "'+ JSON.stringify(value) +'" into "'+ test.expected +'"', function() {

                if(value.error || _.isArray(value)) {
                    assert.throws(utils.solidityBlake2b256.bind(null, value));
                } else {
                    assert.deepEqual(utils.solidityBlake2b256(value), test.expected);
                }

            });
        });
    });

    it('should hash mixed boolean values in any order', function() {

        assert.deepEqual(utils.solidityBlake2b256(
            tests[0].values[1], // true
            tests[1].values[0], // false
            tests[1].values[2], // false
            tests[0].values[3]  // true
        ), '0x3414fe2432f883bf9fdc715cdc8afd637ac022d074b0c3fd05356ae80f0572ad');
    });

    it('should hash mixed string and number values in any order', function() {

        assert.deepEqual(utils.solidityBlake2b256(
            tests[2].values[0], // 'Hello!%'
            tests[3].values[2], // 2345676856
            tests[4].values[2], // '2342342342342342342345676856'
            tests[2].values[3],  // 'Hello!%'
            tests[1].values[2] // false
        ), '0x9e91473f82ee3fa83eca733126611d9a0a0a9679e99693675cf8ebd98fe49540');
    });

    it('should hash mixed number types in any order', function() {

        assert.deepEqual(utils.solidityBlake2b256(
            tests[5].values[0], // v: '56', t: 'uint8'
            tests[6].values[0], // v: '256', t: 'uint16'
            tests[7].values[0], // v: '3256', t: 'uint32'
            tests[8].values[0],  // v: '454256', t: 'uint64'
            tests[9].values[0],  // v: '44454256', t: 'uint128'
        ), '0xb0863dbf2b453058558cc2a0b47ab6f5de84f503bb9689165d2c52c120edfe64');
    });

    it('should hash mixed number types addresses and boolean in any order', function() {

        assert.deepEqual(utils.solidityBlake2b256(
            tests[5].values[0], // v: '56', t: 'uint8'
            tests[13].values[0], // v: '-36', t: 'int8'
            tests[15].values[0], // v: '0x44222266', t: 'bytes4'
            tests[0].values[0],  // true
            tests[17].values[1]  // v: '0xa044a8f0C78a8856FF69D438f8120A727ea8c9045ac728F51bAd94eaa6d648ce', t: 'address'
        ), '0x6510c3dea2877ac3cd5936eb851c04576a867e243fb7bd9b6371d1e7e7920c88');
    });

    it('should hash mixed number arrays addresses and boolean in any order', function() {

        assert.deepEqual(utils.solidityBlake2b256(
            tests[15].values[1], // v: '0x44222266', t: 'bytes4'
            tests[25].values[0], // address array
            tests[0].values[0],  // true
            tests[13].values[0], // v: '-36', t: 'int8'
            tests[12].values[5],  // v: '-3435454256', t: 'int128'
            tests[17].values[0],  // 0xa044a8f0C78a8856FF69D438f8120A727ea8c9045ac728F51bAd94eaa6d648ce
            tests[17].values[1]  // v: 0xa044a8f0C78a8856FF69D438f8120A727ea8c9045ac728F51bAd94eaa6d648ce t: address
        ), '0xe06d2ffafc9a8e573371f142090d2c008041bb2f928aaeecbb23830b5ae9e8d5');
    });
});
