let test_cfg = require('./_integ_test_config.js');

//console.log("Using cfg = ", test_cfg);

let should = require('should')
let Web3 = require('../')
let client = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP))

describe('send raw transaction of 1.337 aions and no data', () => {
  let opts = { 
      from: test_cfg.TEST_ACCT_ADDR,
      gas: test_cfg.GAS,
      gasPrice: test_cfg.GAS_PRICE,
  };

  let typesBin
  let typesAbi
  let ct;
  let ctInstAddress;

  before(done => {
    if( test_cfg.TEST_ACCT_ADDR.length == 0 ) { 
        done(Error("Error during setup.  No test account address was configured."));
    }
    done();
  })

  it('sendRawTransaction', done => { 
    let tx = {
        to: test_cfg.TEST_ACCT_2_ADDR,
        value: 133700000000000000,  // 0.1337 Aions
        gas: 54321
    }

    client.eth.getBalance(opts.from).then((bal) => {
        if(bal < tx.value) { 
            done(Error("Account balance too low.  Want to send "+ tx.value +" but only have "+bal));
        }
    });

    let account = client.eth.accounts.privateKeyToAccount(test_cfg.AVM_TEST_PK);
    account.signTransaction(tx, (err, res) => {
      if (err !== null && err !== undefined) {
        done(err);
      }

      console.log("Tx signed.  Sending to kernel.");
      client.eth.sendSignedTransaction(res.rawTransaction).on('receipt', (r) => {
        let txHash = r.transactionHash;
        client.eth.getTransaction(txHash, (err, res) => {
          if (err !== null && err !== undefined) {
            done(err);
          }

          client.utils.toHex(res.value).should.eql(tx.value);
          res.from.toLowerCase().should.eql(opts.from.toLowerCase());
          res.to.toLowerCase().should.eql(tx.to.toLowerCase());
          done();
        })
      });
    })

  });

})
