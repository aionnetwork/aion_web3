let WebsocketProvider = require('../../src/websocket-provider')
let {config} = require('./fixtures')

describe('WebsocketProvider', () => {
  it('initializes', () => {
    let prov = new WebsocketProvider(config.ws.url)
    prov.send.should.be.a.Function
  })
})
