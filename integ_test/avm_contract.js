let test_cfg = require('./_integ_test_config.js');
let test_data = require('./_integ_test_data.js');

let should = require('should');
let path = require('path');
let BN = require('bn.js');
let Web3 = require('../');

let jarPath = path.join(__dirname, 'contracts', 'Counter.jar');
let BIjarPath = path.join(__dirname, 'contracts', 'BigInteger-1.0.jar');
let BIAjarPath = path.join(__dirname, 'contracts', 'BigInteger-1.1.jar');

let web3NoArgs = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP));
let web3 = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP));
let web3e = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP));

let web3Arr = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP));
let web3bi = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP));
let web3bi2 = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP));
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

// Deploy an AVM Contract 
let deployNoArgs = async() => {
  
  let data = web3NoArgs.avm.contract.deploy(jarPath).args([100]).init();

  //construct a transaction
  const txObject = {
    from: acc.address,
    data: data,
    gasPrice: test_cfg.GAS_PRICE,
    gas: test_cfg.AVM_TEST_CT_DEPLOY_GAS,
    type: '0x2'
  };

  let signedTx = await web3NoArgs.eth.accounts.signTransaction(txObject, test_cfg.AVM_TEST_PK);
  let res = await web3NoArgs.eth.sendSignedTransaction(signedTx.rawTransaction);
  return res;
}

let deploySendNoArgs = async() => {
  
  let res = await web3NoArgs.avm.contract.deploy(jarPath).args([100]).initSend();
  return res;
}

let  deployBISendNoArgs = async() => {
  
  let res = await web3bi2.avm.contract.deploy(BIAjarPath).args([test_data['BIGINTEGER'],test_data['ONE_D_BIGINTEGER']]).initSend();
  return res;
}

let deployBIASendNoArgs = async() => {
  
  let res = await web3bi2.avm.contract.deploy(BIAjarPath).args([test_data['BIGINTEGER']]).initSend();
  return res;
}

// Deploy an AVM BigInt Contract 
let BI_Deploy = async() => {
  
  let data = web3bi.avm.contract.deploy(BIjarPath).args(['BigInteger'], [test_data['BIGINTEGER']]).init();

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
  console.log(txObject,returnType, ethRes);
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

let methodSendSigned = async(methodName, inputTypes, inputValues) => {
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
  let result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  return [result.transactionHash,signedTx.messageHash];
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

let arr_abi = `
    1
    Test.HelloAvm
    Clinit: ()
    public static void set1DStringArr(String[])
    public static void set1DIntArr(int[])
    public static void set2DIntArr(int[][])
    public static void set2DCharArr(char[][])
    public static void set2DLongArr(long[][])
    public static void set2DByteArr(byte[][])
    public static void set2DShortArr(short[][])
    public static void set1DFloatArr(float[])
    public static void set1DLongArr(long[])
    public static void set1DByteArr(byte[])
    public static void set1DCharArr(char[])
    public static void set1DShortArr(short[])
    public static String[] get1DStringArr()
    public static int[] get1DIntArr()
    public static int[][] get2DIntArr()
    public static float[] get1DFloatArr()
    public static long[] get1DLongArr()
    public static byte[] get1DByteArr()
    public static char[] get1DCharArr()
    public static short[] get1DShortArr()
`

let bi_abi = `
    1
    Test.HelloAvm
    Clinit: (BigInteger)
    public static void setMyBI(BigInteger)
    public static BigInteger getMyBI()
    public static BigInteger[] getMyBIArray()
`

let bi_abi_2 = `
    1
    Test.HelloAvm
    Clinit: (BigInteger, BigInteger[])
    public static void sayHello()
    public static String greet(String)
    public static String getString()
    public static void setString(String)
`

let no_args_abi = `
    0.0
    Counter
    Clinit: (int)
    public static void incrementCounter(int)
    int getCount()
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
`

//let contract = web3.avm.contract.initBinding("0xa0ddef877dba8f4e407f94d70d83757327b9c9641f9244da3240b2927d493ebc", iface, test_cfg.AVM_TEST_PK, web3);//Interface
let iface = web3.avm.contract.Interface(abi);//aion.utils.AvmInterface.fromString(abi);
let arriface = web3Arr.avm.contract.Interface(arr_abi);//aion.utils.AvmInterface.fromString(abi);
//console.log(JSON.stringify(arriface));
let biface = web3bi.avm.contract.Interface(bi_abi);//aion.utils.AvmInterface.fromString(abi);
let biface2 = web3bi2.avm.contract.Interface(bi_abi_2);//aion.utils.AvmInterface.fromString(abi);
console.log(biface2);
let no_args_iface = web3NoArgs.avm.contract.Interface(no_args_abi);//aion.utils.AvmInterface.fromString(abi);

//console.log(iface.functions);
let contractAddress = test_cfg.AVM_TEST_CT_2_ADDR;
let arrContractAddress = test_cfg.AVM_TEST_CT_4_ADDR;
let bigIntegerContractAddress = test_cfg.AVM_TEST_CT_3_ADDR;
web3NoArgs.avm.contract.initBinding(contractAddress, no_args_iface, test_cfg.AVM_TEST_PK);//Interface

web3.avm.contract.initBinding(contractAddress, iface, test_cfg.AVM_TEST_PK);//Interface
web3e.avm.contract.initBinding("0xa0d388c3e6b3ec78d26960533b7fb394fb3300eccd99d79d425faaaa9b9b6904", iface, test_cfg.AVM_TEST_PK);//Interface
web3Arr.avm.contract.initBinding(contractAddress, arriface, test_cfg.AVM_TEST_PK);//Interface
web3bi.avm.contract.initBinding(bigIntegerContractAddress, biface, test_cfg.AVM_TEST_PK);//Interface
web3bi2.avm.contract.initBinding(null, biface2, test_cfg.AVM_TEST_PK);//Interface

web3R.avm.contract.initBinding(contractAddress, iface, null, web3R);//Interface

let arrData = function(str,str1){
  let n = str.indexOf('[]');
  let n1 = str1.indexOf('2D');
  let n2 = str1.indexOf('Edge');
  //console.log("arrData",str,str1);
  if(n2>0){
    return "EDGE_TEST_"+str1.toUpperCase();
  }else{
    if(n>0){ 
      if(n1>0){ 
        //console.log("TWO_D_"+str.substring(0,str.length - 4).toUpperCase())
        return "TWO_D_"+str.substring(0,str.length - 4).toUpperCase();
      }else{ 
        //console.log("ONE_D_"+str.substring(0,str.length - 2).toUpperCase())
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

 let arrabiMethodCall = async(methodName,inputs,output) => {
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
          result = await web3Arr.avm.contract.readOnly[methodName](arr[0],arr[1]);
        }else{
          result = await web3Arr.avm.contract.readOnly[methodName](arr[0]);        
        }
      }else{
        result = await web3Arr.avm.contract.readOnly[methodName]();
      }
        return result;      
    } catch (error) {
      console.log("Call error:",error);
      return false;
    }
 }

 let methodGetPastEvents = async() => {
   let obj = {
    "fromBlock":125,
    "topics":
     [ '0x415453546f6b656e437265617465640000000000000000000000000000000000',
       '0x0113ba1430a5432dc03400000000000000000000000000000000000000000000',
       '0xa065824b9d0fb8a979db2436974121079fcd78334ec28da3cf12009b56588ad4' ],
       "address":arrContractAddress//"a04d869b5ae387c3dfcab29e431bad362f1127cc74b0e225583d40142bd17c93",//"0xa0a4a16bbc30e4e680a1ae2d21479964a8488179f75ee1264dc83609833a348a",
   }

   try {      
        result = await web3Arr.avm.contract.getPastEvents('allevents',{"fromBlock":125});
        return result;      
    } catch (error) {
      console.log("Past event error: ",error);
      return false;
    }
 }

 let methodGetPastLogs = async() => {
   let obj = {
    "fromBlock":125,
    
    "topics":
     [ '0x73656e645472616e73616374696f6e0000000000000000000000000000000000',
       null
     ]
       

   }

   try {      
        result = await web3Arr.avm.contract.getPastLogs(obj);
        return result;      
    } catch (error) {
      console.log("Past event error: ",error);
      return false;
    }
 }

 let BIabiMethodCall = async(methodName,inputs,output) => {
    let arr = [];    
    if(inputs!==null)
    {
      inputs.forEach((input)=>{
        arr.push(test_data[arrData(output,methodName)]);
        //test_data[arrData(output,methodName)]
      });
    }

   try {      
      //console.log("Contract: ",web3.avm.contract);
      let result;
      if(arr[0]){
        if(arr[1]){
          result = await web3bi.avm.contract.readOnly[methodName](arr[0],arr[1]);
        }else{
          result = await web3bi.avm.contract.readOnly[methodName](arr[0]);        
        }
      }else{
        result = await web3bi.avm.contract.readOnly[methodName]();
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

 let arrabiMethodSend = async(methodName,inputs=null,output) => {
    let arr = [];
    
    if(inputs!==null)
    {
      inputs.forEach((input)=>{
        //console.log(test_data[input.name.toUpperCase()]);
        if(typeof test_data[input.name.toUpperCase()] !== 'undefined'){
          arr.push(test_data[input.name.toUpperCase()]);
        }else if(test_data[arrData(input.name.toUpperCase(),"")]!== 'undefined' && input.name.substring(input.name.length - 4) !== "[][]"){
         
          arr.push(test_data[arrData(input.name.toUpperCase(),"")]);
        }else if(test_data[arrData(input.name.toUpperCase(),"Test2D")]!== 'undefined' && input.name.substring(input.name.length - 4) === "[][]"){
          
          arr.push(test_data[arrData(input.name.toUpperCase(),"Test2D")]);
        }else{
          return false;
        }
      });
    }

   try {      
      //console.log("Contract: ",web3.avm.contract);
      let result;
      if(arr[0]){
        result = await web3Arr.avm.contract.transaction[methodName](arr[0]);
      }else{
        result = await web3Arr.avm.contract.transaction[methodName]();
      } 

      return result;

    } catch (error) {
      console.log("Send error:",error);
      return false;
    }
 }

  let arrabiMethodSendCallback = async(methodName,inputs=null,output) => {
    let arr = [];
    
    if(inputs!==null)
    {
      inputs.forEach((input)=>{
        //console.log(test_data[input.name.toUpperCase()]);
        if(typeof test_data[input.name.toUpperCase()] !== 'undefined'){
          arr.push(test_data[input.name.toUpperCase()]);
        }else if(test_data[arrData(input.name.toUpperCase(),"")]!== 'undefined' && input.name.substring(input.name.length - 4) !== "[][]"){
          
          arr.push(test_data[arrData(input.name.toUpperCase(),"")]);
        }else if(test_data[arrData(input.name.toUpperCase(),"Test2D")]!== 'undefined' && input.name.substring(input.name.length - 4) === "[][]"){
          
          arr.push(test_data[arrData(input.name.toUpperCase(),"Test2D")]);
        }else{
          return false;
        }
      });
    }
    var func = function(){
      return "avm callback!!"
    }

   try {      
      //console.log("Contract: ",web3.avm.contract);
      let result;
      if(arr[0]){
        result = await web3Arr.avm.contract.avmMethod[methodName](arr[0]).avmSend({"value":1},func);
      }else{
        result = await web3Arr.avm.contract.avmMethod[methodName]().avmSend({"value":1},func);
      } 

      return result;

    } catch (error) {
      console.log("Send error:",error);
      return false;
    }
 }

 let arrabiMethodCallback = async(methodName,inputs,output) => {
    let arr = [];    
    if(inputs!==null)
    {
      inputs.forEach((input)=>{
        arr.push(test_data[input.name.toUpperCase()]);
      });
    }

    var func = function(){
      return "avm call callback!!"
    }

   try {      
      //console.log("Contract: ",web3.avm.contract);
      let result;
      if(arr[0]){
        if(arr[1]){
          result = await web3Arr.avm.contract.avmMethod[methodName](arr[0],arr[1]).avmCall({},func);
        }else{
          result = await web3Arr.avm.contract.avmMethod[methodName](arr[0]).avmCall({},func);      
        }
      }else{
        result = await web3Arr.avm.contract.avmMethod[methodName]().avmCall({},func);
      }
        return result;      
    } catch (error) {
      console.log("Call error:",error);
      return false;
    }
 }

 let BIabiMethodSend = async(methodName,inputs=null,output) => {
    let arr = [];
    if(inputs!==null)
    {
      inputs.forEach((input)=>{
        //console.log(test_data[input.name.toUpperCase()]);
        if(typeof test_data[input.name.toUpperCase()] !== 'undefined'){
          arr.push(test_data[input.name.toUpperCase()]);
        }else{
          arr.push(test_data['ONE_D_BIGINTEGER']);
        }
      });
    }

   try {      
      console.log("Contract: ",arr[0]);
      let result;
      if(arr[0]){
        result = await web3bi.avm.contract.transaction[methodName](arr[0]);
      }else{
        result = await web3bi.avm.contract.transaction[methodName]();
      } 

      return result;

    } catch (error) {
      console.log("Send error:",error);
      return false;
    }
 }

 let BIabiMethodEstimateGas = async(methodName,inputs=null,output) => {
    let arr = [];
    if(inputs!==null)
    {
      inputs.forEach((input)=>{
        //console.log(test_data[input.name.toUpperCase()]);
        if(typeof test_data[input.name.toUpperCase()] !== 'undefined'){
          arr.push(test_data[input.name.toUpperCase()]);
        }else{
          arr.push(test_data['ONE_D_BIGINTEGER']);
        }
      });
    }

   try {      
      //console.log("Contract: ",web3.avm.contract);
      let result;
      if(arr[0]){
        result = await web3bi.avm.contract.estimateGas[methodName](arr[0]);
      }else{
        result = await web3bi.avm.contract.estimateGas[methodName]();
      } 

      return result;

    } catch (error) {
      console.log("Send error:",error);
      return false;
    }
 }

 let arrabiMethodEstimateGas = async(methodName,inputs=null,output) => {
    let arr = [];
    if(inputs!==null)
    {
      inputs.forEach((input)=>{
        //console.log(test_data[input.name.toUpperCase()]);
        if(typeof test_data[input.name.toUpperCase()] !== 'undefined'){
          arr.push(test_data[input.name.toUpperCase()]);
        }else if(test_data[arrData(input.name.toUpperCase(),"")]!== 'undefined' && input.name.substring(input.name.length - 4) !== "[][]"){
          arr.push(test_data[arrData(input.name.toUpperCase(),"")]);
        }else if(test_data[arrData(input.name.toUpperCase(),"Test2D")]!== 'undefined' && input.name.substring(input.name.length - 4) === "[][]"){
          arr.push(test_data[arrData(input.name.toUpperCase(),"Test2D")]);
        }else{
          return false;
        }
      });
    }

   try {      
      //console.log("Contract: ",web3.avm.contract);
      let result;
      if(arr[0]){
        result = await web3Arr.avm.contract.estimateGas[methodName](arr[0]);
      }else{
        result = await web3Arr.avm.contract.estimateGas[methodName]();
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
    let coded = web3bi.avm.contract._abi.encode(type,arr);
    console.log(coded);
    let decoded = web3bi.avm.contract.decode('BigInteger',coded)
    return decoded;
 }

  let encodeBigIntArr = async(bigint) => {
    let arr = [bigint];
    let type= ['BigInteger[]']
    let coded = web3bi.avm.contract._abi.encode(type,arr);
    console.log(coded.toString('hex'));

    let decoded = web3bi.avm.contract.decode('BigInteger[]',coded)
    
    return decoded;
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

  
  
  it('deploying NoArgs contract..', done => {
    deployNoArgs().then(res => {
      
      res.status.should.eql(true);
      done();
    }).catch(err => {
      done(err);
    });
  });

  it('deploying NoArgs contract..', done => {
    deploySendNoArgs().then(res => {
      
      res.status.should.eql(true);
      done();
    }).catch(err => {
      done(err);
    });
  });

  //deployBISendNoArgs
  it('deploying BigInteger contract NoArgs..', done => {
    deployBISendNoArgs().then(res => {
      
      res.status.should.eql(true);
      done();
    }).catch(err => {
      done(err);
    });
  });

  it('deploying BigInteger contract..', done => {
    BI_Deploy().then(res => {
      console.log(res);
      res.status.should.eql(true);
      done();
    }).catch(err => {
      done(err);
    });
  });

  it('Testing GetPastLogs...', done => {
        methodGetPastLogs().then(res => {
          //console.log("GetPastLogs::: ",res); 
          //console.log("GetPastLogs end::: ",res[res.length-1]);     
          assert.isAtLeast(res.length,1,"GetPastEvents Test Failed");

          done();
        }).catch(err => {
          done(err);
        });
  });
  
  it('Testing GetPastEvents...', done => {
        methodGetPastEvents().then(res => {
          //console.log("GetPastEvents::: ",res);     
          assert.isAtLeast(res.length,1,"GetPastEvents Test Failed");

          done();
        }).catch(err => {
          done(err);
        });
  });
  
  biface.functions.forEach((method)=>{
    
    it('Testing BIGINT method estimateGas...'+method.name, done => {
        console.log(method.name,method.inputs,method.output);
        BIabiMethodEstimateGas(method.name,method.inputs,method.output).then(res => {
          console.log("EstimatedGas: ",res);     
          assert.isAtLeast(res,1000,"BIGINT estimateGas Test Failed");

          done();
        }).catch(err => {
          done(err);
        });
    });

    if(method.output!==null){

      it('Testing BIGINT method call...'+method.name, done => {
        BIabiMethodCall(method.name,method.inputs,method.output).then(res => {
          //assert.deepEqual(res,test_data[arrData(method.output,method.name)],"Call Failed!")
          //done();
          let bn = new BN(test_data['BIGINTEGER'],10);
          let bn_arr = new BN(test_data['ONE_D_BIGINTEGER'][0],10);
          let val=null;
          if(res[0]){
            val = res[0].eq(bn_arr); 
          }else{
            val = res.eq(bn); 
          }     
          assert.isTrue(val,"BIGINT Test Failed");

          done();
        }).catch(err => {
          done(err);
        });
      });
    }else{
      it('Testing method send...'+method.name, done => {
        BIabiMethodSend(method.name,method.inputs).then(res => {
          assert.isTrue(res.status,"Send Failed! "+res.hash);        
          done();
        }).catch(err => {
          done(err);
        });
      });
    }
  });

  it('test send signed transaction',done =>{
    methodSendSigned('incrementCounter', ['int'], [242]).then(res => {
      assert.deepEqual(res[0],res[1],"Signed object failed!")
      done();
    }).catch(err => {
      done(err);
    });
  });
  
  tests.forEach((test) => {
    it('testing V1 method, ' + test.name, done => {
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
  
  arriface.functions.forEach((method)=>{
    
    it('Testing Array method estimateGas...'+method.name, done => {
        arrabiMethodEstimateGas(method.name,method.inputs,method.output).then(res => {
          console.log("EstimatedGas: ",res);     
          assert.isAtLeast(res,1000,"BIGINT estimateGas Test Failed");

          done();
        }).catch(err => {
          done(err);
        });
    });
    
    //console.log(method);
    if(method.output!==null){

      it('Testing method call...'+method.name, done => {
        arrabiMethodCall(method.name,method.inputs,method.output).then(res => {
          assert.deepEqual(res,test_data[arrData(method.output,method.name)],"Call Failed!")
          done();
        }).catch(err => {
          done(err);
        });
      });

      it('Testing method callback send...'+method.name, done => {
        arrabiMethodCallback(method.name,method.inputs,method.output).then(res => {
          assert.deepEqual(res,"avm call callback!!","Call Failed!")
                  
          done();
        }).catch(err => {
          done(err);
        });
      });
    }else{
      it('Testing method send...'+method.name, done => {
        arrabiMethodSend(method.name,method.inputs).then(res => {
          //console.log(res);
          assert.isTrue(res.status,"Send Failed!"+res.hash);        
          done();
        }).catch(err => {
          done(err);
        });
      });

      it('Testing method callback send...'+method.name, done => {
        arrabiMethodSendCallback(method.name,method.inputs).then(res => {
          assert.deepEqual(res,"avm callback!!","Call Failed!")
                  
          done();
        }).catch(err => {
          done(err);
        });
      });

    }
  });
  
  iface.functions.forEach((method)=>{
    //console.log(method);
    if(method.output!==null){

      it('Testing default method call...'+method.name, done => {
        abiMethodCall(method.name,method.inputs,method.output).then(res => {
          assert.deepEqual(res,test_data[arrData(method.output,method.name)],"Call Failed!")
          done();
        }).catch(err => {
          done(err);
        });
      });
    }else{
      it('Testing default method send...'+method.name, done => {
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
      });
  
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
      let bn = new BN(test_data['ONE_D_BIGINT'][0],10);
      let val = res[0].eq(bn); 
          
      assert.isTrue(val,"BIGINT Array Test Failed");
      done();
    }).catch(err => {
      done(err);
    });
  });
  
  /**
  iface.functions.forEach((method)=>{
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


