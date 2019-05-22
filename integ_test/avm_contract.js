let test_cfg = require('./_integ_test_config.js');
let should = require('should');
let path = require('path');
let BN = require('bn.js');
let Web3 = require('../');

let jarPath = path.join(__dirname, 'contracts', 'Counter.jar')
let web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.1.69:9545'));
let acc = web3.eth.accounts.privateKeyToAccount(test_cfg.AVM_TEST_PK);

//console.log("Using cfg = ", test_cfg);
//console.log("ACC: ", acc.address);

var chai = require('chai');
var assert = chai.assert;

let tests = [{
  name: 'incrementCounter',
  type: 'send',
  inputs: 1,
  inputTypes: ['int'], 
  inputValues: [5476545]
}, {
  name: 'decrementCounter',
  type: 'send',
  inputs: 1,
  inputTypes: [ 'int' ], 
  inputValues: [ 30000000 ]
}, {
  name: 'getCount',
  type: 'call',
  inputs: 0,
  returnType: 'int'
}];

// Deploy an AVM Contract 
let deploy = async() => {
  let data = web3.avm.contract.deploy(jarPath).args([  'int'  ], [  100  ]).init();

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
    gas: test_cfg.AVM_TEST_CT_TXN_GAS
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
    gas: test_cfg.AVM_TEST_CT_TXN_GAS
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
    data: data,
    gasPrice: test_cfg.GAS_PRICE,
    gas: test_cfg.AVM_TEST_CT_TXN_GAS,
    type: '0x1'
  };

  let signedTx = await web3.eth.accounts.signTransaction(txObject, test_cfg.AVM_TEST_PK);
  let res = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  

  //let unlock = await web3.eth.personal.unlockAccount(test_cfg.TEST_ACCT_ADDR, test_cfg.TEST_ACCT_PW, 6000);
  //console.log(unlock);
  //let res = await web3.eth.sendTransaction(txObject);
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
    type: '0x1'
  };

  let unlock = await web3.eth.personal.unlockAccount(test_cfg.TEST_ACCT_ADDR, test_cfg.TEST_ACCT_PW, 600);
  let res = await web3.eth.sendTransaction(txObject);
  return res;
}

let abi = `
    0.0
    Counter
    int getCount()
    void setString(String)
`

//let contract = web3.avm.contract.initBinding("0xa0ddef877dba8f4e407f94d70d83757327b9c9641f9244da3240b2927d493ebc", iface, test_cfg.AVM_TEST_PK, web3);//Interface

let abiMethods = async(methodName) => {

   try {

      let iface = web3.avm.contract.Interface(abi);//aion.utils.AvmInterface.fromString(abi);

      let contractAddress = test_cfg.AVM_TEST_CT_ADDR;

      let contract = web3.avm.contract.initBinding(contractAddress, iface, test_cfg.AVM_TEST_PK, web3);//Interface
      
      //console.log("Contract: ",web3.avm.contract);
      let result = await web3.avm.contract.readOnly.getCount();
      return(result);
    } catch (error) {
      console.log("call error:",error);
      return false;
    }
 }

describe('avm_contract', () => {

  it('deploying contract..', done => {
    deploy().then(res => {
      console.log(res);
      res.status.should.eql(true);
      done();
    }).catch(err => {
      done(err);
    });
  });

  tests.forEach((test) => {
    it('testing method, ' + test.name, done => {
      if(test.type === 'call') {
        if(test.inputs === 1) {
          methodCallWithInputs(test.name, test.inputTypes, test.inputValues, test.returnType).then(res => {
            done();
          }).catch(err => {
            done(err);
          });
        } else {
          methodCallWithoutInputs(test.name, test.returnType).then(res => {
            done();
          }).catch(err => {
            done(err);
          });
        }
      } else if(test.type === 'send') {
        if(test.inputs === 1) {
          methodSendWithInputs(test.name, test.inputTypes, test.inputValues).then(res => {
            done();
          }).catch(err => {
            done(err);
          });
        } else {
          methodSendWithoutInputs(test.name).then(res => {
            done();
          }).catch(err => {
            done(err);
          });
        }
      }
    });
  });

  it('Calling contract abi binding methods..', done => {
      abiMethods().then(res => {
        assert.isNumber(res,"Is not a Number")
        done();
      }).catch(err => {
        done(err);
      });
  });

});


