let test_cfg = require('./_integ_test_config.js');
let should = require('should');
let path = require('path');
let BN = require('bn.js');
let Web3 = require('../');

let jarPath = path.join(__dirname, 'contracts', 'HelloAVM-1.0-SNAPSHOT.jar')
let web3 = new Web3(new Web3.providers.HttpProvider('https://api.nodesmith.io/v1/aion/avmtestnet/jsonrpc?apiKey=2375791dd8d7455fac3d91a392424277')); 
let acc = web3.eth.accounts.privateKeyToAccount(test_cfg.AVM_TEST_PK);

console.log("Using cfg = ", test_cfg);
console.log("ACC: ", acc.address);

let tests = [{
  name: 'setString',
  type: 'send',
  inputs: 1,
  inputTypes: [ 'string' ], 
  inputValues: [ 'Hello World ']
}, {
  name: 'getString',
  type: 'send',
  inputs: 0,
  returnType: 'string'
}, {
  name: 'getInt1',
  type: 'call',
  inputs: 1,
  inputTypes: [ 'int' ],
  inputValues: [ 1 ],
  returnType: 'int'
}, {
  name: 'getInt1DArray',
  type: 'call',
  inputs: 0,
  returnType: 'int[]'
}, {
  name: 'getInt2DArray',
  type: 'call',
  inputs: 0,
  returnType: 'int[][]'
}, {
  name: 'printInt1DArray',
  type: 'send',
  inputs: 0
}, {
  name: 'printInt2DArray',
  type: 'send',
  inputs: 0
}];

// Deploy an AVM Contract 
let deploy = async() => {
  let data = web3.avm.contract.deploy(jarPath).args([  'string', 'int[]', 'int[][]'  ], [  'PLAT4LIFE', [1, 2, 3], [[1, 2, 3], [4, 5, 6]]  ]).init();

  //construct a transaction
  const txObject = {
    from: acc.address,
    data: data,
    gasPrice: test_cfg.GAS_PRICE,
    gas: test_cfg.AVM_TEST_CT_DEPLOY_GAS,
    type: '0x2'
  };

  let signedTx = await web3.eth.accounts.signTransaction(txObject, test_cfg.AVM_TEST_PK);
  let res = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return res;
}

let methodCallWithInputs = async(methodName, inputTypes, inputValues, returnType) => {
  let data = web3.avm.contract.method(methodName).inputs(inputTypes, inputValues).encode();

  //construct a transaction
  const txObject = {
    from: acc.address,
    to: test_cfg.AVM_TEST_CT_ADDR,
    data: data,
    gasPrice: test_cfg.GAS_PRICE,
    gas: test_cfg.AVM_TEST_CT_TXN_GAS,
    type: '0xf'
  };

  let ethRes = await web3.eth.call(txObject);
  let avmRes = await web3.avm.contract.decode(returnType, ethRes);
  return avmRes;
}

let methodCallWithoutInputs = async(methodName, returnType) => {
  let data = web3.avm.contract.method(methodName).encode();

  //construct a transaction
  const txObject = {
    from: acc.address,
    to: test_cfg.AVM_TEST_CT_ADDR,
    data: data,
    gasPrice: test_cfg.GAS_PRICE,
    gas: test_cfg.AVM_TEST_CT_TXN_GAS,
    type: '0xf'
  };

  let ethRes = await web3.eth.call(txObject);
  let avmRes = await web3.avm.contract.decode(returnType, ethRes);
  return avmRes;
}

let methodSendWithInputs = async(methodName, inputTypes, inputValues) => {
  let data = web3.avm.contract.method(methodName).inputs(inputTypes, inputValues).encode();

  //construct a transaction
  const txObject = {
    from: acc.address,
    to: test_cfg.AVM_TEST_CT_ADDR,
    //data: data,
    gasPrice: test_cfg.GAS_PRICE,
    gas: test_cfg.AVM_TEST_CT_TXN_GAS,
    type: '0xf'
  };

  let unlock = await web3.eth.personal.unlockAccount(test_cfg.TEST_ACCT_ADDR, test_cfg.TEST_ACCT_PW, 600);
  let res = await web3.eth.sendTransaction(txObject);
  return res;
}

let methodSendWithoutInputs = async(methodName) => {
  let data = web3.avm.contract.method(methodName).encode();

  //construct a transaction
  const txObject = {
    from: acc.address,
    to: test_cfg.AVM_TEST_CT_ADDR,
    data: data,
    gasPrice: test_cfg.GAS_PRICE,
    gas: test_cfg.AVM_TEST_CT_TXN_GAS,
    type: '0xf'
  };

  let unlock = await web3.eth.personal.unlockAccount(test_cfg.TEST_ACCT_ADDR, test_cfg.TEST_ACCT_PW, 600);
  let res = await web3.eth.sendTransaction(txObject);
  return res;
}

describe('avm_contract', () => {

  before(done => {
    if(test_cfg.TEST_ACCT_ADDR.length == 0 ) { 
        done(Error("Error during setup.  No test account address was configured."));
    }
    done();
  });

  it('deploying contract..', done => {
    deploy().then(res => {
      test_cfg.AVM_TEST_CT_ADDR = res.contractAddress;
      res.status.should.eql(true);
      done();
    }).catch(err => {
      done(err);
    });
  });
});