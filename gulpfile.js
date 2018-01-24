var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

var DEST = 'build/',
    PROJECT_FILE_NAME = 'custom';

gulp.task('scripts', function() {
    return gulp.src([
            'src/js/helpers/*.js',
            'src/js/*.js',
        ])
        .pipe(concat(PROJECT_FILE_NAME + '.js'))
        .pipe(gulp.dest(DEST + '/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(DEST + '/js'))
        .pipe(browserSync.stream());
});

var compileSASS = function(filename, options) {
    return sass('src/scss/app.scss', options)
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat(filename))
        .pipe(gulp.dest(DEST + '/css'))
        .pipe(browserSync.stream());
};

gulp.task('sass', function() {
    return compileSASS(PROJECT_FILE_NAME + '.css', {});
});

gulp.task('sass-minify', function() {
    return compileSASS(PROJECT_FILE_NAME + '.min.css', {
        style: 'compressed'
    });
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './production/index.html'
    });
});

gulp.task('watch', function() {
    // Watch .html files
    gulp.watch('production/*.html', browserSync.reload);
    // Watch .js files
    gulp.watch('src/js/*.js', ['scripts']);
    // Watch .scss files
    gulp.watch(['src/scss/**/*.scss', 'src/scss/*.scss'], ['sass', 'sass-minify']);
});

// Default Task
gulp.task('default', ['browser-sync', 'watch']);
