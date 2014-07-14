var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rimraf = require('gulp-rimraf');

gulp.task('clean', function() {
  gulp.src('./public/js/app.js', {read:false})
    .pipe(rimraf());
});

gulp.task('processJS', ['clean'], function(){
  gulp.src(['./public/js/*.js'])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('sass', function () {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function() {
    gulp.watch('./scss/*.scss', ['sass']);
    gulp.watch('./public/js/*.js', ['processJS']);
});

gulp.task('demon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js',
  })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', ['watch']);
});

gulp.task('default', ['sass', 'processJS', 'demon']);