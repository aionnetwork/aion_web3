let Eth = require('../../src/eth')
let {testProvider} = require('./fixtures')

describe('Eth', () => {
  let eth

  it('initializes', () => {
    eth = new Eth(testProvider)
    eth.providers.should.be.an.Object
    eth.net.should.be.an.Object
    eth.personal.should.be.an.Object
  })

  // it's not clear to me if Aion can do subscriptions yet
  xit('subscribe', () => {
    eth.subscribe()
  })
})
