var Accounts = require("./../packages/web3-eth-accounts");
var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();
var accounts = require('./fixtures/accounts');


describe("eth", function () {
    describe("accounts", function () {

        accounts.forEach(function (test, i) {

            it("sign data using a string", function() {
                var ethAccounts = new Accounts();

                var data = ethAccounts.sign(test.message, test.privateKey);

                assert.equal(data.signature, test.signature);
            });

            it("sign data using a utf8 encoded hex string", function() {
                var ethAccounts = new Accounts();

                var data = web3.utils.isHexStrict(test.message) ? test.message : web3.utils.utf8ToHex(test.message);
                var data = ethAccounts.sign(data, test.privateKey);

                assert.equal(data.signature, test.signature);
            });


            it("recover signature using a string", function() {
                var ethAccounts = new Accounts();

                var address = ethAccounts.recover(test.message, test.signature);

                assert.equal(address, test.address);
            });

            // disabled because we don't support signing prefixed messages currently
            xit("recover signature using a string and preFixed", function() {
                var ethAccounts = new Accounts();

                var address = ethAccounts.recover(ethAccounts.hashMessage(test.message), test.signature, true);

                assert.equal(address, test.address);
            });

            it("recover message hash", function() {
                var ethAccounts = new Accounts();

                var signed = ethAccounts.sign(test.message, test.privateKey);

                var sigObj = {
                   messageHash: ethAccounts.hashMessageAion(test.message),
                   signature: signed.signature
                };
                var signature = signed.signature;
                var address = ethAccounts.recover(sigObj);

                assert.equal(address, test.address);
            });

            it("recover signature (pre encoded) using a signature object", function() {
                var ethAccounts = new Accounts();

                var data = web3.utils.isHexStrict(test.message) ? test.message : web3.utils.utf8ToHex(test.message);
                var signed = ethAccounts.sign(data, test.privateKey);
                var address = ethAccounts.recover(signed);

                assert.equal(address, test.address);
            });

            it("recover signature using a signature object", function() {
                var ethAccounts = new Accounts();

                var signed = ethAccounts.sign(test.message, test.privateKey);
                var address = ethAccounts.recover(signed);

                assert.equal(address, test.address);
            });

            it("recover signature (pre encoded) using aion-pub-sig", function() {
                var ethAccounts = new Accounts();

                var data = web3.utils.isHexStrict(test.message) ? test.message : web3.utils.utf8ToHex(test.message);
                var signed = ethAccounts.sign(data, test.privateKey);
                var signature = signed.signature;
                var address = ethAccounts.recover(test.message, signature);

                assert.equal(address, test.address);
            });

        });
    });


  describe("should properly sign arbitrary messages in different fashions", () => {
    it("should sign a message in a fashion that can be recovered (AION compliant)", () => {
      const accs = new Accounts();
      const acc = accs.create();

      const inputMsg = "hello world!";
      const out = acc.sign(inputMsg, acc.privateKey);
      const outputAddress = acc.recover(inputMsg, out.signature);
      assert.equal(outputAddress, acc.address);
    });

    it("should fail when signature is incorrect (AION compliant)", () => {
      const accs = new Accounts();
      const acc = accs.create();

      const inputMsg = "good day sir!";

      const wrongInputMsg = "good day to you too!";
      const wrongSignature = acc.sign(wrongInputMsg);

      let caughtError = false;
      try {
        const outputAddress = acc.recover(inputMsg, wrongSignature);
      } catch (e) {
        // do nothing, this is expected case
        caughtError = true;
      }

      assert.equal(caughtError, true);
    });

    it("should sign a message in a fashion that can be recovered", () => {
      const accs = new Accounts();
      const acc = accs.create();

      const inputMsg = "hello world!";
      const out = acc.signMessage(inputMsg);

      const outputAddress = acc.recoverMessage(inputMsg, out.signature);
      assert.equal(outputAddress, acc.address);
    });

    it("should fail when signature is incorrect", () => {
      const accs = new Accounts();
      const acc = accs.create();

      const inputMsg = "good day sir!";

      const wrongInputMsg = "good day to you too!";
      const wrongSignature = acc.signMessage(wrongInputMsg);

      let caughtError = false;
      try {
        const outputAddress = acc.recoverMessage(inputMsg, wrongSignature);
      } catch (e) {
        // do nothing, this is expected case
        caughtError = true;
      }

      assert.equal(caughtError, true);
    });
  });
});
