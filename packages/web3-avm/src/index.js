/**
* @namespace web3-avm
* @desc This is the main class for AVM functionality. All AVM features can be accessed using this moducle as a starting point.
*
* @example Contract Deployment
* 
* // let web3 = new Web3(new Web3.providers.HttpProvider(http://node.address));
* 
* //V1: Format jar file and deploy argument (100) of contract to be sent as contract data
* web3.avm.contract.deploy(jarPath).args(['int'], [100]).init();
* 
* //V2: Does the same as above without the need to specify the argument type.
* web3.avm.contract.deploy(jarPath).args([100]).init()
* 
* //This format goes further and deploy the contract as well using default values
* web3.avm.contract.deploy(jarPath).args([100]).initSend();
* 
* 
* @example Contract Interaction
* // makes a method call
* web3.avm.contract.method(methodName).inputs(inputTypes, inputValues).encode();
* 
* let abi = `
*    0.0    
*   HelloAvm 
*    Clinit: (String, Address)
*    public static int getMethod()   
*    public static void setMethod(int)`
* let iface = web3.avm.contract.Interface(abi);
* web3.avm.contract.initBinding(contractAddress, iface, pk);
*
* // makes a send transaction call
* web3.avm.contract.readOnly.getMethod();
* @returns {Number} Returns the value of x for the equation.
* // makes a send transaction call
* web3.avm.contract.transaction.setMethod(5);
*
* @example Contract Utility
* // estimate gas
* web3.avm.contract.transaction.setMethod(5);
* // get contract logs
* web3.avm.contract.transaction.setMethod(5);
* 
*
*/


var core = require('aion-web3-core');
var contract = require('aion-web3-avm-contract');

/**
*
* @constructor
* @hideconstructor
* @memberof AVM
*/
var Avm = function Avm(web3) {
	// sets _requestmanager
    core.packageInit(this, arguments);

	this.contract = new contract();
	//let network be directly accessible by avm
    this.contract.instance = web3;
}

core.addProviders(Avm);

module.exports = Avm;