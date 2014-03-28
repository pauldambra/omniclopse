var gulp = require('gulp');
var sass = require('gulp-sass');
var handlebars = require('gulp-ember-handlebars');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('templates', function(){
  gulp.src(['./templates/*.hbs'])
  	.pipe(handlebars({
      outputType: 'browser'
     }))
    .pipe(concat('templates.js'))
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
});

gulp.task('default', ['sass', 'templates', 'watch']);