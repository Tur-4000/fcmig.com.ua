const gulp = require('gulp');
const watch = require('gulp-watch');
const buildCss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const svgMin = require('gulp-svgmin');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');

gulp.task('copy:images', function(cb) {
    return gulp.src('./assets/img/**/*.{jpg, png, jpeg}')
        .pipe(gulp.dest('./public/img/'));
    cb();
});

gulp.task('copy:js', function(cb) {
    return gulp.src('./assets/js/**/*.js')
        .pipe(gulp.dest('./public/js/'));
    cb();
});

gulp.task('copy:fonts', function(cb) {
    return gulp.src('./assets/fonts/**/*.*')
        .pipe(gulp.dest('./public/fonts/'));
    cb();
});

gulp.task('process:svg', function(cb) {
    return gulp.src('./assets/img/icons/*.svg')
        .pipe(svgMin({
            js2svg: {pretty: true}
        }))
        .pipe(cheerio({
            run: function($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: 'sprite.svg'
                }
            }
        }))
        .pipe(gulp.dest('./public/img/'));
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

gulp.task('build:dev', gulp.parallel('process:svg', 'copy:images', 'copy:js', 'copy:fonts', 'css'));

gulp.task('build:prod', gulp.parallel('copy:images', 'copy:js', 'copy:fonts', 'css:prod'));

gulp.task(
    'default',
    gulp.series(
        gulp.parallel('copy:images', 'copy:js', 'copy:fonts', 'css'),
        'watch'
    )
);
