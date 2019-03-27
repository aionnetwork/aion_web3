let test_cfg = require('./_integ_test_config.js');
let should = require('should');
let path = require('path');
let BN = require('bn.js');
let Web3 = require('../');

let jarPath = path.join(__dirname, 'contracts', 'HelloAvm-1.0-SNAPSHOT.jar')
let web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
let acc = web3.eth.accounts.privateKeyToAccount(test_cfg.AVM_TEST_PK);

let testData = {
  inputs: [{
    string: 'She sells sea shells by the seashore',
    greet: 'World',
    address: '0x0f8bde823790ac79795ec27ef2bd6edb53e69c259701bfba424e0265a8135ecf',
    num1: 10,
    num2: 7,
    dec1: 4.75,
    dec2: 2.5,
    true: true,
    false: false
  }],
  nonArrayReturns: [{
    byte: 1,
    char: 'S',
    greet: 'Hello World!',
    address: '0x0f8bde823790ac79795ec27ef2bd6edb53e69c259701bfba424e0265a8135ecf',
    addition: 17,
    multiplication: 11.875,
    subtraction: 3,
    division: 1.9,
    modulus: 3,
    true: true,
    false: false
  }],
  arrayReturns1: [{

  }],
  arrayReturns2: [{

  }]
};

console.log("Using cfg = ", test_cfg);

let callMethod = async(method, types, values, returnType) => {
  if(types === undefined) types = [];
  if(values === undefined) values = [];

  let data = web3.avm.contract.method(method).inputs(types, values).encode();

  let txObject = {
    from: acc.address,
    to: test_cfg.AVM_TEST_CT_ADDR,
    data: data,
    gasPrice: test_cfg.GAS_PRICE,
    gas: test_cfg.GAS,
    type: '0xf'
  };

  if(method == 'sayHello') {
    let signTx = await web3.eth.accounts.signTransaction(txObject, test_cfg.AVM_TEST_PK);
    let res = await web3.eth.sendSignedTransaction(signTx.rawTransaction);
    return res;
  } else {
    let res1 = await web3.eth.call(txObject);
    let res2 = web3.avm.contract.decode(returnType, res1);
    return res2;
  }
}

// Deploy an AVM Contract 
let deploy = async() => {
  let data = web3.avm.contract.deploy(jarPath).args(['String'], ['Initialized']).init();

  //construct a transaction
  const txObject = {
    from: acc.address,
    data: data,
    gasPrice: test_cfg.GAS_PRICE,
    gas: test_cfg.GAS,
    type: '0xf'
  };

  let unlock = await web3.eth.personal.unlockAccount(test_cfg.TEST_ACCT_ADDR, test_cfg.TEST_ACCT_PW, 600);
  let res = await web3.eth.sendTransaction(txObject);
  return res;
}

describe('avm_contract', () => {

  it('deploying contract..', done => {
    deploy().then(res => {
      test_cfg.AVM_TEST_CT_ADDR = res.contractAddress;
      res.status.should.eql(true);
      done();
    }).catch(err => {
      done(err);
    });
  })

  it('sayHello', done => {
    callMethod('sayHello').then(res => {
      console.log(res);
      done();
    }).catch(err => {
      done(err);
    });
  })

});