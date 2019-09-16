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
* @namespace AVM-Contract
*/


"use strict"; 

var fs = require('fs');
var ABI = require('aion-web3-avm-abi');
var Method = require('aion-web3-core-method');
var formatters = require('aion-web3-core-helpers').formatters;
var Subscription = require('aion-web3-core-subscriptions').subscription;

var _ = require('underscore');
var core = require('aion-web3-core');
var utils = require('aion-web3-utils');
var errors = require('aion-web3-core-helpers').errors;
var promiEvent = require('aion-web3-core-promievent');


/**
*@class
*this is the main avm contract class
*/
class Contract {

	constructor() {
		this._abi = new ABI();
        this._requestManager = null;
        
		
        this._callback = null;
        this._altTxnObj = null;//this.transactionObject = null;
        this._altTxnOutput = null;

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

		this._address = null;
		/**This stores the address of the deployed contract*/
        this._contract = null;
		this._interface = null;


        this.readOnly = {};//this.methodTxnConf;
		this.transaction = {};//this.methodTxnConf;
        
        this.avmMethod = {};
        this.avmCall = (txn,callback)=>{
            return this.methodTxnConf(txn,callback,'call')
        };
        this.avmSend = (txn,callback)=>{
            return this.methodTxnConf(txn,callback,'send')
        };

		this.instance = {};
        
		this._data = null;
		this._key = null;

        this._gasPrice = 10000000000;//10000000000
        this._gas = 2000000;//2000000
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
                
                if(this._callback!==null){
                    let callback = this._callback;
                    this._callback = null;
                    return callback(res);
                }else{
                    return res;
                }

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

                let callback = this._callback;
                this._callback = null;

                if(returnType!==null){
                    let res = await this.instance.avm.contract.decode(returnType, ethRes);             
                    
                    return callback(res);  
                }else{
                    return callback(true);
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

        /**
        *@method estimateGas
        *@memberof AVM-Contract
        *@param  {object} txObject - similar to what would be passed to send/call
        *@return {int} value
        */

        this.estimateGas = async (txObject) => {
          
          try{
              
              let gas = await this.instance.eth.estimateGas(txObject); 
              return gas;
              
          }catch(err){
            console.log("Estimation Failed!", err);
            return false; //may need to be improved for booleans
          }  
          
        };

        /**
        *@method getPastLogs
        *@memberof AVM-Contract
        *@param  {options} options - similar to what would be passed to send/call
        *@param  {function} callback - user provided callback function
        *@return {object} value -Returns object or result of callback
        */

        this.getPastLogs = async (options,callback) => {
          
          var args = Array.prototype.slice.call(arguments);

          // get the callback
          callback = this._getCallback(args);

          if(typeof options.address==='undefined'){
            options.address = this._contract;
          }


          try{
              
              let logs = await this.instance.eth.getPastLogs(options); 
              
              if(typeof options.address!=='undefined'){
                return logs;
              }else{
                return callback(logs);
              }
              
          }catch(err){
            console.log("Events Failed!", err);
            return false; //may need to be improved for booleans
          }  
          
        };

	}


    methodTxnConf(txnObj=null,callback=null,type){
            if(callback!==null){
                this._callback = callback;
            }

            //set object properties
            let txn = this._altTxnObj;
            if(txnObj!==null){               
                if(typeof txnObj.gas!== 'undefined'){
                    txn.gas = txnObj.gas;
                }else{
                    txn.gas = this._gas;
                }
                if(typeof txnObj.gasPrice!== 'undefined'){
                    txn.gasPrice = txnObj.gasPrice;
                }else{
                    txn.gasPrice = this._gasPrice;
                }
                if(typeof txnObj.value!== 'undefined'){
                    txn.value = txnObj.value;
                }else{
                    txn.value = this._value;
                }                               
            }

            if(type==="call"){
                if(this._altTxnOutput!==null){
                    return this.call(txn, this._altTxnOutput);
                }else{
                    return this.call(txn);
                }
            }else if(type==="send"){                
                return this.sendTransaction(txn);                
            }else{
                throw new Error('Invalid method call');
            }
    };
       
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
        *@memberof *@desc get the current value set for gas
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
                    Object.defineProperty(obj.avmMethod, fn.name,{
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
                            obj._altTxnObj = obj.txnObj(obj._address, obj._contract, data);
                            
                            if(props.output){
                                obj._altTxnOutput = props.output; 
                            }
                            //assign values
                            return obj;//this;
                     },
                     writable: false
                    });
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

                    //define call functions
                    Object.defineProperty(obj.estimateGas, fn.name,{
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
                            
                            
                            return obj.estimateGas(txn);
                            
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
            throw new Error('Unable to initialize functions'+err);
        }
    }

    /**
    *@method initBinding
    *@memberof AVM-Contract
    *@desc assign values and create function based on abi definition
    *@param contract_address, 
    *@param abi_object, 
    *@param private_key 
    *@param web3_instance
    *@param takes the contract address, abi object, private key and web3 instance
    *@param takes the contract address, abi object, private key and web3 instance
    *@return none
    **/
	initBinding(contractAddress=null, abi=null, key=null, instance=null) {
	    if((contractAddress === null)&&(abi === null)) {
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
	
    /**
    *@desc Converts the Jar into a JarPath to be Encoded for Initialization
        *@method deploy
        *@memberof AVM-Contract
        *@param  {object} jar - path to jar file
        *@return {object} value -returns file stream
        */
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
        console.log("Configuring AVM Contract Deployment...");
		
        return this._initializer;
    }

    // Initialize & Send 
    async  initSend() {
        if(this._jarPath === null) { throw new Error('requires a jarFile to be set first through the deploy method'); }
        if(this._argsData === null) { this._argsData = this._abi.encode([], []); }
        this._initializer = this._abi.readyDeploy(this._jarPath, this._argsData);
        
        let acc = this.instance.eth.accounts.privateKeyToAccount(this._key);
                
        const txObject = {
            from: acc.address,
            data: this._initializer,
            gasPrice: 10000000000,
            gas: 5000000,
            type: '0x2'
            };

        return await this.sendTransaction(txObject);
        //return this._initializer;
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
 /**
 * @method AVM Events stuff
 */
    
 /**
 * Adds event listeners and creates a subscription, and remove it once its fired.
 *
 * @method once
 * @param {String} event
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} the event subscription
 */
 once(event, options, callback) {
    var args = Array.prototype.slice.call(arguments);

    // get the callback
    callback = this._getCallback(args);

    if (!callback) {
        throw errors.InvalidCallback('Once', 'second');
    }

    // don't allow fromBlock
    if (options)
        delete options.fromBlock;

    // don't return as once shouldn't provide "on"
    this._on(event, options, function (err, res, sub) {
        sub.unsubscribe();
        if(_.isFunction(callback)){
            callback(err, res, sub);
        }
    });

    return undefined;
 };

/**
 * Adds event listeners and creates a subscription.
 *
 * @method _on
 * @param {String} event
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} the event subscription
 */
 _on(){
    var subOptions = this._generateEventOptions.apply(this, arguments);


    // prevent the event "newListener" and "removeListener" from being overwritten
    this._checkListener('newListener', subOptions.event.name, subOptions.callback);
    this._checkListener('removeListener', subOptions.event.name, subOptions.callback);

    // TODO check if listener already exists? and reuse subscription if options are the same.

    // create new subscription
    var subscription = new Subscription({
        subscription: {
            params: 1,
            inputFormatter: [formatters.inputLogFormatter],
            outputFormatter: this._decodeEventABI.bind(subOptions.event),
            // DUBLICATE, also in web3-eth
            subscriptionHandler: function (output) {
                if(output.removed) {
                    this.emit('changed', output);
                } else {
                    this.emit('data', output);
                }

                if (_.isFunction(this.callback)) {
                    this.callback(null, output, this);
                }
            }
        },
        type: 'eth',
        requestManager: this._requestManager
    });
    subscription.subscribe('logs', subOptions.params, subOptions.callback || function () {});

    return subscription;
  };
  
 getPastEvents(){
        var subOptions = this._generateEventOptions.apply(this, arguments);
        var getPastLogs = new Method({
            name: 'getPastLogs',
            call: 'eth_getLogs',
            params: 1,
            inputFormatter: [formatters.inputLogFormatter],
            outputFormatter: this._decodeEventABI.bind(subOptions.event)
        });
        
        getPastLogs.setRequestManager(this.instance.avm._requestManager);
        var call = getPastLogs.buildCall();

        getPastLogs = null;

        return call(subOptions.params, subOptions.callback);
 }
 
 /**
 * Gets the event signature and outputformatters
 *
 * @method _generateEventOptions
 * @param {Object} event
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} the event options object
 */
 _generateEventOptions() {
    var args = Array.prototype.slice.call(arguments);

    // get the callback
    var callback = this._getCallback(args);

    // get the options
    var options = (_.isObject(args[args.length - 1])) ? args.pop() : {};

    var event = (_.isString(args[0])) ? args[0] : 'allevents';
    
    event = (event.toLowerCase() === 'allevents') ? {
            name: 'ALLEVENTS'
            //jsonInterface: this._interface
        } : {
            name: event
            //jsonInterface: this._interface
        };
    
    if (!event) {
        throw error.EventDoesNotExist(event.name);
    }

    if (!utils.isAddress(this._contract)) {
        throw errors.MissingContractAddress(true);
    }

    return {
        params: this._encodeEventABI(event, options),
        event: event,
        callback: callback
    };
 };

 /**
 * Should be used to encode indexed params and options to one final object
 *
 * @method _encodeEventABI
 * @param {Object} event
 * @param {Object} options
 * @return {Object} everything combined together and encoded
 */
_encodeEventABI(event, options) {
    options = options || {};
    var filter = options.filter || {},
        result = {};

    ['fromBlock', 'toBlock'].filter(function (f) {
        return options[f] !== undefined;
    }).forEach(function (f) {
        result[f] = formatters.inputBlockNumberFormatter(options[f]);
    });

    // use given topics
    if(_.isArray(options.topics)) {
        result.topics = options.topics;

    // create topics based on filter
    } else {

        result.topics = [];

        if(!result.topics.length)
            delete result.topics;
    }

    if(this._contract) {
        result.address = this._contract.toLowerCase();
    }

    return result;
};

 /**
 * Should be used to decode indexed params and options
 *
 * @method _decodeEventABI
 * @param {Object} data
 * @return {Object} result object with decoded indexed && not indexed params
 */
_decodeEventABI(data) {
    var event = this;
    
    data.data = data.data || '';
    data.topics = data.topics || [];
    var result = formatters.outputLogFormatter(data);
    
    // if allEvents get the right event
    if(event.name === 'ALLEVENTS') {
        /*event = event.jsonInterface.find(function (intf) {
            return (intf.signature === data.topics[0]);
        }) || {anonymous: true};*/
        event = {anonymous: true};
    }

    // create empty inputs if none are present (e.g. anonymous events on allEvents)
    event.inputs = event.inputs || [];


    var argTopics = event.anonymous ? data.topics : data.topics.slice(1);
    var _abi = new ABI();
    //result.returnValues = return data_abi.getEvents([], data.data, argTopics);
    //delete result.returnValues.__length__;
        
    // add name decode string
    //var cntr = new Contract()
    var name = _abi.coder_utils.toUtf8String(data.topics[0]).replace(/\0.*$/g,'')
    result.event = (!data.topics[0]) ? null : name;

    // add signature
    result.signature = (!data.topics[0]) ? null : data.topics[0];

    // move the data and topics to "raw"
    result.raw = {
        data: result.data,
        topics: result.topics
    };
    delete result.data;
    delete result.topics;

    return result;
};

/**
 * Get the callback and modiufy the array if necessary
 *
 * @method _getCallback
 * @param {Array} args
 * @return {Function} the callback
 */
_getCallback(args) {
    if (args && _.isFunction(args[args.length - 1])) {
        return args.pop(); // modify the args array!
    }
};
}

module.exports = Contract;