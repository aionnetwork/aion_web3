# Aion Compatible Web3 

## About
This project contains tools for using the Web3 application programming interface on top of the Aion network.

## Requirements

* **Node.js** (recommended version: 10.x+) <br/>
    Download: https://nodejs.org/en/download/ <br/>
    Check version by running `node -v` in a terminal.

* **npm**  (recommended version: 6.x+) <br/>
    Typically included with node installation. <br/>
    Check version by running `npm -v` in a terminal.

**Note:** Other versions may work, but have not been thoroughly tested at present.

## Setup

```bash
git clone https://github.com/aionnetwork/aion_web3
cd aion_web3
npm install
```

or

```bash
npm install --save aion-web3
```

## API Use

This application programming interface can be used to perform different operation on the Aion blockchain.
Some example uses cases are available in the project [wiki](https://github.com/aionnetwork/aion_web3/wiki).

* Web use:<br>
    &nbsp;&nbsp;&nbsp;&nbsp;Run `npm run browserify` to produce `dist/web3.min.js` and include it in your html file
* Node use: 
    ```
    var Web3 = require('aion-web3')
    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    ```

## Documentation

For API reference and tutorials, please consult our official [documentation](https://docs.aion.network/docs/web3).

## Change Log

## AVM Notes 
The main goal of this update is to improve the AVM functionality of web3. It adds ABI binding to web3. This will improve ease of use when calling methods on a deployed contract. 

### Improvements 
AVM binding (call function using contract. method(params)) 

### Interface 
The abi definition is a line separated list. The first line represents the version. Line 2 is the name of the contract then the available methods. 

abi  = ' 

0.0 

ContractName 

int firstMethod() 

void secondMethod(String) 

public static void otherMethod(int) 

'

The interface function take the abi definition and converts it into an object representing the respective entities. 

AbiObj = web3.avm.contract.Interface(abi) 

### Initialization 
Next the binding is initialized Web3.avm.contract.initBinding(contract, abiObj, key, instance). 

contract- the address of the smart contract. 
abiObject- the object returned from the interface function. 
key- (optional) private key of the account that will send transactions 
instance- (optional) an instance of web3 initialized with a provider. This will handle the network calls 
Function call 
All functions are available as both call and send. 

####Call 
A call is a request that usually retrieve data without a change of state on the blockchain. web3.avm.contract.readOnly.methodName(param1, param2) 

####Transaction 
These are sent transactions intended state change. web3.avm.contract.transaction.methodName(param1, param2) 

####Impact 
All existing functionality of aion-web3 remains the same. For this feature only AVM related modules were changed. This was done in an effort to limit the impact of the change. 

####Limitations 
This implementation does not include automatic binding.  
Java/JavaScript float conversion results in a change in precision. 
There are no distinction between call and send transactions (readOnly/transaction) methods.  

### npm 1.2.6-beta.3 Review (Changes & New Features)
- Deploy with BigInteger argument

-Unity, three (3) new methods were added.

	Web3.eth.getSeed()
	Web3.eth.submitSeed()
	Web3.eth.submitSigniture()

avm contracts can now be deployed without specifying the type for the deployment arguments. Here is how:

-Call and send with Biginteger and Biginteger array types
-Version check is applied where an error will be thrown if the version is "0.0"
-Deploy without specifying type
	avm contracts can now be deployed without specifying the type for the deployment arguments. Here is how:

	create the abi_object using web3.avm.contract.Interface(abi)
	Initialize binding with contract address as null, the private key and abi_object must be present. web3.avm.contract.initBinding(null,abi_object,private_key)
	Instead of chaining init() chain initSend() this will send the contract deployment transaction and update the contract variable so that subsequent calls would be to that contract. web3.avm.deploy(jarPath).args([]).initSend()

-Estimate gas
	Web3.avm.contract.estimateGas.method(params)
	method would be the particular method of the contract and params are the accepted input types. When chained to estimateGas this will return and an integer value. A value of 2000000 will generally mean that something went wrong.

-Event logs
	Web3.avm.contract.getPastLogs(params,callback)
	This extends eth.getPastLogs. Address is already provided through the contract object. The parameter object is as follows:

	{

	  fromBlock : number 

	  toBlock : number

	  topics:array

	}

		fromBlock - Number (optional): The block number from which to get events from (ToDo: Defaults to contract deployment block).
		toBlock - Number (optional): The block number to get events up to (Defaults to "latest").
		topics - Array (optional): This allows manually setting the topics for the log filter.
		Promise returns Array - Array of log objects.

The structure of the returned event Object in the Array looks as follows:

address - String: From which this event originated from.
data - String: The data containing non-indexed log parameter.
topics - Array: An array with max 4 32 Byte topics, topic 1-3 contains indexed parameters of the log.
logIndex - Number: Integer of the event index position in the block.
transactionIndex - Number: Integer of the transaction’s index position, the event was created in.
transactionHash 32 Bytes - String: Hash of the transaction this event was created in.
blockHash 32 Bytes - String: Hash of the block where this event was created in. null when its still pending.
blockNumber - Number: The block number where this log was created in. null when still pending.
Callback and method-specific transaction object
Before the elements of the transaction object were available by default or set global. This new feature allows for the transaction object to be set for each method call/send. This is done through avmMethod object. tyhis new object was created to add new functionality without affecting previous implementations.

Function call backs are passed as a second parameter

Below shows how this method is used:

avmSend - represents a send operation
avmCall - represents a call operation
Web3.avm.contract.avmMethod.method(param1,param2).avmSend(txnObj,callback)
Web3.avm.contract.avmMethod.method(param1,param2).avmCall(txnObj,callback)
The format of the transaction object is as follows:

 {

   gas: number,

   gasPrice: number

   value: number,

 }

Missing values are replaced with defaults.

callbacks are any function passed that will receive the result of the method as a parameter.

If callback is supplied and no specific contract object use this format: (null, callback). if a transaction object is specified but no call this "avmCall(txnObj)"  form can be used. Setting the transaction object in this form only changes the variables for this specific call.

Update and fixes
use of optional private key functionality was throwing an error at initialization. this has been since fixed.
array param for avm abi calls throw an error. this was updated for 1D and 2D arrays. 
1.2.6-beta.1 Review (Changes & New Features)
Clinit: () 
This string is ignored when converting the abi to an object.

Web3.avm.contract.initBinding(contract, abiObj, key, instance)
        The 'key' parameter can be optionally added

### Transaction 
	These are sent transactions with intended state change. web3.avm.contract.transaction.methodName(param1, param2) 

	A transaction is called with the name of the contract method (MethodName) and the parameters for that method are passed as in a typical function.

	A transaction returns an object in the form of a transaction object returned from the send transaction.

### Customizable Transaction object
The initial functionality automatically set the values for the transaction object. This has been revised to allow the user to set their own values. Please see the new list of available methods below.

#### Transaction object methods
web3.avm.contract.setGas(value) - accepts an integer and set the value of nonce to be used for transactions. The default is 5000000.

web3.avm.contract.setGasPrice(value) - accepts an integer and set the value of nonce to be used for transactions. The default is 2000000.

web3.avm.contract.setValue(value) -  accepts an integer and set the value of nonce to be used for transactions. The default is 0.

web3.avm.contract.setNonce(value) - accepts an integer and set the value of nonce to be used for transactions. The default is null and a value is calculated for each transaction.

web3.avm.contract.setTransactionObject(obj) - accepts an integer and accept an object in the format of a transaction object. 



web3.avm.contract.getValue - return the current value for gas used to send transactions

web3.avm.contract.getGas - return the current value for gas used to send transactions

web3.avm.contract.getGasPrice - return the current value for gas used to send transactions

web3.avm.contract.getNonce - return the current value for gas used to send transactions


Some feature in the previous npm beta release might be affected. For the overall binding release, no existing feature of web3 was removed or deprecated.
Changes are new features and should not affect any previously working functionality.
