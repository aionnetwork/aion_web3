/*

we don't yet have any valid or invalid data for ibans

*/

let Iban = require('../../src/iban')

describe('Iban', () => {
  let iban

  it('initializes', () => {
    iban = new Iban()
  })

  xit('toAddress', () => {
    iban.toAddress().should.be.exactly()
  })

  xit('toIban', () => {
    iban.toIban().should.be.exactly()
  })

  xit('fromEthereumAddress', () => {
    iban.fromEthereumAddress().should.be.exactly()
  })

  xit('fromBban', () => {
    iban.fromBban().should.be.exactly()
  })

  xit('createIndirect', () => {
    iban.createIndirect().should.be.exactly()
  })

  xit('isValid', () => {
    iban.isValid().should.be.exactly()
  })

  xit('isDirect', () => {
    iban.isDirect().should.be.exactly()
  })

  xit('isIndirect', () => {
    iban.isIndirect().should.be.exactly()
  })

  xit('checksum', () => {
    iban.checksum().should.be.exactly()
  })

  xit('institution', () => {
    iban.institution().should.be.exactly()
  })

  xit('client', () => {
    iban.client().should.be.exactly()
  })

  xit('toString', () => {
    iban.toString().should.be.exactly()
  })
})
