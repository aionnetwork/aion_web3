let ethRpcCases = [
  /*

  ETH calls

  */

  {
    mod: 'eth',
    name: 'getNodeInfo',
    call: 'web3_clientVersion',
    expected: 'Aion(J)/v0.2.8.eff72bb1/Linux/Java-10.0.1'
  },
  {
    mod: 'eth',
    name: 'getProtocolVersion',
    call: 'eth_protocolVersion',
    params: 0,
    expected: '0'
  },
  {
    mod: 'eth',
    name: 'getCoinbase',
    call: 'eth_coinbase',
    params: 0,
    expected:
      '0x0000000000000000000000000000000000000000000000000000000000000000'
  },
  {
    mod: 'eth',
    name: 'isMining',
    call: 'eth_mining',
    params: 0,
    expected: false
  },
  {
    mod: 'eth',
    name: 'getHashrate',
    call: 'eth_hashrate',
    params: 0,
    expected: '0.0'
  },
  {
    mod: 'eth',
    name: 'isSyncing',
    call: 'eth_syncing',
    params: 0
  },
  {
    mod: 'eth',
    name: 'getGasPrice',
    call: 'eth_gasPrice',
    params: 0,
    expected: '10000000000'
  },
  {
    mod: 'eth',
    name: 'getAccounts',
    call: 'eth_accounts',
    params: 0,
    expected: []
  },
  {
    mod: 'eth',
    name: 'getBlockNumber',
    call: 'eth_blockNumber',
    params: 0,
    expected: '54483'
  },
  {
    mod: 'eth',
    name: 'getBalance',
    call: 'eth_getBalance',
    params: 2
  },
  {
    mod: 'eth',
    name: 'getStorageAt',
    call: 'eth_getStorageAt',
    params: 3
  },
  {
    mod: 'eth',
    name: 'getCode',
    call: 'eth_getCode',
    params: 2
  },
  {
    mod: 'eth',
    name: 'getBlockByHash',
    call: 'eth_getBlockByHash',
    params: 2
  },
  {
    mod: 'eth',
    name: 'getBlockByNumber',
    call: 'eth_getBlockByNumber',
    params: 2
  },
  {
    mod: 'eth',
    name: 'getUncleByBlockHashAndIndex',
    call: 'eth_getUncleByBlockHashAndIndex',
    params: 2
  },
  {
    mod: 'eth',
    name: 'getUncleByBlockNumberAndIndex',
    call: 'eth_getUncleByBlockNumberAndIndex',
    params: 2
  },
  {
    mod: 'eth',
    name: 'getBlockTransactionCountByHash',
    call: 'eth_getBlockTransactionCountByHash',
    params: 1
  },
  {
    mod: 'eth',
    name: 'getBlockTransactionCountByNumber',
    call: 'eth_getBlockTransactionCountByNumber',
    params: 1
  },
  {
    mod: 'eth',
    name: 'getUncleCountByBlockHash',
    call: 'eth_getUncleCountByBlockHash',
    params: 1
  },
  {
    mod: 'eth',
    name: 'getUncleCountByBlockNumber',
    call: 'eth_getUncleCountByBlockNumber',
    params: 1
  },
  {
    mod: 'eth',
    name: 'getTransaction',
    call: 'eth_getTransactionByHash',
    params: 1
  },
  {
    mod: 'eth',
    name: 'getTransactionFromBlockHashAndIndex',
    call: 'eth_getTransactionByBlockHashAndIndex',
    params: 2
  },
  {
    mod: 'eth',
    name: 'getTransactionByBlockNumberAndIndex',
    call: 'eth_getTransactionByBlockNumberAndIndex',
    params: 2
  },
  {
    mod: 'eth',
    name: 'getTransactionReceipt',
    call: 'eth_getTransactionReceipt',
    params: 1
  },
  {
    mod: 'eth',
    name: 'getTransactionCount',
    call: 'eth_getTransactionCount',
    params: 2,
    expected: '1'
  },
  {
    mod: 'eth',
    name: 'sendSignedTransaction',
    call: 'eth_sendRawTransaction',
    params: 1,
    expected:
      '0xf79a1c9ff9a3e39b7e6383b009c84f7826841406b1fc4b2cc87ee0686cb31a74'
  },
  {
    mod: 'eth',
    name: 'signTransaction',
    call: 'eth_signTransaction',
    params: 1
  },
  {
    mod: 'eth',
    name: 'sendTransaction',
    call: 'eth_sendTransaction',
    params: 1
  },
  {
    mod: 'eth',
    name: 'sign',
    call: 'eth_sign',
    params: 2
  },
  {
    mod: 'eth',
    name: 'call',
    call: 'eth_call',
    params: 2
  },
  {
    mod: 'eth',
    name: 'estimateGas',
    call: 'eth_estimateGas',
    params: 1
  },
  {
    mod: 'eth',
    name: 'getCompilers',
    call: 'eth_getCompilers',
    params: 0
  },
  {
    mod: 'eth',
    name: 'compile.solidity',
    call: 'eth_compileSolidity',
    params: 1
  },
  {
    mod: 'eth',
    name: 'compile.lll',
    call: 'eth_compileLLL',
    params: 1
  },
  {
    mod: 'eth',
    name: 'compile.serpent',
    call: 'eth_compileSerpent',
    params: 1
  },
  {
    mod: 'eth',
    name: 'submitWork',
    call: 'eth_submitWork',
    params: 3
  },
  {
    mod: 'eth',
    name: 'getWork',
    call: 'eth_getWork',
    params: 0
  },
  {
    mod: 'eth',
    name: 'getPastLogs',
    call: 'eth_getLogs',
    params: 1
  },

  /*

  NET calls

  */

  {
    name: 'getId',
    call: 'net_version',
    params: 0,
    expected: '1'
  }
]

module.exports = ethRpcCases
