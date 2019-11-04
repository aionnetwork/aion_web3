let test_cfg = require('./_integ_test_config.js');

//console.log("Using cfg = ", test_cfg);

let fs = require('fs')
let path = require('path')
let async = require('async')
let Web3 = require('../')
let should = require('should')
//let client = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP))
let client = new Web3(new Web3.providers.HttpProvider(test_cfg.RUST_IP))
const crypto = require('crypto');

var chai = require('chai');
var assert = chai.assert;

let typesBinPath = path.join(__dirname, 'contracts', 'HelloWorld.bin')
let typesAbiPath = path.join(__dirname, 'contracts', 'HelloWorld.abi')
let typesSrcPath = path.join(__dirname, 'contracts', 'HelloWorld.sol')

function random(from, to){
    return Math.floor(Math.random() * (to - from + 1)) + from
}

function deployCt(ct, ctData, args) { 
    console.log("SETUP: Deploying test contract...");

      return ct.deploy( {data: ctData, arguments: args} )
        .send()
        .on('error', err => { cb(err,null) })
        .on('transactionHash', transactionHash => { console.log('transactionHash', transactionHash) })
        .on('receipt', receipt => { 
            console.log('SETUP: Received transaction receipt for contract deployment.  txHash =',
                        receipt.transactionHash, 'contractAddress =', receipt.contractAddress);
            //return receipt.contractAddress//cb(null,receipt);
      });
        //.on('confirmation', (confirmationNumber, receipt) => { console.log(confirmationNumber, receipt) });
}

describe('fvm_rust_contracts', () => {
  let opts = { 
      from: test_cfg.TEST_ACCT_2_ADDR,
      gas: test_cfg.GAS,
      gasPrice: test_cfg.GAS_PRICE,
  };

  let rustOpts = { 
      from: test_cfg.TEST_ACCT_2_ADDR,
      gas: test_cfg.GAS,
      gasPrice: test_cfg.GAS_PRICE,
  };

  let ct;
  let rCt;
  let ctInstAddress;
  let rustctInstAddress;

  let web3 = new Web3(client);
  //let web3R = new Web3(rustClient);

  let typesSrc;
  let typesBin;
  let typesAbi;
  let compiled;
  let contract;

  let typesSrcR;
  let typesBinR;
  let typesAbiR;
  let compiledR;
  let contractR;

  let testNumber = 31337;

  before(done => {
    if( test_cfg.TEST_ACCT_2_ADDR.length == 0 ) { 
        done(Error("Error during setup.  No test account address was configured."));
    }

    typesSrc = fs.readFileSync(typesSrcPath,"utf8");
    web3.eth.compileSolidity(typesSrc).then((res)=>{
      compiled =  res;
      typesBin = compiled['HelloWorld'].code;
      typesAbi = compiled['HelloWorld'].info.abiDefinition;

      client.eth.personal.unlockAccount(test_cfg.TEST_ACCT_2_ADDR,test_cfg.TEST_ACCT_2_PW,600);
      ct = new client.eth.Contract(typesAbi, opts);

      let smartContract = deployCt(ct, typesBin.toString('utf8'), [testNumber])
          .then((res) => {
            ctInstAddress = res._address;
            ct = new client.eth.Contract(typesAbi, ctInstAddress); 
            
            return done();            
      },(err)=>{
          console.error("Rust Deploy error: ", err);
          return done(err);
      });                        

    });

  });
  

  it('fvm_contract method call with event', done => {
      
      //console.log("#CONTRACT#",ct);

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

  it('fvm_contract incrementCounter method call ', done => {
      ct.methods.incrementCounter(250)
          .send({from: test_cfg.TEST_ACCT_2_ADDR})
          .then(res => {
              assert.isTrue(res.status,"Send Failed!");
              done();
          })
          .catch( err => {
              done(err);
          });
  });

   it('fvm_contract decrementCounter method call ', done => {
      ct.methods.decrementCounter(250)
          .send({from: test_cfg.TEST_ACCT_2_ADDR})
          .then(res => {
              assert.isTrue(res.status,"Send Failed!");
              done();
          })
          .catch( err => {
              done(err);
          });
  });

  it('fvm_contract getCount method call ', done => {
      ct.methods.getCount()
          .call({from: test_cfg.TEST_ACCT_2_ADDR})
          .then(res => {
              assert.equal(res,200,"Call Failed!");
              done();
          })
          .catch( err => {
              done(err);
          });
  });

})