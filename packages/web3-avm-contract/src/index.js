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
 /**
* 
* @Module Avm-contract
*
*/

"use strict"; 

var fs = require('fs');
var ABI = require('aion-web3-avm-abi');
var Method = require('aion-web3-core-method');
var formatters = require('aion-web3-core-helpers').formatters;

class Contract {

	constructor() {
		this._abi = new ABI();
        
		//
        this._callback = null;
        this._altTxnObj = null;//this.transactionObject = null;

        this._initializer = null;
		this._argsData = null;
		this._jarPath = null;

		this._method = null;
		this._values = [];
		this._types = [];
        this._deployTypes = [];

		//
		this._call = null;
		this._send = null;

		this._address = null
		this._contract = null
		this._interface = null;

		this.readOnly = function(txnObj=null,callback=null){
            if(callback!==null){
                this._callback =callback;
            }

            //set object properties
            if(txnObj!==null){               
                this._altTxnObj = txnObj;                
            }
        };
		this.transaction = {};

		this.instance = {};
        
		this._data = null;
		this._key = null;

        this._gasPrice = 10000000000;//10000000000
        this._gas = 2000000;
        this._value = 0;
        this._nonce = null;

        this._provider = null;

        this.send = async(methodName, inputTypes, inputValues,address,contract) => {
            let contr = new Contract();
            let data = contr.method(methodName).inputs(inputTypes, inputValues).encode();
  
            const txObject = {
                from: address,
                to: contract,
                data: data,
                gasPrice: this._gasPrice,
                gas: this._gas,
                type: '0x1'
            };
            let signedTx = await this.instance.eth.accounts.signTransaction(txObject, this._key);
            let res = await this.instance.eth.sendSignedTransaction(signedTx.rawTransaction);
            return res;
        };

        /**
            *@desc signs and send a transaction
            *@param accepts a transaction data object
            *@return returns the transaction data or false on error
        **/

		this.sendTransaction = async (txObject) => {
            
            let signedTx = await this.instance.eth.accounts.signTransaction(txObject, this._key);
            //txn:returned transaction object 
            //output: return from the function
            let response = {txn:null,output:null};
            try{

                //send transaction
                let res = await this.instance.eth.sendSignedTransaction(signedTx.rawTransaction);
                return res;

            }catch(err){
                //throw error
                console.log("Transaction Failed!", err);
                return false;
            }
                        
        };

        /**
            *@desc makes a call
            *@param accepts a transaction data object and return type
            *@return if return type is not null return the decoded data else return true or false if there is an error
        **/

        this.call = async (txObject,returnType=null) => {
          
          try{
              let ethRes = await this.instance.eth.call(txObject); 
              if(this._callback!==null){
                if(returnType!==null){
                    let res = await this.instance.avm.contract.decode(returnType, ethRes);             
                    return this._callback(res);   
                }else{
                    return this._callback(true);
                }
              }else{
                if(returnType!==null){
                    let res = await this.instance.avm.contract.decode(returnType, ethRes);             
                    return res;   
                }else{
                    return true;
                }
              }
          }catch(err){
            console.log("Call Failed!", err);
            return false; //may need to be improved for booleans
          }  
          
        };

	}
    /**
        *@desc get the current value set for gas
        *@param none
        *@return returns the value of _gas
    **/
    getGas(){
        return this._gas
    }
    setGas(gas=null){
        if(gas!==null){
            this._gas = gas;
        }else{
            throw new Error('Invalid gas');
        }

    }
    /**
        *@desc get the current value set for gas price
        *@param none
        *@return returns the value of _gasPrice
    **/
    getGasPrice(){
        return this._gasPrice
    }
    setGasPrice(gas=null){
        if(gas!==null){
            this._gasPrice = gas;
        }else{
            throw new Error('Invalid gasPrice');
        }

    }
    /**
        *@desc get the current value set for a transaction value field
        *@param none
        *@return returns the value of _value
    **/
    getValue(){
        return this._value
    }
    setValue(value=null){
        if(value!==null){
            this._value = value;
        }else{
            throw new Error('Invalid gas');
        }

    }
    //to be improved
    getNonce(){
        return this._nonce
    }
    /**
        *@desc get the current value set for gas
        *@param none
        *@return returns the value of _gas
    **/
    setNonce(nonce=null){
        if(nonce!==null){
            this._nonce = nonce;
        }else{
            throw new Error('Invalid nonce');
        }

    }
    /**
        *@desc set value from a provided transaction object
        *@param accepts an object with necessary fields
        *@return none
    **/
    setTransactionObject(obj){
        if(obj!==null){
            if(obj.gas!==null){
                this._gas = obj.gas;
            }
            if(obj.gasPrice!==null){
                this._gasPrice = obj.gasPrice;
            }
            if(obj.value!==null){
                this._value = obj.value;
            }
            if(obj.nonce!==null){
                this._nonce = obj.nonce;
            }
        }else{
            throw new Error('Invalid transaction object');
        }
    }

    //assign default provider
    provider(provider=null){
        if(provider !== null){
            this.instance = provider;
        }
    }

	//AVM Binding. Creates the data for the transaction.
    data(method, inputTypes, inputValues){
        let contract = new Contract();
        
        if(inputTypes.length > 0 && inputValues.length > 0){
            return contract.method(method).inputs(inputTypes, inputValues).encode();
        }else{
            return contract.method(method).encode();
        }

    }

    //Prepare transaction object
    txnObj(address,contract,data,gasPrice=10000000000,gas=2000000,nonce=null,type='0x1'){
        
        let g = this._gas;
        let gP = this._gasPrice;
        let v = this._value;

        let txObject = {
            from: address,
            to: contract,
            data: data,
            gasPrice: gP,//gasPrice,//
            gas: g,//gas,
            value: v,//value
            type: type
        };
        //console.log("HERE IS THE DATA >>>>", txObject.gasPrice,"##",txObject.gas,"##",txObject.value);
        
        //nonce is calculated so only set if user provide a figure
        if(nonce!==null){
            txObject.nonce = nonce;
        }
        return txObject;
    }

    //create functions and make them available.
    initFunctions(fns,obj){
        try{
                fns.forEach(function(fn){
                    //define call functions
                    Object.defineProperty(obj.readOnly, fn.name,{
                     value: function(){
                            const props = fn;                            
                            let params = [];
                            let inputs = [];
                            if(arguments.length > 0){
                              for (var _i = 0; _i < arguments.length; _i++) {
                                
                                if(props.inputs[_i]){
                                    params[_i] = arguments[_i];
                                    inputs[_i] = props.inputs[_i].name;
                                }
                              }
                            }
                            var data = obj.data(props.name, inputs, params);
                            var txn = obj.txnObj(obj._address, obj._contract, data);
                            
                            if(props.output){
                                return obj.call(txn, props.output);
                                //TODO:extend to return decoded output
                            }else{
                                return obj.call(txn);
                            }
                     },
                     writable: false
                    });

                    //define functions with send transaction
                    Object.defineProperty(obj.transaction, fn.name,{
                        value: function(){
                            const props = fn;
                            let params = [];
                            let inputs = [];

                            if(arguments.length > 0){
                              for (var _i = 0; _i < arguments.length; _i++) {
                                
                                if(props.inputs[_i]){
                                    params[_i] = arguments[_i];
                                    inputs[_i] = props.inputs[_i].name;
                                }
                              }
                            }

                            var data = obj.data(props.name, inputs, params);
                            var txn = obj.txnObj(obj._address, obj._contract, data);
                            
                            if(props.output){
                                return obj.sendTransaction(txn, props.output);
                            }else{
                                return obj.sendTransaction(txn);
                            }
                        },
                        writable: false
                    });

                })

        }catch(err){
            throw new Error('Unable to initialize functions');
        }
    }

    /**
        *@desc assign values and create function based on abi definition
        *@param takes the contract address, abi object, private key and web3 instance
        *@return none
    **/
	initBinding(contractAddress=null, abi=null, key=null, instance=null) {
	    if((contractAddress === null)||(abi === null)) {
            throw new Error('Missing input parameter(s)');
        }

        
	    this._contract = contractAddress;
	    this._interface = abi;

	    //TODO:Improve the following
        if(key!==null){
            this._key = key;
            let ac = this.instance.eth.accounts.privateKeyToAccount(this._key);
            this._address = ac.address;
        }


        if(instance!==null){
            this.instance = instance;//web3 intance to process transactions
        }

        
	   

	    var methods = abi.functions ? abi.functions : [];

	    this.initFunctions(methods,this);//create methods
	}
	
	// Converts the Jar into a JarPath to be Encoded for Initialization
	deploy(jar) {
	    
        this._jarPath = fs.readFileSync(jar);
	    return this;
	}

    // TODO: allow _jarPath creation from the browser
    // accepts file steam instaead of using fs.readFileSync(jar);
    clientDeploy(jar) {
        
        this._jarPath = jar //fs.readFileSync(jar);
        return this;
    }

	// Defines the Arguments of a AVM Contract's Initializer
	args(types, values) {
		
        if(this._jarPath === null) { throw new Error('requires a jarFile to be set first through the deploy method'); }
        var initTypes = types;
        var initValues = values;
        //check if 1 parameter is entered and if there is a value in _deployTypes
        if(arguments.length === 1 && this._deployTypes.length > 0){
            initTypes = this._deployTypes;
            initValues = arguments[0];
        }
        
        this._argsData = this._abi.encode(initTypes, initValues);
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
        var abi = this._abi.AvmInterface(abi);
        this._deployTypes = abi.init;
        return abi; 
    }
}

module.exports = Contract;