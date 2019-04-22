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
 */

"use strict"; 

var fs = require('fs');
var ABI = require('aion-web3-codec');

class Contract {

	constructor() {
		this._abi = new ABI();

		this._initializer = null;
		this._argsData = null;
		this._jarPath = null;

		this._method = null;
		this._values = [];
		this._types = [];
	}

	// Converts the Jar into a JarPath to be Encoded for Initialization
	deploy(jar) {
	    this._jarPath = fs.readFileSync(jar);
	    return this;
	}

	// Defines the Arguments of a AVM Contract's Initializer
	args(types, values) {
		if(this._jarPath === null) { throw new Error('requires a jarFile to be set first through the deploy method'); }
        this._argsData = this._abi.encode(types, values);
        return this;
    }

    // Initialize 
    init() {
    	if(this._jarPath === null) { throw new Error('requires a jarFile to be set first through the deploy method'); }
    	if(this._argsData === null) { this._argsData = this._abi.encode([], []); }
        this._initializer = this._abi.readyDeploy(this._jarPath, this._argsData);
        console.log("Deploying AVM Contract...");
		return this._initializer;
    }

	// Sets the Method you wish to Call
    method(method) {
        this._method = method;
        return this;
    }

    // Sets the Params of the Method you wish to Call
    inputs(types, values) {
        if(this._method === null) {
            throw new Error('a method must be set first');
        }

        this._values = values;
        this._types = types;
        return this;
    }


    // Encodes the Method Call
    encode() {
        if(this._method === null) {
            throw new Error('a method must be set first');
        }

        return this._abi.encodeMethod(this._method, this._types, this._values);
    }

    // Decodes some data returned for a Method
    decode(type, data) {
        return this._abi.decode(type, data);
    }
}

module.exports = Contract;