/*
 * Configuration file for running integ tests; not an actual test.
 */

let config = {
  // Account with which deploy and send Txs (needs to have Aions for tests to work)
  TEST_ACCT_ADDR: '0xa021c766c6a9dc565f0240bb833f5f47c94c2591fe7ad5e2dc5b1dc5edceaa40',       
  // Sender account password
  TEST_ACCT_PW: 'dbothka%3TH!652#', 
  // Sender account private key (hex with leading 0x)
  TEST_ACCT_PRIVKEY: '', 

  // Account with which to receive Txs (No aion will be consumed for tests)
  OTHER_TEST_ACCT_ADDR: '',

  // Populate with max gas for transactions (recommended: 4000000)
  GAS: 4000000,             

  // Populate with gas price (recommended: 10000000000)
  GAS_PRICE: 10000000000,          

  // AVM Testnet
  AVM_TEST_PK: '742b442741b31a93cff3f9c114da4987cac8ec5fbdb1636440a735b307c05041852578c0cd4c5b1b2a39cfc692d064a5ca07c51654052e6f95f9d105e048c808',
  AVM_TEST_CT_ADDR: '',
  AVM_TEST_CT_TXN_GAS: 2000000,
  AVM_TEST_CT_DEPLOY_GAS: 5000000,
  AVM_TEST_NODESMITH_APIKEY: ''
}
module.exports = function() { 
    return config;
}();
