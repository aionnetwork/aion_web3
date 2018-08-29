/*

aion cases sourced from conqeust test network
https://conquest-api.aion.network/aion/dashboard/getAccountStatistics


*/
let addresses = [
  // SECURITY: we need to validate these. they are only assumed to be valid
  {
    address:
      '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920',
    validAddress: true
  },
  {
    address:
      '0xa05a3889b106e75baa621b8cc719679a3dbdd799afac1ca6b42d03dc93a23687',
    validAddress: true
  },
  {
    address:
      '0xa0229e43f4a040f9fa6b2ab2f2cccc066025117def3414e08edbe7aee8e61647',
    validAddress: true
  },
  {
    address:
      '0xa0dd16394f16ea21c8b45c00b2e43850ae7e8f00fe54789ddd1881d33b21df0c',
    validAddress: true
  },
  {
    address:
      '0xa046cc48bcde4b0b2ce2dbefb318f3778946b6c0011f691ecc4025cc145a93d3',
    validAddress: true
  },
  {
    address:
      '0xa0e1cca4fe786118c0abb1fdf45c04e44354f971b25c04ed77ac46f13cae179a',
    validAddress: true
  },
  {
    address:
      '0xa0b1b3f651990669c031866ec68a4debfece1d3ffb9015b2876eda2a9716160b',
    validAddress: true
  },
  {
    address:
      '0xa012123456789012345678901234567890123456789012345678901234567890',
    validAddress: true
  },
  {
    address:
      '0xa0e1cca4fe786118c0abb1fdf45c04e44354f971b25c04ed77ac46f13cae179a',
    validAddress: true
  },
  {
    address:
      '0xa0b1b3f651990669c031866ec68a4debfece1d3ffb9015b2876eda2a9716160b',
    validAddress: true
  },
  {
    address:
      '0xa0e1cca4fe786118c0abb1fdf45c04e44354f971b25c04ed77ac46f13cae179a',
    validAddress: true
  },
  {
    address:
      '0xa0b1b3f651990669c031866ec68a4debfece1d3ffb9015b2876eda2a9716160b',
    validAddress: true
  },
  {
    address:
      '0xa012123456789012345678901234567890123456789012345678901234567890',
    validAddress: true
  },
  // valid ethereum addresses but not valid aion address
  {
    throws: true,
    address: '0x27b1fdb04752bbc536007a920d24acb045561c26',
    validAddress: false
  },
  {
    throws: true,
    address: '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed',
    validAddress: false
  },
  {
    throws: true,
    address: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359',
    validAddress: false
  },
  {
    throws: true,
    address: '0xdbf03b407c01e7cd3cbea99509d93f8dddc8c6fb',
    validAddress: false
  },
  {
    throws: true,
    address: '0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb',
    validAddress: false
  }
]

module.exports = addresses
