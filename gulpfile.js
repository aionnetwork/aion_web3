var path = require('path');
var fs = require('fs');
var del = require('del');
var moment = require('moment');
var gulp = require('gulp');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var exorcist = require('exorcist');
var streamify = require('gulp-streamify');

var DEST = path.join(__dirname, 'dist/');
var src = 'index';
var dst = 'web3';
var lightDst = 'web3-light';

var browserifyOptions = {
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
    var version = JSON.parse(fs.readFileSync('./package.json')).version;
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
        'console.js',
        'package-init.js',
        'package.json'
    ], {base: "aion_web3"})
    .pipe(tar('aion_web3_' + version + '_' + moment().format('YYYY-MM-DD') + '.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('release'));
});