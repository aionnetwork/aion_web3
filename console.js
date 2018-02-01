const repl = require("repl");
const Web3 = require('./lib/web3.js');
let endpoint = process.argv[2] || '127.0.0.1:8545';
const context = repl.start('nuco-'+ endpoint +'> ').context;
context.web3 = new Web3(new Web3.providers.HttpProvider('http://' + endpoint));
context.eth = context.web3.eth;
context.personal = context.web3.personal;