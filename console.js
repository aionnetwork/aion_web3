process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var repl = require("repl");
var url = require('url');
var Web3 = require('./packages/web3');

try {
  var promptPrefix,web3;
  if (process.argv[2]) {
    var endpoint = process.argv[2];
    const myURL = url.parse(endpoint);

    switch(myURL.protocol){
    	case 'https:':
    	case 'http:':
    		web3 = new Web3(new Web3.providers.HttpProvider(endpoint));
    		break;
    	case 'ws:':
    		web3 = new Web3(new Web3.providers.WebsocketProvider(endpoint));
    		break;
      	case 'ipc:':
        	web3 = new Web3(new Web3.providers.IpcProvider(myURL.path,require('net')));
        	break;
    	default:
    		throw 'Invalid address, make sure your node address follow the format "protocol://host:port"(e.g. https://aion.node:8545). Supported protocols: http, https and ws';
      }
      promptPrefix = myURL.host || myURL.path;
  }else{
        endpoint = 'http://127.0.0.1:8545';
        console.log("connected to default", endpoint);
        web3 = new Web3(new Web3.providers.HttpProvider(endpoint));
        promptPrefix = endpoint;
  }
    


  var context = repl.start(promptPrefix + '> ').context;
  //context.web3 = new Web3(new Web3.providers.HttpProvider(endpoint));
  context.web3 = web3;
  context.eth = context.web3.eth;
  context.personal = context.web3.personal;
} catch(error) {
  console.log(error);
}
