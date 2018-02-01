const assert = require('chai').assert;
const core = require('../core.js');
const fs = require('fs');
const config = require('../config.js');
const log = core.log;

describe("basic tests", () => {
  it("should deploy the contract", async () => {
    const response = await core.unlockAccount(config.userAddress, "PLAT4life", 314159);
    
    const source = fs.readFileSync("token.sol", "utf-8");
    const compiled = await core.compile(source);
    const tokenInstance = await core.deploy(compiled, config.userAddress);
    log("token deployed at: " + tokenInstance.address);
    log(config.userAddress);

    await core.mint({
      contract: tokenInstance,
      address: config.userAddress,
      value: 1000000,
      userAddress: config.userAddress
    });

    log(await core.getBalance({contract: tokenInstance, address: config.userAddress}));
  });
});