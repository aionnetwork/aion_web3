var core = require('aion-web3-core');
var contract = require('aion-web3-avm-contract');

var Avm = function Avm() {
	// sets _requestmanager
    core.packageInit(this, arguments);

	this.contract = new contract();
}

core.addProviders(Avm);

module.exports = Avm;