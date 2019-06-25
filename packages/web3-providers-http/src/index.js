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
 *     Marek Kotewicz <marek@parity.io>
 *     Marian Oancea
 *     Fabian Vogelsteller <fabian@frozeman.de>
 */

var errors = require('aion-web3-core-helpers').errors;
var XHR2 = require('xhr2-cookies').XMLHttpRequest // jshint ignore: line
var http = require('http');
var https = require('https');


/**
 * HttpProvider should be used to send rpc calls over http
 */
var HttpProvider = function HttpProvider(host, options) {
    options = options || {};
    this.host = host || 'http://localhost:8545';
    if (this.host.substring(0,5) === "https"){
        this.httpsAgent = new https.Agent({ keepAlive: true });
    }else{
        this.httpAgent = new http.Agent({ keepAlive: true });
    }
    this.timeout = options.timeout || 0;
    this.headers = options.headers;
    this.connected = false;
};

HttpProvider.prototype._prepareRequest = function(){
    var request = new XHR2();
    request.nodejsSet({
        httpsAgent:this.httpsAgent,
        httpAgent:this.httpAgent
    });

    request.open('POST', this.host, true);
    request.setRequestHeader('Content-Type','application/json');
    request.timeout = this.timeout && this.timeout !== 1 ? this.timeout : 0;
    request.withCredentials = true;

    if(this.headers) {
        this.headers.forEach(function(header) {
            request.setRequestHeader(header.name, header.value);
        });
    }

    return request;
};

/**
 * Should be used to make async request
 *
 * @method send
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
HttpProvider.prototype.send = function (payload, callback) {
    var _this = this;
    var request = this._prepareRequest();

    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.timeout !== 1) {
            var result = request.responseText;
            var error = null;

            try {
                result = JSON.parse(result);
            } catch(e) {
                error = errors.InvalidResponse(request.responseText);
            }

            _this.connected = true;
            callback(error, result);
        }
    };

    request.ontimeout = function() {
        _this.connected = false;
        callback(errors.ConnectionTimeout(this.timeout));
    };

    try {
        request.send(JSON.stringify(payload));
    } catch(error) {
        this.connected = false;
        callback(errors.InvalidConnection(this.host));
    }
};

HttpProvider.prototype.disconnect = function () {
    //NO OP
};


module.exports = HttpProvider;
