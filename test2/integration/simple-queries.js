/*eslint-disable no-console*/

let Web3 = require('../../src/index')
let client = new Web3('http://127.0.0.1:8545')
let {toBuffer} = require('../../src/lib/formats')

let hexFormatter = val => toBuffer(val).toString('hex')

let methods = [
  {
    name: 'web3_sha3',
    call: 'web3_sha3',
    inputFormatter: hexFormatter
  },
  {
    name: 'eth_submitHashrate',
    call: 'eth_submitHashrate'
    // params: 1,
    // inputFormatter: hexFormatter
  },
  {
    name: 'eth_getBlockTransactionCountByNumber',
    call: 'eth_getBlockTransactionCountByNumber',
    params: 1
  },
  {
    name: 'eth_getBlockTransactionCountByHash',
    call: 'eth_getBlockTransactionCountByHash'
  },
  {
    name: 'eth_getBlockByHash',
    call: 'eth_getBlockByHash'
  },
  {
    name: 'eth_getBlockByNumber',
    call: 'eth_getBlockByNumber',
    params: 1
  },
  {
    name: 'eth_getTransactionByBlockHashAndIndex',
    call: 'eth_getTransactionByBlockHashAndIndex'
  },
  {
    name: 'eth_getTransactionByBlockNumberAndIndex',
    call: 'eth_getTransactionByBlockNumberAndIndex'
  },
  {
    name: 'eth_newFilter',
    call: 'eth_newFilter'
  },
  {
    name: 'eth_newBlockFilter',
    call: 'eth_newBlockFilter'
  },
  {
    name: 'eth_newPendingTransactionFilter',
    call: 'eth_newPendingTransactionFilter'
  },
  {
    name: 'eth_uninstallFilter',
    call: 'eth_uninstallFilter'
  },
  {
    name: 'eth_getFilterChanges',
    call: 'eth_getFilterChanges'
  },
  {
    name: 'debug_getBlocksByNumber',
    call: 'debug_getBlocksByNumber'
  },
  {name: 'priv_peers', call: 'priv_peers'},
  {name: 'priv_p2pConfig', call: 'priv_p2pConfig'},
  {name: 'priv_getPendingTransactions', call: 'priv_getPendingTransactions'},
  {name: 'priv_getPendingSize', call: 'priv_getPendingSize'},
  {name: 'priv_dumpTransaction', call: 'priv_dumpTransaction'},
  {name: 'priv_dumpBlockByHash', call: 'priv_dumpBlockByHash'},
  {name: 'priv_dumpBlockByNumber', call: 'priv_dumpBlockByNumber'},
  {name: 'priv_syncPeers', call: 'priv_syncPeers'},
  {name: 'priv_config', call: 'priv_config'},
  {name: 'ops_getAccountState', call: 'ops_getAccountState'},
  {name: 'ops_getChainHeadView', call: 'ops_getChainHeadView'},
  {
    name: 'ops_getChainHeadViewBestBlock',
    call: 'ops_getChainHeadViewBestBlock'
  },
  {name: 'ops_getTransaction', call: 'ops_getTransaction'},
  {name: 'ops_getBlock', call: 'ops_getBlock'},
  {name: 'stratum_getinfo', call: 'stratum_getinfo'},
  {name: 'stratum_getwork', call: 'stratum_getwork'},
  {name: 'stratum_dumpprivkey', call: 'stratum_dumpprivkey'},
  {name: 'stratum_validateaddress', call: 'stratum_validateaddress'},
  {name: 'stratum_getdifficulty', call: 'stratum_getdifficulty'},
  {name: 'stratum_getmininginfo', call: 'stratum_getmininginfo'},
  {name: 'stratum_submitblock', call: 'stratum_submitblock'},
  {
    name: 'stratum_getHeaderByBlockNumber',
    call: 'stratum_getHeaderByBlockNumber'
  },
  {name: 'stratum_getMinerStats', call: 'stratum_getMinerStats'}
]

let hashRate
let coinbase
let blockNumber

describe('simple rpc queries', () => {
  it('extend with secret methods', () => {
    client.extend({methods})
  })

  it('web3_clientVersion', done => {
    client.eth
      .getNodeInfo()
      .then(res => {
        res.startsWith('Aion').should.be.exactly(true)
        done()
      })
      .catch(done)
  })

  it('web3_sha3', done => {
    client
      .web3_sha3('aion')
      .then(res => {
        res.should.be.exactly(
          '0x898e05fa6760e34b4d78459b9b2c58838cc62a09cc26298cfce9df99d3f7d722'
        )
        done()
      })
      .catch(done)
  })

  it('net_version', done => {
    client.net
      .getId()
      .then(res => {
        res.should.be.a.Number
        done()
      })
      .catch(done)
  })

  it('net_peerCount', done => {
    client.net
      .getPeerCount()
      .then(res => {
        res.should.be.a.Number
        done()
      })
      .catch(done)
  })

  it('net_listening', done => {
    client.net
      .isListening()
      .then(res => {
        res.should.be.a.Boolean
        done()
      })
      .catch(done)
  })

  it('eth_protocolVersion', done => {
    client.eth
      .getProtocolVersion()
      .then(res => {
        res.should.be.a.Number
        done()
      })
      .catch(done)
  })

  it('eth_syncing', done => {
    client.eth
      .isSyncing()
      .then(res => {
        res.should.be.a.Boolean
        done()
      })
      .catch(done)
  })

  it('eth_coinbase', done => {
    client.eth
      .getCoinbase()
      .then(res => {
        res.should.be.a.String
        coinbase = res
        done()
      })
      .catch(done)
  })

  it('eth_mining', done => {
    client.eth
      .isMining()
      .then(res => {
        res.should.be.a.Boolean
        done()
      })
      .catch(done)
  })

  it('eth_hashrate', done => {
    client.eth
      .getHashrate()
      .then(res => {
        res.should.be.a.Number
        hashRate = res
        done()
      })
      .catch(done)
  })

  xit('eth_submitHashrate', done => {
    client
      .eth_submitHashrate(hashRate)
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  it('eth_gasPrice', done => {
    client.eth
      .getGasPrice()
      .then(res => {
        res.should.be.a.Number
        done()
      })
      .catch(done)
  })

  it('eth_accounts', done => {
    client.eth
      .getAccounts()
      .then(res => {
        res.should.be.an.Array
        done()
      })
      .catch(done)
  })

  it('eth_blockNumber', done => {
    client.eth
      .getBlockNumber()
      .then(res => {
        res.should.be.a.Number
        done()
      })
      .catch(done)
  })

  it('eth_getBalance', done => {
    client.eth
      .getBalance(coinbase)
      .then(res => {
        res.should.be.a.Number
        done()
      })
      .catch(done)
  })

  it('eth_getStorageAt', done => {
    client.eth
      .getStorageAt(coinbase, 1)
      .then(res => {
        res.should.be.a.String
        done()
      })
      .catch(done)
  })

  it('eth_blockNumber', done => {
    client.eth
      .getBlockNumber()
      .then(res => {
        res.should.be.a.Number
        blockNumber = res
        done()
      })
      .catch(done)
  })

  it('eth_getTransactionCount', done => {
    client.eth
      .getTransactionCount(coinbase, 'latest')
      .then(res => {
        res.should.be.a.Number
        done()
      })
      .catch(done)
  })

  it('eth_getBlockTransactionCountByNumber', done => {
    client
      .eth_getBlockTransactionCountByNumber(blockNumber)
      .then(res => {
        res.startsWith('0x').should.be.exactly(true)
        done()
      })
      .catch(done)
  })

  xit('eth_getBlockTransactionCountByHash (internal error, need correct value)', done => {
    client
      .eth_getBlockTransactionCountByHash('??')
      .then(res => {
        res.should.be.a.Number
        done()
      })
      .catch(done)
  })

  it('eth_getCode', done => {
    client.eth
      .getCode(coinbase)
      .then(res => {
        res.should.be.a.String
        done()
      })
      .catch(done)
  })

  xit('eth_getBlockByHash', done => {
    client
      .eth_getBlockByHash('??')
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  it('eth_getBlockByNumber', done => {
    client
      .eth_getBlockByNumber(blockNumber)
      .then(res => {
        res.should.be.a.String
        done()
      })
      .catch(done)
  })

  xit('eth_getTransactionByHash', done => {
    client.eth
      .getTransactionByHash('??')
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('eth_getTransactionByBlockHashAndIndex', done => {
    client
      .eth_getTransactionByBlockHashAndIndex('??')
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('eth_getTransactionByBlockNumberAndIndex', done => {
    client
      .eth_getTransactionByBlockNumberAndIndex('??')
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('eth_getTransactionReceipt', done => {
    client.eth
      .getTransactionReceipt('??')
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  it('eth_getCompilers', done => {
    client.eth
      .getCompilers()
      .then(res => {
        res.should.be.an.Array
        done()
      })
      .catch(done)
  })

  xit('eth_compileSolidity (intermittent)', done => {
    let source = `
    contract Ticker {
       uint ticks;
    }`
    client.eth.compile
      .solidity(source)
      .then(res => {
        res.should.be.an.Object
        // console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('eth_newFilter (params?)', done => {
    client
      .eth_newFilter({})
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  it('eth_newBlockFilter', done => {
    client
      .eth_newBlockFilter({})
      .then(res => {
        res.should.be.a.String
        done()
      })
      .catch(done)
  })

  it('eth_newPendingTransactionFilter', done => {
    client
      .eth_newPendingTransactionFilter({})
      .then(res => {
        res.should.be.a.String
        done()
      })
      .catch(done)
  })

  xit('eth_uninstallFilter', done => {
    client
      .eth_uninstallFilter({})
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('eth_getFilterChanges (params?)', done => {
    client
      .eth_getFilterChanges({})
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('eth_getLogs', done => {
    client.eth
      .getPastLogs({
        blockNumber: '',
        topics: ['one', 'two']
      })
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('personal_unlockAccount', done => {
    client.eth.personal
      .unlockAccount(
        '0xA0fb56Fe36d74f09856fA7a05f754Af983F677e12dEf73FD0133AD39258C9c25'
      )
      .then(res => {
        // res.should.be.a.Boolean
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('personal_lockAccount', done => {
    client.eth.personal
      .lockAccount(
        '0xA0fb56Fe36d74f09856fA7a05f754Af983F677e12dEf73FD0133AD39258C9c25'
      )
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('personal_newAccount', done => {
    client.eth.personal
      .newAccount()
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('debug_getBlocksByNumber', done => {
    client
      .debug_getBlocksByNumber(blockNumber)
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('priv_peers', done => {
    client
      .priv_peers()
      .then(res => {
        console.log('res', res)
        res.should.be.a.Number
        done()
      })
      .catch(done)
  })

  xit('priv_p2pConfig', done => {
    client
      .priv_p2pConfig()
      .then(res => {
        console.log('res', res)
        done()
      })
      .catch(done)
  })

  xit('priv_getPendingTransactions', done => {
    client
      .priv_getPendingTransactions()
      .then(res => {
        console.log('priv_getPendingTransactions res', res)
        done()
      })
      .catch(done)
  })

  xit('priv_getPendingSize', done => {
    client
      .priv_getPendingSize()
      .then(res => {
        console.log('priv_getPendingSize res', res)
        done()
      })
      .catch(done)
  })

  xit('priv_dumpTransaction', done => {
    client
      .priv_dumpTransaction()
      .then(res => {
        console.log('priv_dumpTransaction res', res)
        done()
      })
      .catch(done)
  })

  xit('priv_dumpBlockByHash', done => {
    client
      .priv_dumpBlockByHash()
      .then(res => {
        console.log('priv_dumpBlockByHash res', res)
        done()
      })
      .catch(done)
  })

  xit('priv_dumpBlockByNumber', done => {
    client
      .priv_dumpBlockByNumber()
      .then(res => {
        console.log('priv_dumpBlockByNumber res', res)
        done()
      })
      .catch(done)
  })

  xit('priv_shortStats', done => {
    client
      .priv_shortStats()
      .then(res => {
        console.log('priv_shortStats res', res)
        done()
      })
      .catch(done)
  })

  xit('priv_syncPeers', done => {
    client
      .priv_syncPeers()
      .then(res => {
        console.log('priv_syncPeers res', res)
        done()
      })
      .catch(done)
  })

  xit('priv_config', done => {
    client
      .priv_config()
      .then(res => {
        console.log('priv_config res', res)

        done()
      })
      .catch(done)
  })

  xit('ops_getAccountState', done => {
    client
      .ops_getAccountState()
      .then(res => {
        console.log('ops_getAccountState res', res)

        done()
      })
      .catch(done)
  })

  xit('ops_getChainHeadView', done => {
    client
      .ops_getChainHeadView()
      .then(res => {
        console.log('ops_getChainHeadView res', res)

        done()
      })
      .catch(done)
  })

  xit('ops_getChainHeadViewBestBlock', done => {
    client
      .ops_getChainHeadViewBestBlock()
      .then(res => {
        console.log('ops_getChainHeadViewBestBlock res', res)

        done()
      })
      .catch(done)
  })

  xit('ops_getTransaction', done => {
    client
      .ops_getTransaction()
      .then(res => {
        console.log('ops_getTransaction res', res)

        done()
      })
      .catch(done)
  })

  xit('ops_getBlock', done => {
    client
      .ops_getBlock()
      .then(res => {
        console.log('ops_getBlock res', res)

        done()
      })
      .catch(done)
  })

  xit('stratum_getinfo', done => {
    client
      .stratum_getinfo()
      .then(res => {
        console.log('stratum_getinfo res', res)
        done()
      })
      .catch(done)
  })

  xit('stratum_getwork', done => {
    client
      .stratum_getwork()
      .then(res => {
        console.log('stratum_getwork res', res)

        done()
      })
      .catch(done)
  })

  xit('stratum_dumpprivkey', done => {
    client
      .stratum_dumpprivkey()
      .then(res => {
        console.log('stratum_dumpprivkey res', res)

        done()
      })
      .catch(done)
  })

  xit('stratum_validateaddress', done => {
    client
      .stratum_validateaddress(coinbase)
      .then(res => {
        console.log('stratum_validateaddress res', res)

        done()
      })
      .catch(done)
  })

  xit('stratum_getdifficulty', done => {
    client
      .stratum_getdifficulty()
      .then(res => {
        console.log('stratum_getdifficulty res', res)

        done()
      })
      .catch(done)
  })

  xit('stratum_getmininginfo', done => {
    client
      .stratum_getmininginfo()
      .then(res => {
        console.log('stratum_getmininginfo res', res)

        done()
      })
      .catch(done)
  })

  xit('stratum_submitblock', done => {
    client
      .stratum_submitblock()
      .then(res => {
        console.log('stratum_submitblock res', res)

        done()
      })
      .catch(done)
  })

  xit('stratum_getHeaderByBlockNumber', done => {
    client
      .stratum_getHeaderByBlockNumber(blockNumber)
      .then(res => {
        console.log('stratum_getHeaderByBlockNumber res', res)

        done()
      })
      .catch(done)
  })

  xit('stratum_getHeaderByBlockNumber', done => {
    client
      .stratum_getHeaderByBlockNumber(blockNumber)
      .then(res => {
        console.log('stratum_getHeaderByBlockNumber res', res)

        done()
      })
      .catch(done)
  })

  xit('stratum_getMinerStats', done => {
    client
      .stratum_getMinerStats()
      .then(res => {
        console.log('stratum_getMinerStats res', res)

        done()
      })
      .catch(done)
  })
})
