const 
  gulp = require(`gulp`),
  babelify = require(`babelify`),
  browserify = require(`browserify`),
  through2 = require(`through2`),
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
  .pipe(gulp.dest(`public/styles`))
);

gulp.task(`scripts`, () => gulp
  .src([`source/scripts/**/*.js`, `!source/scripts/_*/*.js`])
  .pipe($.plumber())
  .pipe($.if(isDev, $.sourcemaps.init()))
  .pipe(through2.obj((file, enc, next) => browserify(file.path)
    .transform(babelify, {presets: [`es2015`]})
    .bundle((err, res) => next(null, Object.assign(file, {contents: res})))
  ))
  .pipe($.uglify())
  .pipe($.if(isDev, $.sourcemaps.write(`.`)))
  .pipe(gulp.dest(`public/scripts`))
);

gulp.task(`plugins`, () => gulp
  .src(`source/plugins/**/*`)
  .pipe(gulp.dest(`public/plugins`))
);

gulp.task(`watch`, () => {
  gulp.watch(`source/styles/**/*.less`, [`styles`]);
  gulp.watch(`source/scripts/**/*.js`, [`scripts`]);
});


gulp.task(`default`, [`styles`, `scripts`, `plugins`], () => {
  isDev && gulp.run(`watch`);
});