let test_cfg = require('./_integ_test_config.js');
let should = require('should');
let path = require('path');
let BN = require('bn.js');
let Web3 = require('../');

let jarPath = path.join(__dirname, 'contracts', 'Counter.jar')
let web3 = new Web3(new Web3.providers.HttpProvider("http://172.105.13.72:8545"));
//let acc = web3.eth.accounts.privateKeyToAccount(test_cfg.AVM_TEST_PK);

//const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
async function unlock() {

let unlock = await web3.eth.personal.unlockAccount("0xa0b02605c0a3dacc00670592abad8e75333f735a41ca645a9a76bc127c0bb490", "123456", 600);
console.log(unlock);
}

//unlock();