'use strict';

const path = require('path');
const fs = require('fs');
const del = require('del');
const moment = require('moment');
const gulp = require('gulp');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
const browserify = require('browserify');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const exorcist = require('exorcist');
const streamify = require('gulp-streamify');

const DEST = path.join(__dirname, 'dist/');
const src = 'index';
const dst = 'web3';
const lightDst = 'web3-light';

const browserifyOptions = {
    debug: true,
    insertGlobalVars: false, 
    detectGlobals: false,
    bundleExternal: true
};

gulp.task('lint', [], function(){
    return gulp.src(['./*.js', './lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', ['lint'], function(cb){
    del([ DEST ]).then(cb.bind(null, null));
});

gulp.task('browser', ['clean'], function () {
    return browserify(browserifyOptions)
        .require('./' + src + '.js', {expose: 'web3'})
        .ignore('bignumber.js')
        .require('./lib/utils/browser-bn.js', {expose: 'bignumber.js'}) // fake bignumber.js
        .add('./' + src + '.js')
        .bundle()
        .pipe(exorcist(path.join( DEST, lightDst + '.js.map')))
        .pipe(source(lightDst + '.js'))
        .pipe(gulp.dest( DEST ))
        .pipe(streamify(uglify()))
        .pipe(rename(lightDst + '.min.js'))
        .pipe(gulp.dest( DEST ));
});

gulp.task('node', ['clean'], function () {
    return browserify(browserifyOptions)
        .require('./' + src + '.js', {expose: 'web3'})
        .require('bignumber.js')
        .add('./' + src + '.js')
        .ignore('crypto')
        .bundle()
        .pipe(exorcist(path.join( DEST, dst + '.js.map')))
        .pipe(source(dst + '.js'))
        .pipe(gulp.dest( DEST ))
        .pipe(streamify(uglify()))
        .pipe(rename(dst + '.min.js'))
        .pipe(gulp.dest( DEST ));
});

gulp.task('build', ['lint', 'clean', 'browser', 'node']);

gulp.task('watch', function() {
    gulp.watch(['./lib/*.js'], ['lint', 'build']);
});

gulp.task('release', function () {
    const version = JSON.parse(fs.readFileSync('./package.json')).version;
    gulp.src([
        'example/**/*.js',
        'example/**/*.sol',
        'lib/**/*.js',
        'test/**/*.js',
        'test/**/*.sol',
        'gulpfile.js',
        'LICENSE',
        'LICENSE_WEB3JS',
        'README.md',
        'index.js',
        'package-init.js',
        'package.json'
    ], {base: "aion_web3"})
    .pipe(tar('aion_web3_' + version + '_' + moment().format('YYYY-MM-DD') + '.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('release'));
});