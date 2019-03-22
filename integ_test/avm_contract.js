let test_cfg = require('./_integ_test_config.js');
let path = require('path');

//console.log("Using cfg = ", test_cfg);

let jarPath = path.join(__dirname, 'contracts', 'HelloAVM.jar')

const Web3 = require('../');
const web3 = new Web3(new Web3.providers.HttpProvider('https://api.nodesmith.io/v1/aion/avmtestnet/jsonrpc?apiKey=' + test_cfg.AVM_TEST_NS_AK));

const acc = web3.eth.accounts.privateKeyToAccount(test_cfg.AVM_TEST_PK);

let deploy = async() => {
  let data = web3.avm.contract.deploy(jarPath).args(['String'], ['Integration Test']);

  //construct a transaction
  const txObject = {
    from: acc.address,
    data: data,
    gasPrice: 10000000000,
    gas: 2000000,
    type: '0xf',
  };

  let signTx = await web3.eth.accounts.signTransaction(txObject, test_cfg.AVM_TEST_PK);
  let res = await web3.eth.sendSignedTransaction(signTx.rawTransaction);
  return res;
}

let greet = async() => {
  let data = web3.avm.contract.method('greet').inputs(['String'], ['World']).encode();

  //construct a transaction
  const txObject = {
    from: acc.address,
    to: test_cfg.AVM_TEST_CT_ADDR,
    data: data,
    gasPrice: 10000000000,
    gas: 2000000,
    type: '0xf',
  };

  let res1 = await web3.eth.call(txObject);
  let res2 = web3.avm.abi.decode(res1);
  return res2;
}

let sayHello = async() => {

  let mystring = "Hello AVM";
  let data = web3.avm.method('sayHello').encode();

  //construct a transaction
  const txObject = {
    from: acc.address,
    to: test_cfg.AVM_TEST_CT_ADDR,
    data: data,
    gasPrice: 10000000000,
    gas: 2000000,
    type: '0xf',
  };

  console.log(txObject);
  let signTx = await web3.eth.accounts.signTransaction(txObject, test_cfg.AVM_TEST_PK);
  let res = await web3.eth.sendSignedTransaction(signTx.rawTransaction);
  return res;
};

let setString = async() => {

  let mystring = "Hello AVM";
  let data = web3.avm.contract.method('setString').inputs(['String'], [mystring]).encode();

  //construct a transaction
  const txObject = {
    from: acc.address,
    to: test_cfg.AVM_TEST_CT_ADDR,
    data: data,
    gasPrice: 10000000000,
    gas: 2000000,
    type: '0xf',
  };

  console.log(txObject);
  let signTx = await web3.eth.accounts.signTransaction(txObject, test_cfg.AVM_TEST_PK);
  let res = await web3.eth.sendSignedTransaction(signTx.rawTransaction);
  return res;
};

let getString = async() => {

  //the contract method you want to call
  let data = web3.avm.contract.method('getString').encode();

  //construct a transaction
  const txObject = {
    from: acc.address,
    to: test_cfg.AVM_TEST_CT_ADDR,
    data: data,
    gasPrice: 10000000000,
    gas: 2000000,
    type: '0xf',
  };

  console.log(txObject);
  let res = await web3.eth.call(txObject);
  return web3.avm.contract.decode('String', data);
};

setString().then(getString().then(console.log));