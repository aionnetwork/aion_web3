let BatchRequest = require('../../src/batch-request')

describe('BatchRequest', () => {
  let batchRequest

  it('initializes', () => {
    batchRequest = new BatchRequest()
    batchRequest.add.should.be.a.Function
    batchRequest.execute.should.be.a.Function
  })
})
