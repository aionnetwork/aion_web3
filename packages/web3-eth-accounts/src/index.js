/*
 * Copyright (c) 2017-2018 Aion foundation.
 *
 *     This file is part of the aion network project.
 *
 *     The aion network project is free software: you can redistribute it 
 *     and/or modify it under the terms of the GNU General Public License 
 *     as published by the Free Software Foundation, either version 3 of 
 *     the License, or any later version.
 *
 *     The aion network project is distributed in the hope that it will 
 *     be useful, but WITHOUT ANY WARRANTY; without even the implied 
 *     warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *     See the GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the aion network project source files.  
 *     If not, see <https://www.gnu.org/licenses/>.
 *
 * Contributors:
 *     Aion foundation.
 *     Fabian Vogelsteller <fabian@frozeman.de>
 */

 "use strict";

var _ = require("underscore");
var core = require('aion-web3-core');
var Method = require('aion-web3-core-method');
var Promise = require('any-promise');
var uuid = require('uuid');
var utils = require('aion-web3-utils');
var isHex = utils.isHex;
var isHexStrict = utils.isHexStrict;
var formatters = require('aion-web3-core-helpers').formatters;
var errors = require('aion-web3-core-helpers').errors;
var aionLib = require('aion-lib');
var blake2b256 = aionLib.crypto.blake2b256;
var nacl = aionLib.crypto.nacl;
var scryptsy = aionLib.crypto.scrypt;
var cryp = aionLib.crypto.node;
var Buffer = aionLib.formats.Buffer;
var toBuffer = aionLib.formats.toBuffer;
var bufferToZeroXHex = aionLib.formats.bufferToZeroXHex;
var removeLeadingZeroX = aionLib.formats.removeLeadingZeroX;
var rlp = require('aion-rlp');
var AionLong = rlp.AionLong;
var BN = require('bn.js');
var aionPubSigLen = aionLib.accounts.aionPubSigLen;

var isNot = function(value) {
    return (_.isUndefined(value) || _.isNull(value));
};

var toAionLong = function (val) {
    var num;

    if (
        val === undefined ||
        val === null ||
        val === '' ||
        val === '0x'
    ) {
      return null;
    }

    if (typeof val === 'string') {
        if (
            val.indexOf('0x') === 0 ||
            val.indexOf('0') === 0 ||
            isHex(val) === true ||
            isHexStrict(val) === true
        ) {
            num = new BN(removeLeadingZeroX(val), 16);
        } else {
            num = new BN(val, 10);
        }
    }

    if (typeof val === 'number') {
      num = new BN(val);
    }

    return new AionLong(num);
};

var Accounts = function Accounts() {
    var _this = this;

    // sets _requestmanager
    core.packageInit(this, arguments);

    // remove unecessary core functions
    delete this.BatchRequest;
    delete this.extend;

    var _ethereumCall = [
        new Method({
            name: 'getId',
            call: 'net_version',
            params: 0,
            outputFormatter: utils.hexToNumber
        }),
        new Method({
            name: 'getGasPrice',
            call: 'eth_gasPrice',
            params: 0
        }),
        new Method({
            name: 'getTransactionCount',
            call: 'eth_getTransactionCount',
            params: 2,
            inputFormatter: [function (address) {
                if (utils.isAddress(address)) {
                    return address;
                } else {
                    throw errors.InvalidParamForMethod('transactionCount', 'Address', address);
                }
            }, function () { return 'latest'; }]
        })
    ];
    // attach methods to this._ethereumCall
    this._ethereumCall = {};
    _.each(_ethereumCall, function (method) {
        method.attachToObject(_this._ethereumCall);
        method.setRequestManager(_this._requestManager);
    });


    this.wallet = new Wallet(this);
};

Accounts.prototype._addAccountFunctions = function (account) {
    var _this = this;

    // add sign functions
    account.signTransaction = function signTransaction(tx, callback) {
        return _this.signTransaction(tx, account._privateKey, callback);
    };
    account.sign = function sign(data) {
        return _this.sign(data, account._privateKey);
    };

    account.encrypt = function encrypt(password, options) {
        return _this.encrypt(account._privateKey, password, options);
    };


    return account;
};

// replaces ethlib/lib/account.js#fromPrivate
var createAionAccount = function (opts) {
    var account = aionLib.accounts.createKeyPair({
        privateKey: opts.privateKey,
        entropy: opts.entropy
    });
    account.address = aionLib.accounts.createA0Address(account.publicKey);
    return account;
};

Accounts.prototype.create = function create(entropy) {
    return this._addAccountFunctions(createAionAccount({entropy: entropy}));
};

Accounts.prototype.privateKeyToAccount = function privateKeyToAccount(privateKey) {
    return this._addAccountFunctions(createAionAccount({privateKey: privateKey}));
};

Accounts.prototype.signTransaction = function signTransaction(tx, privateKey, callback) {
    var _this = this,
        error = false,
        result;

    var account = this.privateKeyToAccount(privateKey);

    callback = callback || function () {};

    if (!tx) {
        error = errors.InvalidObject('transaction');

        callback(error);
        return Promise.reject(error);
    }

    function signed (tx) {

        if (!tx.gas && !tx.gasLimit) {
            error = errors.MissingParam('gas');
        }

        if (tx.nonce  < 0 ||
            tx.gas  < 0 ||
            tx.gasPrice  < 0 ||
            tx.type  < 0 ||
            tx.timestamp < 0) {
            error = errors.LessThanZeroError('Gas, gasPrice, nonce, type, or timestamp');
        }

        if (error) {
            callback(error);
            return Promise.reject(error);
        }

        try {
            tx = formatters.inputCallFormatter(tx);

            var transaction = tx;
            transaction.to = tx.to;
            transaction.data = tx.data;
            transaction.value = tx.value;
            transaction.timestamp = tx.timestamp || Math.floor(Date.now() * 1000);
            transaction.type = tx.type || 1;

            var rlpEncoded = rlp.encode([
                transaction.nonce,
                transaction.to,
                transaction.value,
                transaction.data,
                transaction.timestamp,
                toAionLong(transaction.gas),
                toAionLong(transaction.gasPrice),
                toAionLong(transaction.type)
            ]);

            // hash encoded message
            var hash = blake2b256(rlpEncoded);

            // sign with nacl
            var signature = toBuffer(nacl.sign.detached(hash, account._privateKey));

            // verify nacl signature
            if (nacl.sign.detached.verify(hash, signature, account.publicKey) === false) {
                throw errors.InvalidSignature(true);
            }

            // aion-specific signature scheme
            var aionPubSig = Buffer.concat([account.publicKey, signature], aionPubSigLen);

            // add the aion pub-sig
            var rawTx = rlp.decode(rlpEncoded).concat(aionPubSig);

            // re-encode with signature included
            var rawTransaction = rlp.encode(rawTx);

            result = {
                messageHash: bufferToZeroXHex(hash),
                signature: bufferToZeroXHex(aionPubSig),
                rawTransaction: bufferToZeroXHex(rawTransaction)
            };

        } catch(e) {
            callback(e);
            return Promise.reject(e);
        }

        callback(null, result);
        return result;
    }

    // Resolve immediately if nonce, type and price are provided
    if (tx.nonce !== undefined && tx.type !== undefined && tx.gasPrice !== undefined) {
        return Promise.resolve(signed(tx));
    }


    // Otherwise, get the missing info from the Ethereum Node
    return Promise.all([
        isNot(tx.gasPrice) ? _this._ethereumCall.getGasPrice() : tx.gasPrice,
        isNot(tx.nonce) ? _this._ethereumCall.getTransactionCount(_this.privateKeyToAccount(privateKey).address) : tx.nonce
    ]).then(function (args) {
        if (isNot(args[0]) || isNot(args[1])) {
            throw errors.FailureToFetch('"type", "gasPrice", or "nonce"', JSON.stringify(args))
        }
        return signed(_.extend(tx, {gasPrice: args[0], nonce: args[1]}));
    });
};

/* jshint ignore:start */
Accounts.prototype.recoverTransaction = function recoverTransaction(rawTx) {
    return this.recover(null, rlp.decode(rawTx).pop());
};
/* jshint ignore:end */

Accounts.prototype.hashMessage = function hashMessage(data) {
    var message = utils.isHexStrict(data) ? utils.hexToBytes(data) : data;
    var messageBuffer = Buffer.from(message);
    var preamble = "\u0015Aion Signed Message:\n" + message.length;
    var preambleBuffer = Buffer.from(preamble);
    var ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
    return utils.blake2b256(ethMessage);
};

Accounts.prototype.sign = function sign(data, privateKey) {
    var account = this.privateKeyToAccount(privateKey);
    var publicKey = account.publicKey;
    var hash = this.hashMessage(data);
    var signature = toBuffer(
        nacl.sign.detached(
            toBuffer(hash),
            toBuffer(privateKey)
        )
    );
    // address + message signature
    var aionPubSig = Buffer.concat(
        [toBuffer(publicKey), toBuffer(signature)],
        aionPubSigLen
    );
    return {
        message: data,
        messageHash: hash,
        signature: bufferToZeroXHex(aionPubSig)
    };
};

Accounts.prototype.recover = function recover(message, signature) {
    var sig = signature || (message && message.signature);
    var publicKey = toBuffer(sig).slice(0, nacl.sign.publicKeyLength);
    return aionLib.accounts.createA0Address(publicKey);
};

// Taken from https://github.com/ethereumjs/ethereumjs-wallet
Accounts.prototype.decrypt = function (v3Keystore, password, nonStrict) {
    /* jshint maxcomplexity: 10 */

    if(!_.isString(password)) {
        throw errors.InvalidParam('password');
    }

    var json = (_.isObject(v3Keystore)) ? v3Keystore : JSON.parse(nonStrict ? v3Keystore.toLowerCase() : v3Keystore);

    if (json.version !== 3) {
        throw errors.InvalidObjVersion('v3', 'Wallet');
    }

    var derivedKey;
    var kdfparams;
    if (json.crypto.kdf === 'scrypt') {
        kdfparams = json.crypto.kdfparams;

        // FIXME: support progress reporting callback
        derivedKey = scryptsy(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
    } else if (json.crypto.kdf === 'pbkdf2') {
        kdfparams = json.crypto.kdfparams;

        if (kdfparams.prf !== 'hmac-sha256') {
            throw errors.InvalidParamForMethod('PBKDF2');
        }

        derivedKey = cryp.pbkdf2Sync(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256');
    } else {
        throw errors.UnsupportedParam('key derivation scheme');
    }

    var ciphertext = new Buffer(json.crypto.ciphertext, 'hex');

    var mac = utils.blake2b256(Buffer.concat([derivedKey.slice(16, 32), ciphertext ])).replace('0x','');
    if (mac !== json.crypto.mac) {
        throw errors.FailedKeyDerivation();
    }

    var decipher = cryp.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.crypto.cipherparams.iv, 'hex'));
    var seed = '0x'+ Buffer.concat([ decipher.update(ciphertext), decipher.final() ]).toString('hex');

    return this.privateKeyToAccount(seed);
};

Accounts.prototype.encrypt = function (privateKey, password, options) {
    /* jshint maxcomplexity: 20 */
    var account = this.privateKeyToAccount(privateKey);

    options = options || {};
    var salt = options.salt || cryp.randomBytes(32);
    var iv = options.iv || cryp.randomBytes(16);

    var derivedKey;
    var kdf = options.kdf || 'scrypt';
    var kdfparams = {
        dklen: options.dklen || 32,
        salt: salt.toString('hex')
    };

    if (kdf === 'pbkdf2') {
        kdfparams.c = options.c || 262144;
        kdfparams.prf = 'hmac-sha256';
        derivedKey = cryp.pbkdf2Sync(new Buffer(password), salt, kdfparams.c, kdfparams.dklen, 'sha256');
    } else if (kdf === 'scrypt') {
        // FIXME: support progress reporting callback
        kdfparams.n = options.n || 8192; // 2048 4096 8192 16384
        kdfparams.r = options.r || 8;
        kdfparams.p = options.p || 1;
        derivedKey = scryptsy(new Buffer(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
    } else {
        throw errors.UnsupportedParam('kdf');
    }

    var cipher = cryp.createCipheriv(options.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv);
    if (!cipher) {
        throw errors.UnsupportedParam('cipher');
    }

    var ciphertext = Buffer.concat([
        cipher.update(account._privateKey),
        cipher.final()
    ]);

    var mac = utils.blake2b256(Buffer.concat([ derivedKey.slice(16, 32), new Buffer(ciphertext, 'hex') ])).replace('0x','');

    return {
        version: 3,
        id: uuid.v4({ random: options.uuid || cryp.randomBytes(16) }),
        address: account.address.toLowerCase().replace('0x',''),
        crypto: {
            ciphertext: ciphertext.toString('hex'),
            cipherparams: {
                iv: iv.toString('hex')
            },
            cipher: options.cipher || 'aes-128-ctr',
            kdf: kdf,
            kdfparams: kdfparams,
            mac: mac.toString('hex')
        }
    };
};


// Note: this is trying to follow closely the specs on
// http://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html

function Wallet(accounts) {
    this._accounts = accounts;
    this.length = 0;
    this.defaultKeyName = "web3js_wallet";
}

Wallet.prototype._findSafeIndex = function (pointer) {
    pointer = pointer || 0;
    if (_.has(this, pointer)) {
        return this._findSafeIndex(pointer + 1);
    } else {
        return pointer;
    }
};

Wallet.prototype._currentIndexes = function () {
    var keys = Object.keys(this);
    var indexes = keys
        .map(function(key) { return parseInt(key); })
        .filter(function(n) { return (n < 9e20); });

    return indexes;
};

Wallet.prototype.create = function (numberOfAccounts, entropy) {
    for (var i = 0; i < numberOfAccounts; ++i) {
        this.add(this._accounts.create(entropy).privateKey);
    }
    return this;
};

Wallet.prototype.add = function (account) {

    if (_.isString(account)) {
        account = this._accounts.privateKeyToAccount(account);
    }
    if (!this[account.address]) {
        account = this._accounts.privateKeyToAccount(account.privateKey);
        account.index = this._findSafeIndex();

        this[account.index] = account;
        this[account.address] = account;
        this[account.address.toLowerCase()] = account;

        this.length++;

        return account;
    } else {
        return this[account.address];
    }
};

Wallet.prototype.remove = function (addressOrIndex) {
    var account = this[addressOrIndex];
    var address;
    var addressLower;
    var index;

    if (account && account.address) {
        address = account.address;
        addressLower = address.toLowerCase();
        index = account.index;

        if (this[address] !== undefined) {
          delete this[address];
        }

        if (this[addressLower] !== undefined) {
          delete this[addressLower];
        }

        if (index !== undefined && this[index] !== undefined) {
          delete this[index];
        }

        this.length--;

        return true;
    } else {
        return false;
    }
};

Wallet.prototype.clear = function () {
    var _this = this;
    var indexes = this._currentIndexes();

    indexes.forEach(function(index) {
        _this.remove(index);
    });

    return this;
};

Wallet.prototype.encrypt = function (password, options) {
    var _this = this;
    var indexes = this._currentIndexes();

    var accounts = indexes.map(function(index) {
        return _this[index].encrypt(password, options);
    });

    return accounts;
};


Wallet.prototype.decrypt = function (encryptedWallet, password) {
    var _this = this;

    encryptedWallet.forEach(function (keystore) {
        var account = _this._accounts.decrypt(keystore, password);

        if (account) {
            _this.add(account);
        } else {
            throw errors.FailedAccountDecryption();
        }
    });

    return this;
};

Wallet.prototype.save = function (password, keyName) {
    localStorage.setItem(keyName || this.defaultKeyName, JSON.stringify(this.encrypt(password)));

    return true;
};

Wallet.prototype.load = function (password, keyName) {
    var keystore = localStorage.getItem(keyName || this.defaultKeyName);

    if (keystore) {
        try {
            keystore = JSON.parse(keystore);
        } catch(e) {

        }
    }

    return this.decrypt(keystore || [], password);
};

if (typeof localStorage === 'undefined') {
    delete Wallet.prototype.save;
    delete Wallet.prototype.load;
}


module.exports = Accounts;