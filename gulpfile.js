const gulp = require('gulp');

// gulp.task('hello', async function() {
//     console.log('Hello, World!');
// });

gulp.task('hello', function(done) {
    console.log('Hello, World!');
    done();
});

gulp.task('default', gulp.series('hello'));
