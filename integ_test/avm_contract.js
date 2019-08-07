let test_cfg = require('./_integ_test_config.js');
let test_data = require('./_integ_test_data.js');

let should = require('should');
let path = require('path');
let BN = require('bn.js');
let Web3 = require('../');

let jarPath = path.join(__dirname, 'contracts', 'Counter.jar')
let BIjarPath = path.join(__dirname, 'contracts', 'bigint-1.0-SNAPSHOT.jar')

let web3 = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP));
let web3bi = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP));
let web3R = new Web3(new Web3.providers.HttpProvider(test_cfg.RUST_IP));
let acc = web3.eth.accounts.privateKeyToAccount(test_cfg.AVM_TEST_PK);

var chai = require('chai');
chai.use(require('chai-bn')(BN));
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
  
  let data = web3bi.avm.contract.deploy(jarPath).args(['int'], [100]).init();

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

// Deploy an AVM BigInt Contract 
let BI_Deploy = async() => {
  
  let data = web3.avm.contract.deploy(jarPath).args(['String','BigInteger','BigInteger[]'], ['biginteger',123456789,[987654321,123456789]]).init();

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

let bi_abi = `
    1
    Test.HelloAvm
    Clinit: (String, BigInteger, BigInteger[])
    public static BigInteger getMyBI()
    public static BigInteger[] getMyBIArray()
    public static void setMyBI(BigInteger)
    public static void setMyBIArray(BigInteger[])
    public static String getMyStr()
    public static void setMyStr(String)
`

let abi = `
    0.0    
    HelloAvm 
    Clinit: (String, Address)
    public static Address getAc()   
    public static void setByte(byte)
    public static void setBoolean(boolean)
    void setChar(char)
    void setShort(short)
    void setInt(int)
    public static void setFloat(float)
    void setLong(long)
    void setDouble(double)
    public static void setString(String)
    public static byte getByte()
    boolean getBoolean()
    char getChar()
    short getShort()
    int getInt()
    float getFloat()
    long getLong()
    public static double getDouble()
    public static String getStr()
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
    int[] getEdgeEmptyIntArr()
    int[] getEdgeNullIntArr()
    int getEdgeSum(int, int) 
    void dontExist()   
`

//let contract = web3.avm.contract.initBinding("0xa0ddef877dba8f4e407f94d70d83757327b9c9641f9244da3240b2927d493ebc", iface, test_cfg.AVM_TEST_PK, web3);//Interface
let iface = web3.avm.contract.Interface(abi);//aion.utils.AvmInterface.fromString(abi);
let biface = web3.avm.contract.Interface(bi_abi);//aion.utils.AvmInterface.fromString(abi);

//console.log(iface.functions);
let contractAddress = test_cfg.AVM_TEST_CT_2_ADDR;

web3.avm.contract.initBinding(contractAddress, iface, test_cfg.AVM_TEST_PK);//Interface
web3R.avm.contract.initBinding(contractAddress, iface, test_cfg.AVM_TEST_PK, web3R);//Interface

let arrData = function(str,str1){
  let n = str.indexOf('[]');
  let n1 = str1.indexOf('2D');
  let n2 = str1.indexOf('Edge');
  
  if(n2>0){
    return "EDGE_TEST_"+str1.toUpperCase();
  }else{
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
  
}
      
let abiMethodCall = async(methodName,inputs,output) => {
    let arr = [];    
    if(inputs!==null)
    {
      inputs.forEach((input)=>{
        arr.push(test_data[input.name.toUpperCase()]);
      });
    }

   try {      
      //console.log("Contract: ",web3.avm.contract);
      let result;
      if(arr[0]){
        if(arr[1]){
          result = await web3.avm.contract.readOnly[methodName](arr[0],arr[1]);
        }else{
          result = await web3.avm.contract.readOnly[methodName](arr[0]);        
        }
      }else{
        result = await web3.avm.contract.readOnly[methodName]();
      }
        return result;      
    } catch (error) {
      console.log("Call error:",error);
      return false;
    }
 }

 let sendSetString = async(str) => {
    try {      
      let result;     
      result = await web3.avm.contract.transaction.setString(str);
      return result;
    } catch (error) {
      console.log("Send error:",error);
      return false;
    }
 }

 let abiMethodSend = async(methodName,inputs=null,output) => {
    let arr = [];
    if(inputs!==null)
    {
      inputs.forEach((input)=>{
        arr.push(test_data[input.name.toUpperCase()]);
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

 let abiMethodCallRust = async(methodName,inputs,output) => {
    let arr = [];    
    if(inputs!==null)
    {
      inputs.forEach((input)=>{
        arr.push(test_data[input.name.toUpperCase()]);
      });
    }

   try {      
      //console.log("Contract: ",web3.avm.contract);
      let result;
      if(arr[0]){
        if(arr[1]){
          result = await web3R.avm.contract.readOnly[methodName](arr[0],arr[1]);
        }else{
          result = await web3R.avm.contract.readOnly[methodName](arr[0]);        
        }
      }else{
        result = await web3R.avm.contract.readOnly[methodName]();
      }
        return result;      
    } catch (error) {
      console.log("Call error:",error);
      return false;
    }
 }

 let abiMethodSendRust = async(methodName,inputs=null) => {
    let arr = [];
    if(inputs!==null)
    {
      inputs.forEach((input)=>{
        arr.push(test_data[input.name.toUpperCase()]);
      });
    }

   try {      
      //console.log("Contract: ",web3.avm.contract);
      let result;
      if(arr[0]){
        result = await web3R.avm.contract.transaction[methodName](arr[0]);
      }else{
        result = await web3R.avm.contract.transaction[methodName]();
      } 

      return result;

    } catch (error) {
      console.log("Send error:",error);
      return false;
    }
 }

 let encodeBigInt = async(bigint) => {
    let arr = [bigint];
    let type= ['BigInteger']
    let coded = web3.avm.contract._abi.encode(type,arr);
    let decoded = web3.avm.contract.decode('BigInteger',coded)
    return decoded;
 }

  let encodeBigIntArr = async(bigint) => {
    let arr = [bigint];
    let type= ['BigInteger[]']
    let coded = web3.avm.contract._abi.encode(type,arr);
    
    let decoded = web3.avm.contract.decode('BigInteger[]',coded)
    
    return decoded;
 }

describe('avm_contract', () => {

  /*
  it('deploying contract..', done => {
    deploy().then(res => {
      
      res.status.should.eql(true);
      done();
    }).catch(err => {
      done(err);
    });
  });

  it('deploying BigInteger contract..', done => {
    BI_Deploy().then(res => {
      
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
  

  iface.functions.forEach((method)=>{
    //console.log(method);
    if(method.output!==null){

      it('Testing method call...'+method.name, done => {
        abiMethodCall(method.name,method.inputs,method.output).then(res => {
          assert.deepEqual(res,test_data[arrData(method.output,method.name)],"Call Failed!")
          done();
        }).catch(err => {
          done(err);
        });
      });
    }else{
      it('Testing method send...'+method.name, done => {
        abiMethodSend(method.name,method.inputs).then(res => {
          //console.log(res);
          assert.isTrue(res.status,"Send Failed!"+res.hash);        
          done();
        }).catch(err => {
          done(err);
        });
      });

    }
  });

  it('Testing none existent method send...', done => {
        abiMethodSend('dontExistB',[]).then(res => {
          //console.log(res);
          assert.isTrue(!res,"Test Failed!");        
          done();
        }).catch(err => {
          done(err);
        });
      });

  it('Testing send with actual method...', done => {
        sendSetString('this is a test!').then(res => {
          assert.isTrue(res.status,"Test Failed!");        
          done();
        }).catch(err => {
          done(err);
        });
        
  });

  it('Testing send with value...', done => {
        //change value
        web3.avm.contract.setValue(1)
        sendSetString('setString',['']).then(res => {
          //console.log(res);
          assert.isTrue(res.status,"Test Failed!");        
          done();
        }).catch(err => {
          done(err);
        });
      });*/
  it('Testing BigInteger..', done => {
    encodeBigInt(test_data['BIGINT']).then(res => {
      let bn = new BN(test_data['BIGINT'],10);
      let val = res.eq(bn);      
      assert.isTrue(val,"BIGINT Test Failed");

      done();
    }).catch(err => {
      done(err);
    });
  });

  it('Testing BigInteger Array..', done => {
    encodeBigIntArr(test_data['ONE_D_BIGINT']).then(res => {
     
      console.log('Bigint arr:',res[0].toString(),res[1].toString());
      let bn = new BN(test_data['ONE_D_BIGINT'][0],10);
      let val = res[0].eq(bn); 
          
      assert.isTrue(val,"BIGINT Array Test Failed");

      done();
    }).catch(err => {
      done(err);
    });
  });

  /*iface.functions.forEach((method)=>{
    console.log(method);
    if(method.output!==null){
    it('Testing Rust method call..'+method.name, done => {
      abiMethodCallRust(method.name,method.inputs,method.output).then(res => {
        assert.deepEqual(res,test_cfg[arrData(method.output,method.name)],"Call Failed!")
        done();
      }).catch(err => {
        done(err);
      });
    });
    }else{
    it('Testing Rust method send..'+method.name, done => {
      abiMethodSendRust(method.name,method.inputs).then(res => {
        assert.isTrue(res,"Send Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
    });
    }
  });*/

});


