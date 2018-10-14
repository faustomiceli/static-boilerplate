import gulp from 'gulp';
import browserSync from 'browser-sync';
import c from 'ansi-colors';

const watch = function() {
  // Styles
  gulp.watch(['app/styles/**/*.{scss,css}'], gulp.series('styles'))
    .on('change', path => console.log(`${c.magenta('[CSS]')} File ${c.green(path)} changed`));

  // Scripts
  gulp.watch(['app/scripts/**/*.js'], gulp.series('lint', 'scripts'))
    .on('change', path => console.log(`${c.magenta('[JS]')} File ${c.green(path)} changed`));

  // Pug
  gulp.watch(['app/**/*.pug'], gulp.series('html'))
    .on('change', path => console.log(`${c.magenta('[HTML]')} File ${c.green(path)} changed`));

  // Images
  gulp.watch(['app/images/**/*']).on('change', path => {
    console.log(`${c.magenta('[IMG]')} File ${c.green(path)} changed`);
    browserSync.reload;
  });
};

export default watch;
