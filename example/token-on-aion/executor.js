const path = require('path');
const core = require('./core.js');
const tokens = require('./token.js');
const config = require('./config.js');
const fs = require('fs');
const log = require('./core.js').log;

const unlock = async () => {
  let unlocked = false;
  try {
    await core.unlockAccount(config.userAddress, "PLAT4life", 314159);
  } catch (e) {
    // do nothing here
  }
  return unlocked;
}

module.exports.execute = async (statement) => {

  if (statement.token === tokens.DEPLOY) {
    await unlock();
    const source = fs.readFileSync(path.resolve(__dirname, 'token.sol'), "utf-8");
    const compiled = await core.compile(source);
    const tokenInstance = await core.deploy(compiled, config.userAddress);
    log("token deployed at: " + tokenInstance.address);
    log("please set the contractAddress field in your config to this address");
  }

  //{contract, address, value, userAddress}
  if (statement.token === tokens.MINT) {
    await unlock();
    const tokenInstance = core.createAt(config.contractAddress);
    const response = await core.mint({
      contract: tokenInstance,
      address: statement.address,
      value: statement.value,
      userAddress: config.userAddress
    });
    log("transaction sent: " + response);
  }

  if (statement.token === tokens.TRANSFER) {
    await unlock();
    const tokenInstance = core.createAt(config.contractAddress);
    //{contract, to, value, userAddress}
    const response = await core.transfer({
        contract: tokenInstance,
        to: statement.address,
        value: statement.value,
        userAddress: config.userAddress
    });
  }

  if (statement.token === tokens.BALANCE) {
    const tokenInstance = core.createAt(config.contractAddress);
    log(JSON.stringify(tokenInstance));
    const balance = await core.getBalance({
      contract: tokenInstance,
      address: statement.address
    });
    log("address: " + statement.address + " has balance: " + balance);
  }
}