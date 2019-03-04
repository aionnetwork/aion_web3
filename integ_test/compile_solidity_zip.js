let test_cfg = require('./_integ_test_config.js');
let formatters = require('../packages/web3-core-helpers/src/formatters.js');

console.log("Using cfg = ", test_cfg);

let should = require('should')
let Web3 = require('../')
let client = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

describe('compile solidity files', () => {
  before(done => {
    if( test_cfg.TEST_ACCT_ADDR.length == 0 ) { 
        done(Error("Error during setup. No test account address was configured."));
    }
    done();
  });

  it('compileSolidityZip', done => {
    let contracts = [
      './test/helpers/contracts/Import.sol', 
      './test/helpers/contracts/Ticker.sol', 
      './test/helpers/contracts/Wallet.sol'
    ];

    client.eth.compileSolidityZip(contracts, "Import.sol").then(console.log);
    done();
  });
});