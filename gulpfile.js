const gulp = require('gulp');
const watch = require('gulp-watch');
const buildCss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');

gulp.task('copy:images', function(cb) {
    return gulp.src('./assets/img/**/*.*')
        .pipe(gulp.dest('./public/img/'));
    cb();
});

gulp.task('copy:js', function(cb) {
    return gulp.src('./assets/js/**/*.js')
        .pipe(gulp.dest('./public/js/'));
    cb();
});

gulp.task('copy:fonts', function(cb) {
    return gulp.src('./assets/fonts/**/*.*s')
        .pipe(gulp.dest('./public/fonts/'));
    cb();
});

gulp.task('css', function(cb) {
    return gulp.src('./assets/sass/style.scss')
        .pipe( plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Styles',
                    sound: false,
                    message: err.message
                }
            })
        }) )

        .pipe(sourcemaps.init())
        .pipe(buildCss())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css/'));
    cb();
});

gulp.task('css:prod', function(cb) {
    return gulp.src('./assets/sass/style.scss')
        .pipe(buildCss(
            {outputStyle: 'compressed'}
        ))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 versions']
        }))
        .pipe(gulp.dest('./public/css/'));
    cb();
});

gulp.task('watch', function() {
    watch('./assets/sass/**/*.scss', function() {
        setTimeout(gulp.parallel('css'), 1000);
    });
    watch('./assets/img/**/*.*', function() {
        setTimeout(gulp.parallel('copy:images'), 1000);
    });
    watch('./assets/js/**/*.js', function() {
        setTimeout(gulp.parallel('copy:js'), 1000);
    });
    watch('./assets/fonts/**/*.*', function() {
        setTimeout(gulp.parallel('copy:fonts'), 1000);
    });
});

gulp.task('build:dev', gulp.parallel('copy:images', 'copy:js', 'copy:fonts', 'css'));

gulp.task('build:prod', gulp.parallel('copy:images', 'copy:js', 'copy:fonts', 'css:prod'));

gulp.task(
    'default',
    gulp.series(
        gulp.parallel('copy:images', 'copy:js', 'copy:fonts', 'css'),
        'watch'
    )
);
