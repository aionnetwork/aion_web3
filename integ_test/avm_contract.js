let test_cfg = require('./_integ_test_config.js');
let should = require('should');
let path = require('path');
let BN = require('bn.js');
let Web3 = require('../');

let jarPath = path.join(__dirname, 'contracts', 'Counter.jar')
let web3 = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP));
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
  inputValues: [242]
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
  
  let data = web3.avm.contract.deploy(jarPath).args(['int'], [100]).init();

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
  
  const txObject = {
    from: acc.address,
    to: test_cfg.AVM_TEST_CT_ADDR,
    data: data,
    gasPrice: test_cfg.GAS_PRICE,
    gas: test_cfg.AVM_TEST_CT_TXN_GAS,
    type: '0x1'
  };
  let txnObj = web3.avm.contract.txnObj(acc.address,test_cfg.AVM_TEST_CT_ADDR,data);
  let signedTx = await web3.eth.accounts.signTransaction(txnObj, test_cfg.AVM_TEST_PK);
  let res = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
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
    HelloAvm    
    void setByte(byte)
    void setBoolean(boolean)
    void setChar(char)
    void setShort(short)
    void setInt(int)
    void setFloat(float)
    void setLong(long)
    void setDouble(double)
    void setString(String)
    byte getByte()
    boolean getBoolean()
    char getChar()
    short getShort()
    int getInt()
    float getFloat()
    long getLong()
    double getDouble()
    String getStr()
    byte[] getByteArr()
    boolean[] getBooleanArr()
    char[] getCharArr()
    short[] getShortArr()
    int[] getIntArr()
    float[] getFloatArr()
    long[] getLongArr()
    double[] getDoubleArr()
    String[] getStrArr()
    byte[][] get2DByteArr()
    boolean[][] get2DBooleanArr()
    char[][] get2DCharArr()
    short[][] get2DShortArr()
    int[][] get2DIntArr()
    float[][] get2DFloatArr()
    long[][] get2DLongArr()
    double[][] get2DDoubleArr()
`

//let contract = web3.avm.contract.initBinding("0xa0ddef877dba8f4e407f94d70d83757327b9c9641f9244da3240b2927d493ebc", iface, test_cfg.AVM_TEST_PK, web3);//Interface
let iface = web3.avm.contract.Interface(abi);//aion.utils.AvmInterface.fromString(abi);
//console.log(iface.functions);
let contractAddress = test_cfg.AVM_TEST_CT_2_ADDR;

let contract = web3.avm.contract.initBinding(contractAddress, iface, test_cfg.AVM_TEST_PK, web3);//Interface

let arrData = function(str,str1){
  let n = str.indexOf('[]');
  let n1 = str1.indexOf('2D');
  if(n>0){ 
    if(n1>0){ 
      return "TWO_D_"+str.substring(0,str.length - 4).toUpperCase()
      }else{ 
        return "ONE_D_"+str.substring(0,str.length - 2).toUpperCase();
      }
    }else{
    return str.toUpperCase();
  }   
  
}
      
let abiMethodCall = async(methodName,inputs,output) => {
    let arr = [];
    inputs.forEach((input)=>{arr.push(test_cfg[intput.toUpperCase()])});

   try {      
      //console.log("Contract: ",web3.avm.contract);
      let result;
      if(arr[0]){
        result = await web3.avm.contract.readOnly[methodName](arr[0]);
      }else{
        result = await web3.avm.contract.readOnly[methodName]();
      }
        return result;      
    } catch (error) {
      console.log("Call error:",error);
      return false;
    }
 }

 let abiMethodSend = async(methodName,inputs=null) => {
    let arr = [];
    if(inputs!==null)
    {
      inputs.forEach((input)=>{
        arr.push(test_cfg[input.name.toUpperCase()]);
      });
    }

   try {      
      //console.log("Contract: ",web3.avm.contract);
      let result;
      if(arr[0]){
        result = await web3.avm.contract.transaction[methodName](arr[0]);
      }else{
        result = await web3.avm.contract.transaction[methodName]();
      } 

      return result;

    } catch (error) {
      console.log("Send error:",error);
      return false;
    }
 }

 /*let abiMethodSend = async(methodName) => {

   try {      
      console.log("Contract Send: ");
      let result = await web3.avm.contract.transaction.incrementCounter(242);
      
      return(result);
    } catch (error) {
      console.log("Send error:",error);
      return false;
    }
 }*/



describe('avm_contract', () => {

  it('deploying contract..', done => {
    deploy().then(res => {
      //console.log(res);
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

  /*it('Calling AVM Call function using abi binding method..', done => {
      abiMethodCall().then(res => {
        assert.isNumber(res,"Call Failed!")
        done();
      }).catch(err => {
        done(err);
      });
  });*/

  iface.functions.forEach((method)=>{
    console.log(method);
    if(method.output!==null){
    it('Testing method call..'+method.name, done => {
      abiMethodCall(method.name,method.inputs,method.output).then(res => {
        //console.log("Test data: ",arrData(method.output,method.name),test_cfg[arrData(method.output,method.name)]);
        assert.deepEqual(res,test_cfg[arrData(method.output,method.name)],"Call Failed!")
        done();
      }).catch(err => {
        done(err);
      });
    });
    }else{
    it('Testing method send..'+method.name, done => {
      abiMethodSend(method.name,method.inputs).then(res => {
        assert.isTrue(res,"Send Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
    });
    }
  });

  /*it('Calling AVM Send function using abi binding method..', done => {
      abiMethodSend().then(res => {
        assert.isTrue(res,"Send Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });*/

});


