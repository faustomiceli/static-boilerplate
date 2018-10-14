import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import named from 'vinyl-named-with-path';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import browserSync from 'browser-sync';
import {onError} from './utils';
import CONFIG from './config';

const $ = gulpLoadPlugins();

const Scripts = {};

Scripts.build = () => {
  var webPackOpt = {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
    devtool: 'source-map',
    resolve: {
      alias: {
        UTILS: `${__dirname}/../app/scripts/Utils`,
        PARTIAL: `${__dirname}/../app/scripts/Partial`,
      }
    },
    externals: {
      jquery: 'jQuery',
    },
    output: {
      filename: '[name].js'
    },
    optimization: {
      minimizer: [
        new UglifyJSPlugin(CONFIG.uglify),
      ],
    },
    plugins: []
  };

  if (CONFIG.isProduction) {
    webPackOpt.mode = 'production';
  }

  return gulp.src(['./app/scripts/main.js'])
    .pipe($.plumber({
      errorHandler: onError,
    }))
    .pipe(named())
    .pipe(webpackStream(webPackOpt, webpack))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe($.if(browserSync.active, browserSync.reload));
};

Scripts.lint = () => {
  return gulp.src(['app/scripts/**/*.js','!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
};


export default Scripts;
