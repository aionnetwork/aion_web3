process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var repl = require("repl");
var url = require('url');
var Web3 = require('./packages/web3');

try {
  if (process.argv[2]) {
    let promptPrefix;
    const myURL = url.parse(process.argv[2]);
    if(myURL.protocol == 'https:' || myURL.protocol == 'http:') {
      endpoint = process.argv[2];
      console.log('Connected to', endpoint);
      promptPrefix = myURL.host;
    } else {
      throw 'Invalid address, make sure your node address follow the format "protocol://host:port"(e.g. https://aion.node:8545). Supported protocols: http, https';
    }
  } else {
    endpoint = 'http://127.0.0.1:8545';
    console.log('Connected to default', endpoint);
    promptPrefix = endpoint;
  }

  var context = repl.start(promptPrefix + '> ').context;
  context.web3 = new Web3(new Web3.providers.HttpProvider(endpoint));
  context.eth = context.web3.eth;
  context.personal = context.web3.personal;
} catch(error) {
  console.log(error);
}
