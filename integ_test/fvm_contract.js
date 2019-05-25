let test_cfg = require('./_integ_test_config.js');

//console.log("Using cfg = ", test_cfg);

let fs = require('fs')
let path = require('path')
let async = require('async')
let Web3 = require('../')
let should = require('should')
let client = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP))
const crypto = require('crypto')

let typesBinPath = path.join(__dirname, 'contracts', 'HelloWorld.bin')
let typesAbiPath = path.join(__dirname, 'contracts', 'HelloWorld.abi')
let typesSrcPath = path.join(__dirname, 'contracts', 'HelloWorld.sol')

function random(from, to){
    return Math.floor(Math.random() * (to - from + 1)) + from
}

function deployCt(ct, ctData, args, cb) { 
    console.log("SETUP: Deploying test contract...");

    return ct.deploy( {data: ctData, arguments: args} )
        .send()
        .on('error', err => { cb(err,null) })
        .on('transactionHash', transactionHash => { console.log('transactionHash', transactionHash) })
        .on('receipt', receipt => { 
            console.log('SETUP: Received transaction receipt for contract deployment.  txHash =',
                        receipt.transactionHash, 'contractAddress =', receipt.contractAddress);
            cb(null,receipt);
        });
        //.on('confirmation', (confirmationNumber, receipt) => { console.log(confirmationNumber, receipt) });
}

describe('fvm_contracts', () => {
  let opts = { 
      from: test_cfg.TEST_ACCT_2_ADDR,
      gas: test_cfg.GAS,
      gasPrice: test_cfg.GAS_PRICE,
  };

  let ct;
  let ctInstAddress;

  let web3 = new Web3(client);

  let typesSrc;
  let typesBin;
  let typesAbi;
  let compiled;
  let contract;

  let testNumber = 31337;

  before(done => {
    if( test_cfg.TEST_ACCT_ADDR.length == 0 ) { 
        done(Error("Error during setup.  No test account address was configured."));
    }

    let steps = {    
      typesSrc: async.apply(fs.readFile, typesSrcPath),

      compiled: ['typesSrc', async.apply(function (res, cb){
          let compiled2 = web3.eth.compileSolidity(res.typesSrc.toString('utf-8'), function(err,res){ //necessary callback function
            cb(null, res);
          });

      })],

      typesBin: ['compiled', async.apply(function(res, cb){
          let bin = res.compiled['HelloWorld'].code;

          cb(null, bin);
      })], 

      typesAbi: ['compiled', async.apply(function(res, cb){
          let abi = res.compiled['HelloWorld'].info.abiDefinition;

          cb(null, abi);
      })],

      //-------------------------------------------------------------
      unlock: async.apply(client.eth.personal.unlockAccount, 
                          test_cfg.TEST_ACCT_2_ADDR , 
                          test_cfg.TEST_ACCT_2_PW),

      contract: ['typesAbi', async.apply(function (results,cb) {
          let ct = new client.eth.Contract(results.typesAbi, opts);
          cb(null, ct);
      })],

      deploy: ['unlock', 'typesBin', async.apply(function (res,cb) {
          let deployedTo;
          console.log("FVM",res);
          deployCt(res.contract, res.typesBin.toString('utf8'), [testNumber], cb)
              .catch(err => {
                  console.error("error", err);
                  return done(err);
              });
      })],
    }

    async.auto(steps, (err, res) => {

      if (err !== null && err !== undefined) {
        console.error('error reading bin & abi', err)
        return done(err)
      }

      if(! res.unlock ) { 
        return done(new Error("can't unlock"));
      }
      
      ctInstAddress = res.deploy.contractAddress;

      ct = new client.eth.Contract(res.typesAbi, ctInstAddress);

      done();
    })
  })
  

  it('fvm_contract method call with event', done => {
      ct.methods.sayHello()
          .send({from: test_cfg.TEST_ACCT_2_ADDR})
          .then(res => {
              res.events['Hello'].returnValues['_owner'].toLowerCase().should.eql(test_cfg.TEST_ACCT_2_ADDR.toLowerCase());
              res.events['Hello'].returnValues['_number'].should.eql(testNumber.toString());
              done();
          })
          .catch( err => {
              done(err);
          });
  });
})