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


var formatters = require('aion-web3-core-helpers').formatters;
var Method = require('aion-web3-core-method');
var utils = require('aion-web3-utils');


var extend = function (pckg) {
    /* jshint maxcomplexity:5 */
    var ex = function (extension) {

        var extendedObject;
        if (extension.property) {
            if (!pckg[extension.property]) {
                pckg[extension.property] = {};
            }
            extendedObject = pckg[extension.property];
        } else {
            extendedObject = pckg;
        }

        if (extension.methods) {
            extension.methods.forEach(function (method) {
                if(!(method instanceof Method)) {
                    method = new Method(method);
                }

                method.attachToObject(extendedObject);
                method.setRequestManager(pckg._requestManager);
            });
        }

        return pckg;
    };

    ex.formatters = formatters;
    ex.utils = utils;
    ex.Method = Method;

    return ex;
};



module.exports = extend;

