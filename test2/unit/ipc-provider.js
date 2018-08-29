let IpcProvider = require('../../src/ipc-provider')

describe('IpcProvider', () => {
  let prov

  it('initializes', () => {
    prov = new IpcProvider()
    prov.send.should.be.a.Function
  })
})
