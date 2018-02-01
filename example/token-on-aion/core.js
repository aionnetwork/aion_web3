const path = require('path');
const request = require('request');
const moment = require('moment');
const Web3 = require('../../lib/web3.js');
const config = require(path.resolve(__dirname, 'config.js'));
const compile = require(path.resolve(__dirname, 'compile.js'));

const web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
// token abi
const abi = [{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint128"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint128"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint128"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint128"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"value","type":"uint128"}],"name":"mint","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint128"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint128"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint128"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint128"}],"name":"Approval","type":"event"}];
let rpcNonce = 0;

const log = (s) => {
  const now = moment();
  console.log("[" + now.format() + "] " + s);
}
module.exports.log = log;

const req = (callForm) => {
  // append the id here
  callForm.jsonrpc = "2.0";
  callForm.id = rpcNonce.toString();
  rpcNonce++;

  const options = {
    url: config.provider,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    json: callForm
  }

  return new Promise((resolve, reject) => {
    request(options, (err, resp, body) => {
      if (err)
        reject(err);
      resolve(body);
    });
  });
}

module.exports.compile = async (sourceCode) => {
  return await compile(web3, sourceCode);
}

module.exports.getAccounts = async () => {
  const resp = await req({
    method: "eth_accounts",
    params: []
  });
  return resp.result;
}

module.exports.unlockAccount = async (address, password, duration) => {
  const resp = await req({
    method: "personal_unlockAccount",
    params: [address, password, duration]
  });
  return resp.result;
}

module.exports.deploy = ({name, abi, binary}, userAddress) => {
  const options = {
    from: config.userAddress,
    gas: 2000000,
    gasPrice: 1,
    data: binary,
  };

  return new Promise((resolve, reject) => {
    web3.eth.contract(abi).new(options, (err, contract) => {
      if (err)
        reject(err);

      if (contract && contract.address)
        resolve(contract);
    });
  });
}

module.exports.createAt = (contractAddress) => {
  return web3.eth.contract(abi).at(contractAddress);
}

const getTransaction = (txHash) => {
  return new Promise((resolve, reject) => {
    web3.eth.getTransaction(txHash, (err, res) => {
      if (err)
        reject(err);
      resolve(res);
    });
  });
}

// functions below all use the contract object

module.exports.mint = async ({contract, address, value, userAddress}) => {
  const txHash = await new Promise((resolve, reject) => {
    log(address);
    log(value);
    contract.mint(address, value, {
      from: userAddress,
      gas: 100000,
      gasPrice: 1}, (err, res) => {
        if (err)
          reject(err);
        resolve(res);
      });
  });

  return txHash;
  // // TODO: verify if this logic is correct
  // while (true) {
  //   let result = null;
  //   try {
  //     result = await getTransaction(txHash);
  //   } catch (e) {
  //     result = null;
  //   }

  //   if (result)
  //     break;
  // }
  // return result;
}

module.exports.transfer = async ({contract, to, value, userAddress}) => {
  const txHash = await new Promise((resolve, reject) => {
    contract.transfer(to, value, {
      from: userAddress,
      gas: 100000,
      gasPrice: 1}, (err, res) => {
        if (err)
          reject(err);
        resolve(res);
      });
  });
}

module.exports.getBalance = ({contract, address}) => {
  return new Promise((resolve, reject) => {
    contract.balanceOf(address, (err, res) => {
      if (err)
        reject(err);
      resolve(res);
    });
  });
}