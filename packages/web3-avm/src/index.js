var core = require('aion-web3-core');
var contract = require('aion-web3-avm-contract');
//var Eth = require('aion-web3-eth');

var Avm = function Avm(web3) {
	// sets _requestmanager
    core.packageInit(this, arguments);

	this.contract = new contract();
	//let network be directly accessible by avm
    this.contract.instance = web3;
}

core.addProviders(Avm);

module.exports = Avm;