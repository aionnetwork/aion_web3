let test_cfg = require('./_integ_test_config.js');

console.log("Using cfg = ", test_cfg);

let fs = require('fs')
let path = require('path')
let async = require('async')
let Web3 = require('../')
let should = require('should')
let client = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
const crypto = require('crypto')

let typesBinPath = path.join(__dirname, 'contracts', 'HelloWorld.bin')
let typesAbiPath = path.join(__dirname, 'contracts', 'HelloWorld.abi')

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


describe('contracts', () => {
  let opts = { 
      from: test_cfg.TEST_ACCT_ADDR,
      gas: test_cfg.GAS,
      gasPrice: test_cfg.GAS_PRICE,
  };

  let typesBin
  let typesAbi
  let ct;
  let ctInstAddress;

  let testNumber = 31337;

  before(done => {
    if( test_cfg.TEST_ACCT_ADDR.length == 0 ) { 
        done(Error("Error during setup.  No test account address was configured."));
    }

    let steps = {
      typesBin: async.apply(fs.readFile, typesBinPath),
      typesAbi: async.apply(fs.readFile, typesAbiPath),
      unlock: async.apply(client.eth.personal.unlockAccount, 
                          test_cfg.TEST_ACCT_ADDR , 
                          test_cfg.TEST_ACCT_PW),
      contract: ['typesAbi',async.apply(function (results,cb) {
          let ct = new client.eth.Contract(JSON.parse(results.typesAbi), opts);
          cb(null, ct);
      })],
      deploy: ['unlock', 'typesBin', async.apply(function (res,cb) {
          let deployedTo;
          deployCt(res.contract, res.typesBin.toString('utf8'), [testNumber], cb)
              .catch(err => {
                  console.error("error", err);
                  return done(err);
              });
      })]
    }
    async.auto(steps, (err, res) => {
      if (err !== null && err !== undefined) {
        console.error('error reading bin & abi', err)
        return done(err)
      }

      if(! res.unlock ) { 
        return done(new Error("can't unlock"));
      }

      typesBin = res.typesBin.toString('utf8')
      typesAbi = JSON.parse(res.typesAbi)
      ct = res.ct;
      ctInstAddress = res.deploy.contractAddress;

      ct = new client.eth.Contract(typesAbi, ctInstAddress);

      done()
    })
  })

  it('contract method call with event', done => {
      ct.methods.sayHello()
          .send({from: test_cfg.TEST_ACCT_ADDR})
          .then(res => {
              res.events['Hello'].returnValues['_owner'].toLowerCase().should.eql(test_cfg.TEST_ACCT_ADDR);
              res.events['Hello'].returnValues['_number'].should.eql(testNumber.toString());
              done();
          })
          .catch( err => {
              done(err);
          });
  });

})
