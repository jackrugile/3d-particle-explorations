const gulp = require('gulp');
const source = require('vinyl-source-stream');
const rename = require('gulp-rename');
const babelify = require('babelify');
const browserify = require('browserify');
const glob = require('glob');
const es = require('event-stream');
const webserver = require('gulp-webserver');
const uglify = require('gulp-uglify');
const streamify = require('gulp-streamify');

gulp.task('build', function(done) {
	glob('./**/demo-*/index.js', function(err, files) {
		if(err) done(err);

		var tasks = files.map(function(entry) {
			return browserify({ entries: [entry] })
				.transform('babelify', {presets: ['es2015']})
				.bundle()
				.pipe(source(entry))
				.pipe(streamify(uglify()))
				.pipe(rename({
					extname: '.bundle.js'
				}))
				.pipe(gulp.dest('./dist/'));
		});
		es.merge(tasks).on('end', done);
	});
});

gulp.task('serve', function() {
	gulp.src('./')
		.pipe(webserver({
			'host': '0.0.0.0',
			'fallback': 'index.html',
			'livereload': true,
			'open': true,
			'port': '4000'
		}));
});

gulp.task('watch', ['build', 'serve'], function () {
	gulp.watch('./js/**/*.js', ['build']);
});

gulp.task('default', ['watch']);
