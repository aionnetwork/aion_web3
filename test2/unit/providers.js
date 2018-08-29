let assert = require('assert')
let {assignProvider} = require('../../src/providers')

describe('provider', () => {
  let context = {}
  let provider
  let providerOpts

  it('initializes', () => {
    assignProvider(context, {provider, providerOpts})
    context.providers.should.be.an.Object
    context.setProvider.should.be.a.Function
    assert.equal(context.givenProvider, null)
  })
})
