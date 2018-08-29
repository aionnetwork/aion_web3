/*

these test cases need to be adapted for FastVM byte sizes

*/

let BN = require('bn.js')
let BigNumber = require('bignumber.js')

// https://github.com/ethereum/web3.js/blob/1.0/test/utils.soliditySha3.js
let soliditySha3Cases = [
  {
    values: [
      true,
      {value: true, type: 'bool'},
      {v: true, t: 'bool'},
      {v: true, type: 'bool'},
      {value: true, t: 'bool'}
    ],
    expected:
      '0x5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2'
  },
  {
    values: [
      false,
      {value: false, type: 'bool'},
      {v: false, t: 'bool'},
      {v: false, type: 'bool'},
      {value: false, t: 'bool'}
    ],
    expected:
      '0xbc36789e7a1e281436464229828f817d6612f7b477d66591ff96a9e064bcc98a'
  },
  {
    values: [
      'Hello!%',
      {value: 'Hello!%', type: 'string'},
      {value: 'Hello!%', type: 'string'},
      {v: 'Hello!%', t: 'string'}
    ],
    expected:
      '0x661136a4267dba9ccdf6bfddb7c00e714de936674c4bdb065a531cf1cb15c7fc'
  },
  {
    values: [
      2345676856,
      '2345676856',
      new BN('2345676856'),
      new BigNumber('2345676856', 10),
      {v: '2345676856', t: 'uint128'},
      {v: new BN('2345676856'), t: 'uint128'},
      {v: '2345676856', t: 'uint'}
    ],
    /*expected:
      '0xf490de2920c8a35fabeb13208852aa28c76f9be9b03a4dd2b3c075f7a26923b4'*/
    expected:
      '0x9fbc5b7fd4002ba1c955d332796eb781b1088a47af4a6719b4495593aa55709b'
  },
  {
    values: [
      '2342342342342342342345676856',
      new BN('2342342342342342342345676856'),
      new BigNumber('2342342342342342342345676856', 10),
      {v: '2342342342342342342345676856', t: 'uint128'},
      {v: '2342342342342342342345676856', t: 'uint'}
    ],
    /*expected:
      '0x8ac2efaaee0058e1f1fbcb59643f6799c31c27096a347651e40f98daf1905094'*/
    expected:
      '0x7cc2b121f822f67a5df063319c72f6933cb84dfe9e74cbf9357f0241310471c6'
    // 5
  },
  {
    values: [{v: '56', t: 'uint8'}],
    expected:
      '0xe4b1702d9298fee62dfeccc57d322a463ad55ca201256d01f62b45b2e1c21c10'
  },
  {
    values: [{v: '256', t: 'uint16'}],
    expected:
      '0x628bf3596747d233f1e6533345700066bf458fa48daedaf04a7be6c392902476'
  },
  {
    values: [{v: '3256', t: 'uint32'}],
    expected:
      '0x720e835027b41b4b3e057ee9e6d4351ffc726d767652cdb0fc874869df88001c'
  },
  {
    values: [{v: '454256', t: 'uint64'}],
    expected:
      '0x5ce6ff175acd532fb4dcef362c829e74a0ce1fde4a43885cca0d257b33d06d07'
  },
  {
    values: [
      {v: '44454256', t: 'uint128'},
      {v: '44454256', t: 'int128'} // should be the same
    ],
    expected:
      '0x372b694bc0f2dd9229f39b3892621a6ae3ffe111c5096a0a9253c34558a92ab8'
  },
  {
    values: [{v: '3435454256', t: 'uint128'}],
    /*expected:
      '0x89e0942df3602c010e0252becbbe1b4053bd4a871a021c02d8ab9878f1194b6b'*/
    expected:
      '0x3e04e9d15760cfc79b59af44dfac0a687a938fdc3e6833e11047676052135a99'
    // 11
  },
  {
    values: [
      '0x2345435675432144555ffffffffdd222222222222224444556553522',
      {
        v: '0x2345435675432144555ffffffffdd222222222222224444556553522',
        t: 'bytes'
      },
      {
        v: '2345435675432144555ffffffffdd222222222222224444556553522',
        t: 'bytes'
      },
      {
        error: true,
        v: '0x2345435675432144555ffffffffdd22222222222222444455655352',
        t: 'bytes'
      }
    ],
    // error: true,
    expected:
      '0xb7ecb0d74e96b792a62b4a9dad28f5b1795417a89679562178b1987e0767e009'
  },
  {
    values: [
      -3435454256,
      new BN(-3435454256),
      new BN('-3435454256'),
      '-3435454256',
      {v: '-3435454256', t: 'int'},
      {v: '-3435454256', t: 'int128'}
    ],
    /*expected:
      '0x858d68fc4ad9f80dc5ee9571c7076298f8139d1d111e0955426de9381b10a061'*/
    expected:
      '0xf83adf12476fa4ca78559f1ce60a4cce310a970252d13b7bdda8701fbeee7f87'
    // 13
  },
  {
    values: [{v: '-36', t: 'int8'}],
    expected:
      '0xd1023f33bbf70407fe1e7011c03159e2efe16e44fa97b4a8d50bc4acbfd6ce23'
  },
  {
    values: [
      {v: '0x22', t: 'bytes2'},
      {v: '22', t: 'bytes2'},
      {error: true, v: '0x222222', t: 'bytes2'}
    ],
    expected:
      '0xb07fb0a3471486f9ccb02aab1d525df60d82925cb2d27860f923e655d76f35fc'
  },
  {
    values: [{v: '0x44222266', t: 'bytes4'}, {v: '44222266', t: 'bytes4'}],
    expected:
      '0x7cdb669d75710eb06b9b34618e77206db56f0cc71698f246433ce8339ed8075b'
  },
  {
    values: [
      {v: '0x44555ffffffffdd222222222222224444556553522', t: 'bytes32'},
      {v: '44555ffffffffdd222222222222224444556553522', t: 'bytes32'}
    ],
    expected:
      '0x5aac5a7501e071c3ee062ede777be470acb4cd05a2724146438d7e4518d91677'
  },
  {
    // Aion addresses conversion
    values: [
      '0xA07C95cC8729a0503C5ad50eb37eC8a27cD22D65dE3BB225982Ec55201366920',

      // also try invalid checksum like ethereum
      // "should work as it is interpreted as address
      //        v-- changed these case on these
      '0xA07C95Cc8729a0503C5ad50eb37eC8a27cD22D65dE3BB225982Ec55201366920',

      // original ethereum addresses added
      '0xA07C95cC8729a0503C5ad50eb37eC8a27cD22D65dE3BB225982Ec55201366920',
      '0xA07C95cC8729a0503C5ad50eb37eC8a27cD22D65dE3BB225982Ec55201366920',
      {
        v: '0xA07C95cC8729a0503C5ad50eb37eC8a27cD22D65dE3BB225982Ec55201366920',
        t: 'address'
      },
      {
        v: '0xA07C95cC8729a0503C5ad50eb37eC8a27cD22D65dE3BB225982Ec55201366920',
        t: 'bytes'
      },
      {
        error: true,
        v: '0xA07C95cC8729a0503C5ad50eb37eC8a27cD22D65dE3BB225982Ec55201366920',
        t: 'bytes20'
      }
    ],
    expected:
      '0x3b9ea40b52d9ad631bb6815c33ca3bdf3981273156e3d5992465ae9ed4325ed5'
    // 18
  },
  {
    values: [{v: '36', t: 'int8'}],
    expected:
      '0xb104e6a8e5e1477c7a8346486401cbd4f10ab4840a4201066d9b59b747cb6f88'
  },
  {
    values: [{v: '36', t: 'int128'}],
    /*expected:
      '0x7cd332d19b93bcabe3cce7ca0c18a052f57e5fd03b4758a09f30f5ddc4b22ec4'*/
    expected:
      '0x9f3d5d3bad43bc49c119b1e403d19dc8c5ca0d7a5829a0f47f29f7230992e917'
  },
  {
    values: [
      {v: [-12, 243], t: 'int[]'},
      {v: [-12, 243], t: 'int128[]'},
      {v: ['-12', '243'], t: 'int128[]'},
      {v: [new BN('-12'), new BN('243')], t: 'int128[]'},
      {v: ['-12', '243'], t: 'int128[2]'}
    ],
    /*expected:
      '0xa9805b78a6ec1d71c3722498d521fde9d3913c92360e3aed06a9403db25f0351'*/
    expected:
      '0x33eed28a81fe95d4dd9a849467ff20bc89d30d042e03923629b72d0bdd501c36'
  },
  {
    values: [
      {v: [12, 243], t: 'uint[]'},
      {v: [12, 243], t: 'uint128[]'},
      {v: ['12', '243'], t: 'uint128[]'},
      {v: [new BN('12'), new BN('243')], t: 'uint128[]'},
      {v: ['12', '243'], t: 'uint128[2]'},
      {error: true, v: ['12', '243'], t: 'uint128[1]'}
    ],
    /*expected:
      '0x74282b2d1a7a1a70af6f3a43ab576cd6feeaa6ebaa5fb2033b90d5942bf48a60'*/
    expected:
      '0x11f7ef838e7a3db393b0f54670b4d92b76517f9fd9fe45ba2c9f430072624cf1'
  },
  {
    values: [{v: ['0x234656', '0x23434234234ffff456'], t: 'bytes32[]'}],
    expected:
      '0x3f67732837541dd9e3aa29cb99d88839fceccf9486b3ec053d82d339d35c79d5'
  },
  {
    values: [{v: '0x234656', t: 'bytes16'}, {v: '234656', t: 'bytes16'}],
    expected:
      '0x5d0d56c5b556a2dfee96b3de4717b3bd0333b7ffa5932e208fdcc24a03bdf088'
  },
  {
    values: [
      {v: ['0x234656', '0x23434234234ffff456'], t: 'bytes16[]'},
      {v: ['234656', '23434234234ffff456'], t: 'bytes16[]'}
    ],
    expected:
      '0x3f67732837541dd9e3aa29cb99d88839fceccf9486b3ec053d82d339d35c79d5'
  },
  {
    values: [
      // lowecase address
      {
        v: [
          '0xa0b1b3f651990669c031866ec68a4debfece1d3ffb9015b2876eda2a9716160b',
          '0xa0e1cca4fe786118c0abb1fdf45c04e44354f971b25c04ed77ac46f13cae179a'
        ],
        t: 'address[]'
      },
      // checksum addresses
      {
        v: [
          '0xA0B1b3f651990669c031866ec68A4debfECe1d3fFb9015B2876EDa2A9716160b',
          '0xA0e1CcA4fE786118c0abb1fdF45C04e44354f971B25C04ED77aC46f13CaE179a'
        ],
        t: 'address[2]'
      },
      // wrong number of values
      {
        error: true,
        v: [
          '0xA0B1b3f651990669c031866ec68A4debfECe1d3fFb9015B2876EDa2A9716160b',
          '0xA0e1CcA4fE786118c0abb1fdF45C04e44354f971B25C04ED77aC46f13CaE179a'
        ],
        t: 'address[4]'
      }
    ],
    expected:
      '0xc172304c4be91cb40c9b16f69286c74af8ab0612f7128f848c6197e8533271e7'
  },
  {
    values: [{v: 0, t: 'uint'}],
    /*expected:
      '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563'*/
    expected:
      '0xf490de2920c8a35fabeb13208852aa28c76f9be9b03a4dd2b3c075f7a26923b4'
  },
  {
    error: true,
    values: [
      ['someValue'] // should error
    ],
    expected: ''
  }
]

module.exports = soliditySha3Cases
