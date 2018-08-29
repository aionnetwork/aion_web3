/*

ensure we have the same hashes between client and server

*/

let {blake2b256} = require('../../../src/lib/crypto')
let {toBuffer} = require('../../../src/lib/formats')

let assertBlake2b256 = (input, output) =>
  blake2b256(toBuffer(input))
    .toString('hex')
    .should.be.exactly(output)

describe('lib/crypto', () => {
  it('blake2b256', () => {
    /*

    the JS blake2b256 equates with this:
    https://github.com/aionnetwork/aion/blob/master/modCrypto/test/org/aion/crypto/HashTest.java#L81

    */
    assertBlake2b256(
      'test',
      '928b20366943e2afd11ebc0eae2e53a93bf177a4fcf35bcc64d503704e65e202'
    )
  })
})
