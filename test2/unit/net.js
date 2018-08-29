let Net = require('../../src/net')

describe('net', () => {
  let net

  it('initializes', () => {
    net = new Net()
    net.providers.should.be.an.Object
  })
})
