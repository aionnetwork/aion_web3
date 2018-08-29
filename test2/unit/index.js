let assert = require('assert')
let Web3 = require('../../src/index')
let HttpProvider = require('../../src/http-provider')
let {config} = require('./fixtures')
let {jsonRpc} = config

describe('Web3', () => {
  let web3

  it('initializes', () => {
    web3 = new Web3(new HttpProvider(jsonRpc.url))
  })

  it('version 1.0.0', () => {
    web3.version.should.be.exactly('1.0.0')
  })

  it('modules', () => {
    Web3.modules.should.be.an.object
    Web3.modules.Eth.should.be.a.Function
    Web3.modules.Net.should.be.a.Function
    Web3.modules.Personal.should.be.a.Function
    Web3.modules.Shh.should.be.a.Function
    Web3.modules.Bzz.should.be.a.Function
  })

  it('utils', () => {
    web3.utils.should.be.an.Object
  })

  it('setProvider', () => {
    web3.setProvider.should.be.an.Function
  })

  it('providers', () => {
    web3.providers.should.be.an.Object
  })

  it('givenProvider', () => {
    assert.equal(web3.givenProvider, null)
  })

  it('currentProvider', () => {
    web3.currentProvider.send.should.be.a.Function
  })

  it('BatchRequest', () => {
    web3.BatchRequest.should.be.an.Function
  })

  it('extend', () => {
    web3.extend.should.be.an.Function
  })

  it('bzz', () => {
    should.throws(() => web3.bzz)
  })

  it('shh', () => {
    should.throws(() => web3.shh)
  })

  it('eth', () => {
    web3.eth.should.be.an.Object
    web3.eth.currentProvider.should.be.exactly(web3.currentProvider)
  })
})
