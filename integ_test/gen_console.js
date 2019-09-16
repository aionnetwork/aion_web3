let test_cfg = require('./_integ_test_config.js');

let fs = require('fs')
let path = require('path')
let async = require('async')
let Web3 = require('../')
let should = require('should')
let client = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP_2))
let rustClient = new Web3(new Web3.providers.HttpProvider(test_cfg.RUST_IP))
var chai = require('chai');
var assert = chai.assert;

describe('General Tests', () => {
  
  it('Get block 1000', done => {
      client.eth.getBlock(1000).then(res => {
        assert.equal(res.number,1000,"Get Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Get current block number', done => {
      client.eth.getBlockNumber().then(res => {
        assert.isNumber(res,"Get Current Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('unlock account', done => {
      client.eth.personal.unlockAccount(test_cfg.TEST_ACCT_2_ADDR,test_cfg.TEST_ACCT_2_PW,6000).then(res => {
        assert.isTrue(res,"Unlock Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Rust Get block 1000', done => {
      rustClient.eth.getBlock(1000).then(res => {
        assert.equal(res.number,1000,"Rust Get Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Rust Get current block number', done => {
      rustClient.eth.getBlockNumber().then(res => {
        assert.isNumber(res,"Rust Get Current Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Rust unlock account', done => {
      rustClient.eth.personal.unlockAccount(test_cfg.TEST_ACCT_3_ADDR,test_cfg.TEST_ACCT_3_PW,6000).then(res => {
        assert.isTrue(res,"Rust Unlock Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  /*it('Send transaction with unlocked account', done => {
      log{}
      client.eth.signTransaction().then(console.log);
  });*/
  
})