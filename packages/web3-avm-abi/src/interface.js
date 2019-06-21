"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });

//TODO: replace below with aion version
//var errors = __importStar(require("@ethersproject/errors"));
var errors = require('./abi-errors');
var properties_1 = require('./coder-utils');

var _constructorGuard = {};
var validBaseTypes = [
    "address", "boolean", "byte", "char", "double", "float", "int", "long", "short", "String"
];
function checkIdentifier(value) {
    if (!value.match(/^[a-z_][a-z0-9_]*$/i)) {
        errors.throwArgumentError("invalid identifier", "value", value);
    }
    return value;
}
function checkType(value) {
    var throwError = function () {
        throw new Error("invalid type", "value", value);
    };
    var match = value.match(/^([a-z0-9_]*)(|\[\]|\[\]\[\])$/i);
    if (!match) {
        throwError();
    }
    if (validBaseTypes.indexOf(match[1]) === -1) {
        throwError();
    }
    return value;
}
var ParamType = /** @class */ (function () {
    function ParamType(constructorGuard, name, type) {
        errors.checkNew(this, ParamType);
        if (constructorGuard !== _constructorGuard) {
            throw new Error("do not instantiate directly use fromString");
        }
        properties_1.defineReadOnly(this, "name", checkIdentifier(name));
        properties_1.defineReadOnly(this, "type", checkType(type));
    }
    ParamType.fromString = function (value) {
        //console.log("This is ParamType.fromString: "+value);
        var comps = value.trim().replace(/\[\s*\]/g, "[]").replace(/\s+/g, " ").split(" ");
        //console.log("comps: ["+comps.length+"] "+comps[0]+" "+comps[1]);
        if (comps.length >= 2) {
            errors.throwArgumentError("invalid param type", "value", value);
        }
        return new ParamType(_constructorGuard, comps[0].trim(), comps[0].trim());
    };
    return ParamType;
}());
exports.ParamType = ParamType;
var FunctionFragment = /** @class */ (function () {
    function FunctionFragment(constructorGuard, name, inputs, output) {
        errors.checkNew(this, FunctionFragment);
        if (constructorGuard !== _constructorGuard) {
            throw new Error("do not instantiate directly use fromString");
        }
        checkIdentifier(name);
        properties_1.defineReadOnly(this, "name", checkIdentifier(name));
        properties_1.defineReadOnly(this, "inputs", inputs.slice());
        Object.freeze(this.inputs);
        properties_1.defineReadOnly(this, "output", output);
    }
    FunctionFragment.fromString = function (value) {
        // Remove leader/trailing whitespace and remove space from brackets
        value = value.trim().replace(/\s*\[\s*\]/g, "[]");
        //console.log(value);
        // Replace multiple spaces with single space
        value = value.replace(/(\s+)/g, " ");

        // Trim off public and static
        if (value.substring(0, 7) === "public ") { value = value.substring(7); }
        if (value.substring(0, 7) === "static ") { value = value.substring(7); }

        var match = value.match(/^([a-z0-9_\]\[]+)\s+([a-z_][a-z0-9_]*)\s*\(([^)]*)\)\s*$/i);
        if (!match) {
            errors.throwArgumentError("invalid abi fragment", "value", value);
        }
        var output = match[1].trim();
        if (output === "void") {
            output = null;
        }
        else {
            output = (new ParamType(_constructorGuard, "_", match[1].trim())).type;
        }
        var name = match[2].trim();
        var inputs = [];
        if (match[3].trim() !== "") {
            inputs = match[3].split(",").map(function (input) { return ParamType.fromString(input); });
        }
        return new FunctionFragment(_constructorGuard, name.trim(), inputs, output);
    };
    return FunctionFragment;
}());
exports.FunctionFragment = FunctionFragment;
var Interface = /** @class */ (function () {
    function Interface(constructorGuard, version, name, functions) {
        errors.checkNew(this, Interface);
        if (constructorGuard !== _constructorGuard) {
            throw new Error("do not instantiate directly use fromString");
        }
        if (version !== "0.0") {
            errors.throwArgumentError("unsupported version", "version", version);
        }
        properties_1.defineReadOnly(this, "version", version);
        name = name.split(".").map(function (comp) { return checkIdentifier(comp.trim()); }).join(".");
        properties_1.defineReadOnly(this, "name", name);
        properties_1.defineReadOnly(this, "functions", functions);
        Object.freeze(this.functions);
    }
    Interface.fromString = function (abi) {
        if (typeof (abi) === "string") {
            abi = abi.split("\n");
        }
        var version = null;
        var name = null;
        var functions = [];
        abi.forEach(function (line) {
            line = line.trim();
            if (line === "") {
                return;
            }
            if (line.match(/^([0-9.]+)$/)) {
                version = line;
                return;
            }
            if (line.match(/^[a-z0-9_. ]*$/i)) {
                name = line;
                return;
            }
            functions.push(FunctionFragment.fromString(line));
        });
        return new Interface(_constructorGuard, version, name, functions);
        ;
    };
    return Interface;
}());
exports.Interface = Interface;
