const 
  gulp = require(`gulp`),
  $ = require(`gulp-load-plugins`)();

let isDev = !gulp.env.p;

gulp.task(`styles`, () => gulp
  .src([`source/styles/**/*.less`, `!source/styles/_*/*.less`])
  .pipe($.plumber())
  .pipe($.if(isDev, $.sourcemaps.init()))
  .pipe($.less())
  .pipe($.autoprefixer({browsers:[`> 1%`, `last 2 versions`, `Firefox ESR`]}))
  .pipe($.cssnano())
  .pipe($.if(isDev, $.sourcemaps.write(`.`)))
  .pipe(gulp.dest(`public`))
);




gulp.task(`watch`, () => {
  gulp.watch(`source/styles/**/*.less`, [`styles`]);
});


gulp.task(`default`, [`styles`], () => {
  isDev && gulp.run(`watch`);
});