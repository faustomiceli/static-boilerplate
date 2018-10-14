import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import objectFit from 'postcss-object-fit-images';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import {onError} from './utils';
import CONFIG from './config';

const $ = gulpLoadPlugins();

const Styles = {};

var postCssConfig = [
  autoprefixer(CONFIG.autoprefixer),
  objectFit(),
];

if (CONFIG.isProduction) {
  postCssConfig.push(cssnano(CONFIG.cssNano));
}

Styles.build = () => {
  return gulp.src(['./app/styles/**/*.scss', './app/styles/**/*.css'])
    .pipe($.plumber({
      errorHandler: onError,
    }))
    .pipe($.sourcemaps.init())
    .pipe(sass({
      precision: 10
    }))
    .pipe($.postcss(postCssConfig))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/styles'))
    .pipe($.if(browserSync.active, browserSync.reload));
};

export default Styles;
