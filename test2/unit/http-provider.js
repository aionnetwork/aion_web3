let HttpProvider = require('../../src/http-provider')
let {config} = require('./fixtures')

describe('HttpProvider', () => {
  let prov

  it('initializes', () => {
    prov = new HttpProvider(config.jsonRpc.url)
    prov.send.should.be.a.Function
  })
})
