/*
 * Configuration file for running integ tests; not an actual test.
 */

let config = {
  // Account with which deploy and send Txs (needs to have Aions for tests to work)
  TEST_ACCT_ADDR: '',       
  // Sender account password
  TEST_ACCT_PW: '', 
  // Sender account private key (hex with leading 0x)
  TEST_ACCT_PRIVKEY: '', 

  // Account with which to receive Txs (No aion will be consumed for tests)
  OTHER_TEST_ACCT_ADDR: '',

  // Populate with max gas for transactions (recommended: 4000000)
  GAS: 4000000,             

  // Populate with gas price (recommended: 10000000000)
  GAS_PRICE: 10000000000,          

  // AVM Testnet
  AVM_TEST_PK: '',
  AVM_TEST_CT_ADDR: '',
  AVM_TEST_CT_TXN_GAS: 2000000,
  AVM_TEST_CT_DEPLOY_GAS: 5000000,
  AVM_TEST_NODESMITH_APIKEY: ''
}
module.exports = function() { 
    return config;
}();
