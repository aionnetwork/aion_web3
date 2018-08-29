/*

these aren't realistic tests yet but they pass

*/

let {
  outputBigNumberFormatter,
  isPredefinedBlockNumber,
  inputDefaultBlockNumberFormatter,
  inputBlockNumberFormatter,
  inputCallFormatter,
  inputTransactionFormatter,
  inputSignFormatter,
  outputTransactionFormatter,
  outputTransactionReceiptFormatter,
  outputBlockFormatter,
  inputLogFormatter,
  outputLogFormatter,
  inputPostFormatter,
  outputPostFormatter,
  inputAddressFormatter,
  outputSyncingFormatter
} = require('../../src/formatters')

describe('formatters', () => {
  it('outputBigNumberFormatter', () => {
    outputBigNumberFormatter(0).should.be.exactly('0')
  })

  it('isPredefinedBlockNumber', () => {
    isPredefinedBlockNumber('latest').should.be.exactly(true)
    isPredefinedBlockNumber('pending').should.be.exactly(true)
    isPredefinedBlockNumber('earliest').should.be.exactly(true)
    isPredefinedBlockNumber(5).should.be.exactly(false)
    isPredefinedBlockNumber('5').should.be.exactly(false)
  })

  it('inputDefaultBlockNumberFormatter', () => {
    inputDefaultBlockNumberFormatter(0).should.be.exactly('0x0')
  })

  it('inputBlockNumberFormatter', () => {
    inputBlockNumberFormatter(0).should.be.exactly('0x0')
  })

  it('inputCallFormatter', () => {
    inputCallFormatter({
      from:
        '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920',
      to: '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920'
    }).should.be.eql({
      from:
        '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920',
      to: '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920'
    })
  })

  it('inputTransactionFormatter', () => {
    inputTransactionFormatter({
      from:
        '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920',
      to: '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920'
    }).should.be.eql({
      from:
        '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920',
      to: '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920'
    })
  })

  it('inputSignFormatter', () => {
    inputSignFormatter('six').should.be.exactly('0x736978')
  })

  it('outputTransactionFormatter', () => {
    outputTransactionFormatter({
      blockNumber: 1,
      transactionIndex: 2,
      nonce: 3,
      gas: 4,
      gasPrice: 5,
      value: 6,
      from:
        '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920',
      to: '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920'
    }).should.be.eql({
      blockNumber: 1,
      transactionIndex: 2,
      nonce: 3,
      gas: 4,
      gasPrice: '5',
      value: '6',
      from:
        '0xa07C95Cc8729a0503c5ad50Eb37Ec8a27cD22D65dE3BB225982Ec55201366920',
      to: '0xa07C95Cc8729a0503c5ad50Eb37Ec8a27cD22D65dE3BB225982Ec55201366920'
    })
  })

  it('outputTransactionReceiptFormatter', () => {
    outputTransactionReceiptFormatter({
      blockNumber: 1,
      transactionIndex: 2,
      cumulativeGasUsed: 3,
      gasUsed: 4,
      logs: 5,
      contractAddress:
        '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920'
    }).should.be.eql({
      blockNumber: 1,
      transactionIndex: 2,
      cumulativeGasUsed: 3,
      gasUsed: 4,
      logs: 5,
      contractAddress:
        '0xa07C95Cc8729a0503c5ad50Eb37Ec8a27cD22D65dE3BB225982Ec55201366920'
    })
  })

  it('outputBlockFormatter', () => {
    outputBlockFormatter({
      gasLimit: 1,
      gasUsed: 2,
      size: 3,
      timestamp: 4,
      number: 5,
      difficulty: 6,
      totalDifficulty: 7,
      transactions: 8,
      miner:
        '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920'
    }).should.be.eql({
      gasLimit: 1,
      gasUsed: 2,
      size: 3,
      timestamp: 4,
      number: 5,
      difficulty: '6',
      totalDifficulty: '7',
      transactions: 8,
      miner:
        '0xa07C95Cc8729a0503c5ad50Eb37Ec8a27cD22D65dE3BB225982Ec55201366920'
    })
  })

  it('inputLogFormatter', () => {
    inputLogFormatter({
      topics: ['one', 'two'],
      address:
        '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920'
    }).should.be.eql({
      topics: ['0x6f6e65', '0x74776f'],
      address:
        '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920'
    })
  })

  it('outputLogFormatter', () => {
    outputLogFormatter({
      logIndex: 1,
      blockHash: 2,
      transactionHash: 3,
      id: 4,
      blockNumber: 5,
      transactionIndex: 6,
      address:
        '0xa07c95cc8729a0503c5ad50eb37ec8a27cd22d65de3bb225982ec55201366920'
    }).should.be.eql({
      logIndex: 1,
      blockHash: 2,
      transactionHash: 3,
      id: 4,
      blockNumber: 5,
      transactionIndex: 6,
      address:
        '0xa07C95Cc8729a0503c5ad50Eb37Ec8a27cD22D65dE3BB225982Ec55201366920'
    })
  })

  it('inputPostFormatter', () => {
    inputPostFormatter({
      ttl: 1,
      workToProve: 2,
      priority: 3,
      topics: ['one', 'two']
    }).should.be.eql({
      ttl: '0x1',
      workToProve: '0x2',
      priority: '0x3',
      topics: ['0x6f6e65', '0x74776f']
    })
  })

  it('outputPostFormatter', () => {
    outputPostFormatter({
      expiry: '0x1',
      sent: '0x2',
      ttl: '0x3',
      workProved: '0x4',
      payloadRaw: '0x5',
      payload: '0x6',
      topics: ['0x6f6e65', '0x74776f']
    }).should.be.eql({
      expiry: 1,
      sent: 2,
      ttl: 3,
      workProved: 4,
      payloadRaw: '0x5',
      payload: '0x6',
      topics: ['one', 'two']
    })
  })

  it('inputAddressFormatter', () => {
    inputAddressFormatter(
      'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'
    ).should.be.exactly(
      '0x00000000000000000000000000c5496aee77c1ba1f0854206a26dda82a81d6d8'
    )
  })

  it('outputSyncingFormatter', () => {
    outputSyncingFormatter({
      startingBlock: 1,
      currentBlock: 2,
      highestBlock: 3,
      knownStates: 4,
      pulledStates: 5
    }).should.be.eql({
      startingBlock: 1,
      currentBlock: 2,
      highestBlock: 3,
      knownStates: 4,
      pulledStates: 5
    })
  })
})
