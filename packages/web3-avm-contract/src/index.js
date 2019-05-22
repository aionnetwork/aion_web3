/*
 * Copyright (c) 2017-2018 Aion foundation.
 *
 *     This file is part of the aion network project.
 *
 *     The aion network project is free software: you can redistribute it 
 *     and/or modify it under the terms of the GNU General Public License 
 *     as published by the Free Software Foundation, either version 3 of 
 *     the License, or any later version.
 *
 *     The aion network project is distributed in the hope that it will 
 *     be useful, but WITHOUT ANY WARRANTY; without even the implied 
 *     warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *     See the GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the aion network project source files.  
 *     If not, see <https://www.gnu.org/licenses/>.
 *
 * Contributors:
 *     Aion foundation.
 */

"use strict"; 

var fs = require('fs');
var ABI = require('aion-web3-avm-abi');
class Contract {

	constructor() {
		this._abi = new ABI();

		this._initializer = null;
		this._argsData = null;
		this._jarPath = null;

		this._method = null;
		this._values = [];
		this._types = [];

		//
		this._call = null;
		this._send = null;

		this._address = null
		this._contract = null
		this._key = null;
		this._interface = null;

		this.readOnly = {};
		this.transaction = {};
		this.instance = {};

		this._data = null;
		this._key = null;
		this.sendTransaction = async (txObject,key) => {

            let signedTx = await this.instance.eth.accounts.signTransaction(txObject, key);
            let res = await this.instance.eth.sendSignedTransaction(signedTx.rawTransaction);
               
            return res;
        };
        this.call = async (txObject,returnType) => {
          let ethRes = await this.instance.eth.call(txObject);
          let res = await this.instance.avm.contract.decode(returnType, ethRes);
                   
          return res;
        };

	}

	//AVM Binding

    data(method, inputTypes, inputValues){
        let contract = new Contract()
        if(inputTypes.length > 0 && inputValues.length > 0){
            return contract.method(method).inputs(inputTypes, inputValues).encode();
        }else{
            return contract.method(method).encode();
        }

    }

    txnObj(address,contract,data,gasPrice=2000000,gas=5000000,type='0x1'){
        const txObject = {
            from: address,
            to: contract,
            data: data,
            gasPrice: gasPrice,
            gas: gas,
            type: type
        };
        return txObject;
    }

    initFunctions(fns,obj){
        fns.forEach(function(fn){

            Object.defineProperty(obj.readOnly, fn.name,{
             value: function(){
                    const props = fn;
                    let params = [];
                    let inputs = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        //TODO:add a check here
                        params[_i] = arguments[_i];
                        inputs[_i] = props.inputTypes[_i];
                    }
                    var data = obj.data(props.name, inputs, params);
                    var txn = obj.txnObj(obj._address, obj._contract, data);
                    return obj.call(txn, props.output);
             },
             writable: false
            });

            Object.defineProperty(obj.transaction, fn.name,{
                     value: function(){
                        return 0;
                     },
                     writable: false
            });

        })
    }

	initBinding(contractAddress, abi, key, instance) {
	    this._key = key;
	    this._contract = contractAddress;
	    this._interface = abi;
	    this.instance = instance;//web3 intance to process transactions
	    //TODO:Improve the following
	    let ac = instance.eth.accounts.privateKeyToAccount(key);
	    this._address = ac.address;

	    var methods = abi.functions ? abi.functions : [];

	    this.initFunctions(methods,this);//create methods
	}
	//mock method


	// Converts the Jar into a JarPath to be Encoded for Initialization
	deploy(jar) {
	    this._jarPath = fs.readFileSync(jar);
	    return this;
	}

	// Defines the Arguments of a AVM Contract's Initializer
	args(types, values) {
		if(this._jarPath === null) { throw new Error('requires a jarFile to be set first through the deploy method'); }
        this._argsData = this._abi.encode(types, values);
        return this;
    }

    // Initialize 
    init() {
    	if(this._jarPath === null) { throw new Error('requires a jarFile to be set first through the deploy method'); }
    	if(this._argsData === null) { this._argsData = this._abi.encode([], []); }
        this._initializer = this._abi.readyDeploy(this._jarPath, this._argsData);
        console.log("Deploying AVM Contract...");
		return this._initializer;
    }

	// Sets the Method you wish to Call
    method(method) {
        this._method = method;
        return this;
    }

    // Sets the Params of the Method you wish to Call
    inputs(types, values) {
        if(this._method === null) {
            throw new Error('a method must be set first');
        }

        this._values = values;
        this._types = types;
        return this;
    }


    // Encodes the Method Call
    encode() {
        if(this._method === null) {
            throw new Error('a method must be set first');
        }

        return this._abi.encodeMethod(this._method, this._types, this._values);
    }

    // Decodes some data returned for a Method
    decode(type, data) {
        return this._abi.decode(type, data);
    }

    //
    Interface(abi) {
        return this._abi.AvmInterface(abi);
    }
}

module.exports = Contract;