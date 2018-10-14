'use strict';

import path from 'path';
import gulp from 'gulp';
import del from 'del';
import fs from 'fs';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';

import Scripts from './tasks/Scripts';
import Styles from './tasks/Styles';
import Watch from './tasks/Watch';

const $ = gulpLoadPlugins();
const browserSync = require('browser-sync').create();

/*
  Javascript
*/
gulp.task('lint', () => Scripts.lint());
gulp.task('scripts', () => Scripts.build());

/*
  Styles
*/
gulp.task('styles', () => Styles.build());

/*
  Images
*/
gulp.task('images:rendition', () => {
  gulp.src(['app/images/**/*.{png,jpg}', '!app/images/**/*{-low,-med,-thumb}*'])
    .pipe($.imageResize({
      width : 1440,
      height : 1440,
    }))
    .pipe($.rename({
      suffix: '-med'
    }))
    .pipe(gulp.dest('app/images'))
    .pipe($.size({title: 'images:rendition-med'}));

});

gulp.task('images', gulp.series('images:rendition', () =>
  gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}))
));

// Copy all files at the root level (app)
gulp.task('copy', () =>
  gulp.src([
    'app/*',
    '!app/*.pug'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
  return gulp.src([
    'app/**/*.pug',
    '!app/include/*.pug'
  ]).pipe($.data(function() {
    return JSON.parse(fs.readFileSync('./data/data.json'));
  })).pipe($.pug({
    pretty: true
  })).pipe($.if('*.html', $.htmlmin({
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeOptionalTags: true
  }))).pipe($.if('*.html', $.size({title: 'html', showFiles: true}))).pipe(gulp.dest('dist')).pipe(gulp.dest('.tmp'));
});

/*
  Clean
*/
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

/*
  Service worker
*/
gulp.task('copy-sw-scripts', () => {
  return gulp.src(['node_modules/sw-toolbox/sw-toolbox.js', 'app/scripts/sw/runtime-caching.js'])
    .pipe(gulp.dest('dist/scripts/sw'));
});

// See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
// an in-depth explanation of what service workers are and why you should care.
// Generate a service worker file that will provide offline functionality for
// local resources. This should only be done for the 'dist' directory, to allow
// live reload to work as expected when serving from the 'app' directory.
gulp.task('generate-service-worker', gulp.series('copy-sw-scripts', () => {
  const rootDir = 'dist';
  const filepath = path.join(rootDir, 'service-worker.js');

  return swPrecache.write(filepath, {
    // Used to avoid cache conflicts when serving on localhost.
    cacheId: pkg.name || 'web-starter-kit',
    // sw-toolbox.js needs to be listed first. It sets up methods used in runtime-caching.js.
    importScripts: [
      'scripts/sw/sw-toolbox.js',
      'scripts/sw/runtime-caching.js'
    ],
    staticFileGlobs: [
      // Add/remove glob patterns to match your directory setup.
      `${rootDir}/images/**/*`,
      `${rootDir}/scripts/**/*.js`,
      `${rootDir}/styles/**/*.css`,
      `${rootDir}/*.{html,json}`
    ],
    // Translates a static file path to the relative URL that it's served from.
    // This is '/' rather than path.sep because the paths returned from
    // glob always use '/'.
    stripPrefix: rootDir + '/'
  });
}));


// Build production files, the default task
gulp.task('default', gulp.series('clean', 'styles', 'lint', 'html', 'scripts', 'images', 'copy', 'generate-service-worker'));

/*
  Serve
*/
gulp.task('serve', gulp.series('html', 'scripts', 'styles', () => {
  browserSync.init({
    notify: false,
    open: false,
    logPrefix: 'WSK',
    scrollElementMapping: ['main', '.mdl-layout'],
    server: ['.tmp', 'app'],
    port: 3000
  });

  Watch();
}));

gulp.task('serve:dist', gulp.series('default', () =>
  browserSync.init({
    notify: false,
    open: false,
    logPrefix: 'WSK',
    scrollElementMapping: ['main', '.mdl-layout'],
    server: 'dist',
    port: 3001
  })
));
