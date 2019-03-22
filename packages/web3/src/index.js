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
 *   Aion foundation.
 *   Fabian Vogelsteller <fabian@ethereum.org>
 *   Gav Wood <gav@parity.io>
 *   Jeffrey Wilcke <jeffrey.wilcke@ethereum.org>
 *   Marek Kotewicz <marek@parity.io>
 *   Marian Oancea <marian@ethereum.org>
 */

"use strict";


var version = require('../package.json').version;
var core = require('aion-web3-core');
var Eth = require('aion-web3-eth');
var Net = require('aion-web3-net');
var Avm = require('aion-web3-avm');
var Personal = require('aion-web3-eth-personal');
var errors = require('aion-web3-core-helpers').errors;
var utils = require('aion-web3-utils');

var Web3 = function Web3() {
    var _this = this;

    // sets _requestmanager etc
    core.packageInit(this, arguments);

    this.version = version;
    this.utils = utils;

    this.eth = new Eth(this);
    this.avm = new Avm(this);

    // overwrite package setProvider
    var setProvider = this.setProvider;

    this.setProvider = function (provider, net) {
        setProvider.apply(_this, arguments);

        this.eth.setProvider(provider, net);

        return true;
    };
};

Web3.version = version;
Web3.utils = utils;
Web3.modules = {
    Eth: Eth,
    Net: Net,
    Avm: Avm,
    Personal: Personal
};

core.addProviders(Web3);

module.exports = Web3;

