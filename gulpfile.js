#!/usr/bin/env node

'use strict';

var lernaJSON = require('./lerna.json');
var path = require('path');

var del = require('del');
var gulp = require('gulp');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var exorcist = require('exorcist');
var bower = require('bower');
var streamify = require('gulp-streamify');
var replace = require('gulp-replace');
var exec = require('child_process').exec;

var DEST = path.join(__dirname, 'dist/');

var packages = [{
    fileName: 'aion-lib',
    expose: 'aionLib',
    src: './packages/aion-lib/src/index.js'
}, {
    fileName: 'aion-web3',
    expose: 'Web3',
    src: './packages/web3/src/index.js',
    ignore: ['xmlhttprequest', 'websocket']
}, {
    fileName: 'aion-web3-utils',
    expose: 'Web3Utils',
    src: './packages/web3-utils/src/index.js'
}, {
    fileName: 'aion-web3-eth',
    expose: 'Web3Eth',
    src: './packages/web3-eth/src/index.js'
}, {
    fileName: 'aion-web3-eth-accounts',
    expose: 'Web3EthAccounts',
    src: './packages/web3-eth-accounts/src/index.js'
}, {
    fileName: 'aion-web3-eth-contract',
    expose: 'Web3EthContract',
    src: './packages/web3-eth-contract/src/index.js'
}, {
    fileName: 'aion-web3-eth-personal',
    expose: 'Web3EthPersonal',
    src: './packages/web3-eth-personal/src/index.js'
}, {
    fileName: 'aion-web3-eth-iban',
    expose: 'Web3EthIban',
    src: './packages/web3-eth-iban/src/index.js'
}, {
    fileName: 'aion-web3-eth-abi',
    expose: 'Web3EthAbi',
    src: './packages/web3-eth-abi/src/index.js'
},{
    fileName: 'aion-web3-eth-ens',
    expose: 'EthEns',
    src: './packages/web3-eth-ens/src/index.js'
},{
    fileName: 'aion-web3-net',
    expose: 'Web3Net',
    src: './packages/web3-net/src/index.js'
}, {
    fileName: 'aion-web3-providers-ipc',
    expose: 'Web3IpcProvider',
    src: './packages/web3-providers-ipc/src/index.js'
}, {
    fileName: 'aion-web3-providers-http',
    expose: 'Web3HttpProvider',
    src: './packages/web3-providers-http/src/index.js',
    ignore: ['xmlhttprequest']
}, {
    fileName: 'aion-web3-providers-ws',
    expose: 'Web3WsProvider',
    src: './packages/web3-providers-ws/src/index.js',
    ignore: ['websocket']
}, {
    fileName: 'aion-web3-core-subscriptions',
    expose: 'Web3Subscriptions',
    src: './packages/web3-core-subscriptions/src/index.js'
}, {
    fileName: 'aion-web3-core-requestmanager',
    expose: 'Web3RequestManager',
    src: './packages/web3-core-requestmanager/src/index.js'
}, {
    fileName: 'aion-web3-core-promievent',
    expose: 'Web3PromiEvent',
    src: './packages/web3-core-promievent/src/index.js'
}, {
    fileName: 'aion-web3-core-method',
    expose: 'Web3Method',
    src: './packages/web3-core-method/src/index.js'
}];

var browserifyOptions = {
    debug: true,
    // standalone: 'Web3',
    derequire: true,
    insertGlobalVars: false, // jshint ignore:line
    detectGlobals: true,
    bundleExternal: true
};

var ugliyOptions = {
    compress: {
        dead_code: true,  // jshint ignore:line
        drop_debugger: true,  // jshint ignore:line
        global_defs: {      // jshint ignore:line
            "DEBUG": false      // matters for some libraries
        }
    }
};

gulp.task('version', function () {
    if (!lernaJSON.version) {
        throw new Error("version property is missing from lerna.json");
    }

    var version = lernaJSON.version;
    var jsonPattern = /"version": "[.0-9\-a-z]*"/;
    var jsPattern = /version: '[.0-9\-a-z]*'/;
    var glob = [
        './package.json',
        './bower.json',
        './package.js'
    ];

    return gulp.src(glob, {base: './'})
        .pipe(replace(jsonPattern, '"version": "' + version + '"'))
        .pipe(replace(jsPattern, "version: '" + version + "'"))
        .pipe(gulp.dest('./'));
});

gulp.task('bower', gulp.series('version', function (cb) {
    bower.commands.install().on('end', function (installed) {
        console.log(installed);
        cb();
    });
}));

gulp.task('lint', function () {
    return gulp.src(['./lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', gulp.series('lint', function (cb) {
    del([DEST]).then(cb.bind(null, null));
}));

packages.forEach(function (pckg, i) {
    var prevPckg = (!i) ? 'clean' : packages[i - 1].fileName;

    gulp.task(pckg.fileName, gulp.series(prevPckg, function () {
        browserifyOptions.standalone = pckg.expose;

        var pipe = browserify(browserifyOptions)
            .require(pckg.src, { expose: pckg.expose })
            .require('bn.js', { expose: 'BN' }) // expose it to dapp developers
            .add(pckg.src);

        if (pckg.ignore) {
            pckg.ignore.forEach(function (ignore) {
                pipe.ignore(ignore);
            });
        }

        return pipe.bundle()
            .pipe(exorcist(path.join(DEST, pckg.fileName + '.js.map')))
            .pipe(source(pckg.fileName + '.js'))
            .pipe(streamify(babel({
                compact: false,
                presets: ['env']
            })))
            .pipe(gulp.dest(DEST))
            .pipe(streamify(babel({
                compact: true,
                presets: ['env']
            })))
            .pipe(streamify(uglify(ugliyOptions)))
            .on('error', function (err) { console.error(err); })
            .pipe(rename(pckg.fileName + '.min.js'))
            .pipe(gulp.dest(DEST));
    }));
});


gulp.task('publishTag', function () {
    exec("git commit -am \"add tag v"+ lernaJSON.version +"\"; git tag v"+ lernaJSON.version +"; git push origin v"+ lernaJSON.version +";");
});

gulp.task('watch', function () {
    gulp.watch(['./packages/web3/src/*.js'], gulp.series('lint', 'default'));
});

gulp.task('all', gulp.series('version', 'lint', 'clean', packages[packages.length - 1].fileName));

gulp.task('default', gulp.series('version', 'lint', 'clean', packages[0].fileName));

