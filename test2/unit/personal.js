let Personal = require('../../src/personal')
let {testProvider} = require('./fixtures')

describe('Personal', () => {
  let personal

  it('initializes', () => {
    personal = new Personal(testProvider)
    personal.providers.should.be.an.Object
    personal.setProvider.should.be.a.Function
    personal.BatchRequest.should.be.a.Function
  })
})
