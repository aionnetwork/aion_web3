/*
 * Configuration file for running integ tests; not an actual test.
 */

let config = {
   
  // Sender account private key (hex with leading 0x)
  TEST_ACCT_PRIVKEY: '0xc0a97b1d6d68f3aed19e1d460287efcfd9e93cd294dd86963e08ab24622e4fc6b7dfe3a9fd46fbd034687a6c2a3ddfd61896b8e7521402369383d6a52a591a5b', 

  // Account with which to receive Txs (No aion will be consumed for tests)
  OTHER_TEST_ACCT_ADDR: '0xa0b88269779d225510ca880ed742e445db0c70efb1ee3159b6d56479ae3501f9',

  AVM_TEST_PK: '0x8e5807f76a59a7bfaaf984227ddbec970be044ebde700aac0ada199173a86417434293b7adca45ba11afb140b7fe802403f30583391b423c8696bc0cf9b9dcb0',

  AVM_TEST_CT_ADDR: '0xa0ddef877dba8f4e407f94d70d83757327b9c9641f9244da3240b2927d493ebc',

  TEST_ACCT_PW: 'dbothka%3TH!652#', 

  TEST_ACCT_ADDR: '0xa01808b94c436725b561d72c1915097babacd2e5f273de6b39274e3e64c3285d',
  // Populate with max gas for transactions (recommended: 4000000)
  GAS: 4000000,                   
  // Populate with gas price (recommended: 10000000000)
  GAS_PRICE: 10000000000, 
  AVM_TEST_CT_TXN_GAS: 2000000,
  AVM_TEST_CT_DEPLOY_GAS: 5000000,

}
module.exports = function() { 
    return config;
}();