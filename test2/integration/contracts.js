/*eslint-disable no-console*/

let Web3 = require('../../src/index')
let client = new Web3('http://127.0.0.1:8545')

describe('contracts', () => {
  let jsonInterface = [
    {
      name: 'integrationTest',
      type: 'function',
      inputs: [{name: 'count', type: 'int'}]
    }
  ]
  let address =
    '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920'
  let options = {}
  let contract = new client.eth.Contract(jsonInterface, address, options)
  let method = contract.methods.myMethod()

  xit('eth_call', done => {
    method
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('eth_estimateGas', done => {
    client.eth
      .estimateGas({
        to: '',
        data: '',
        input: '',
        gas: '',
        gasLimit: '',
        gasPrice: '',
        value: '',
        nonce: ''
      })
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })
})
