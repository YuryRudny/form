var syntax = 'sass'

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify-es').default,
	cleancss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	notify = require('gulp-notify'),
	rsync = require('gulp-rsync'),
	imagemin = require('gulp-imagemin'),
	svgSprite = require('gulp-svg-sprite'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace'),
	gcmq = require('gulp-group-css-media-queries'),
	favicons = require("gulp-favicons");


gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	});
});

gulp.task('styles', function () {
	return gulp.src('app/' + syntax + '/**/*.' + syntax + '')
		.pipe(sass({
			outputStyle: 'expanded'
		}).on("error", notify.onError()))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(gcmq())
		.pipe(cleancss({
			level: {
				1: {
					specialComments: 0
				}
			}
		})) // Opt., comment out when debugging
		.pipe(gulp.dest('app/assets/css'))
		.pipe(browserSync.stream())
});

gulp.task('scripts', function () {
	return gulp.src([
			'app/js/common.js' // Always at the end
		])
		.pipe(concat('scripts.min.js'))
		.pipe(uglify()) // Mifify js (opt.)
		.pipe(gulp.dest('app/assets/js'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('code', function () {
	return gulp.src('app/*.html')
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('img', () => gulp.src('app/img/**/*')
	.pipe(imagemin([
		imagemin.gifsicle({
			interlaced: true
		}),
		imagemin.mozjpeg({
			quality: 75,
			progressive: true
		}),
		imagemin.optipng({
			optimizationLevel: 5
		})
	]))
	.pipe(gulp.dest('app/assets/img'))
);

gulp.task('svg', () => {
	return gulp.src('app/img/svg/*.svg')
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
				$('style').remove();
			},
			parserOptions: {
				xmlMode: true
			}
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "sprite.svg",
				}
			}
		}))
		.pipe(gulp.dest('app/assets/img/svg/'));
});

gulp.task('fav', function () {
	return gulp.src('app/img/favicon/favicon.png')
		.pipe(favicons({
			icons: {
				appleIcon: true,
				favicons: true,
				online: false,
				appleStartup: false,
				android: false,
				firefox: false,
				yandex: false,
				windows: false,
				coast: false
			}
		}))
		.pipe(gulp.dest('app/assets/img/favicon/'));
});



gulp.task('watch', function () {
	gulp.watch('app/' + syntax + '/**/*.' + syntax + '', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
	gulp.watch('app/img/svg/*.svg', gulp.parallel('svg'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
	gulp.watch('app/img/**/*', gulp.parallel('img'));
	gulp.watch('app/*.html', gulp.parallel('code'));
});
gulp.task('default', gulp.parallel('styles', 'svg', 'scripts', 'browser-sync', 'img', 'watch'));