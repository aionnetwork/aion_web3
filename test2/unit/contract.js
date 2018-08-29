/*eslint-disable no-console*/

let Contract = require('../../src/contract')
let values = require('../../src/lib/values')
let Eth = require('../../src/eth')
let {testProvider} = require('./fixtures')

let inputCases = [
  {
    name: 'bool01',
    type: 'bool',
    cases: [
      {value: false, expected: values.solidity.types.bool.zero},
      {value: true, expected: values.solidity.types.bool.one}
    ]
  },
  {
    name: 'uint01',
    type: 'uint',
    cases: []
  },
  {
    name: 'uint02',
    type: 'uint8'
  },
  {
    name: 'uint03',
    type: 'uint64[]'
  },
  {
    name: 'uint04',
    type: 'uint8[3]'
  },
  {
    name: 'uint05',
    type: 'uint8[][6]'
  },
  {
    name: 'int01',
    type: 'int'
  },
  {
    name: 'int02',
    type: 'int8'
  },
  {
    name: 'int03',
    type: 'int64[]'
  },
  {
    name: 'int04',
    type: 'int8[3]'
  },
  {
    name: 'int05',
    type: 'int8[][6]'
  },
  {
    name: 'fixed01',
    type: 'fixed'
  },
  {
    name: 'fixed02',
    type: 'fixed8'
  },
  {
    name: 'fixed03',
    type: 'fixed64[]'
  },
  {
    name: 'fixed04',
    type: 'fixed8[3]'
  },
  {
    name: 'fixed05',
    type: 'fixed8[][6]'
  },
  {
    name: 'ufixed01',
    type: 'ufixed'
  },
  {
    name: 'ufixed02',
    type: 'ufixed8'
  },
  {
    name: 'ufixed03',
    type: 'ufixed64[]'
  },
  {
    name: 'ufixed04',
    type: 'ufixed8[3]'
  },
  {
    name: 'ufixed05',
    type: 'ufixed8[][6]'
  },
  {
    name: 'address01',
    type: 'address'
  },
  {
    name: 'address02',
    type: 'address[]'
  },
  {
    name: 'address03',
    type: 'address[7]'
  },
  {
    name: 'address04',
    type: 'address[3][8]'
  },
  {
    name: 'bytes01',
    type: 'bytes'
  },
  {
    name: 'bytes02',
    type: 'bytes[]'
  },
  {
    name: 'bytes03',
    type: 'bytes[7]'
  },
  {
    name: 'bytes04',
    type: 'bytes8[3][8]'
  },
  {
    name: 'string01',
    type: 'string'
  },
  {
    name: 'string02',
    type: 'string[]'
  },
  {
    name: 'string03',
    type: 'string[7]'
  },
  {
    name: 'string04',
    type: 'string8[3][8]'
  }
]

describe('Contract', () => {
  let contract
  let jsonInterface = [
    {
      name: 'testContract',
      type: 'function',
      inputs: inputCases.map(({name, type}) => {
        return {name, type}
      })
    }
  ]
  let address =
    '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920'
  let options = {}

  it('initializes', () => {
    contract = new Contract(jsonInterface, address, options)
    contract.options.should.be.an.Object
    contract.options.jsonInterface.should.be.an.Object
  })

  it('clone', () => {
    let cloned = contract.clone()
    cloned.options.should.be.eql(contract.options)
    cloned.options.jsonInterface.should.be.eql(contract.options.jsonInterface)
  })

  it('methods.anyMethod', () => {
    let method = contract.methods.anyMethod('int', 'uint')
    method.call.should.be.a.Function
    method.send.should.be.a.Function
    method.estimateGas.should.be.a.Function
    method.encodeABI.should.be.a.Function
  })

  it('deploy', done => {
    let count = 0

    function deployDone() {
      count += 1
      console.log('deployDone', count)

      if (count === 1) {
        return done()
      }
    }

    let deployEth = new Eth(testProvider)
    let deployContract = new deployEth.Contract(jsonInterface, address, options)
    let deployAccount = deployEth.accounts.create()

    deployContract
      .deploy({
        data: '0x123456',
        arguments: [123, 'four', 'five']
      })
      .send(
        {
          from: deployAccount.address,
          gas: 1000000,
          gasPrice: 1000000
        },
        (err, res) => {
          if (err !== null && err !== undefined) {
            console.error('error sending from deploy', err)
            return done(err)
          }
          console.log('send callback res', res)
          deployDone()
        }
      )
      .on('error', err => {
        console.error('error from deploy event', err)
        done(err)
      })
      .on('transactionHash', transactionHash => {
        transactionHash.should.be.a.String
        deployDone()
      })
      /*.on('receipt', receipt => {
        receipt.should.be.a.String
        deployDone()
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        confirmationNumber.should.be.a.Number
        receipt.should.be.a.String
        deployDone()
      })*/
      .then(contract => {
        contract.should.be.an.Object
        contract.options.address.should.be.a.String
        deployDone()
      })
  })
})
