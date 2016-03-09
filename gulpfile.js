'use strict'

const gulp = require('gulp')
const config = require('config')
const merge2 = require('merge2')
const through = require('through2')
const requirejs = require('requirejs')
const less = require('gulp-less')
const gutil = require('gulp-util')
const mocha = require('gulp-mocha')
const clean = require('gulp-rimraf')
const uglify = require('gulp-uglify')
const symlink = require('gulp-symlink')
const revall = require('gulp-rev-all')
const sequence = require('gulp-sequence')
const minifyCSS = require('gulp-minify-css')

gulp.task('clean', function () {
  return gulp.src([
    'public/views',
    'public/dist',
    'public/static'
  ], {read: false})
    .pipe(clean({force: true}))
})

gulp.task('mocha', function () {
  return gulp.src('test/*.js', {read: false})
    .pipe(mocha())
})

gulp.task('less', function () {
  return gulp.src('public/src/less/app.less')
    .pipe(less())
    .pipe(gulp.dest('public/static/css'))
})

gulp.task('js', function () {
  return gulp.src('public/src/js/**/*.js')
    .pipe(gulp.dest('public/static/js'))
})

gulp.task('img', function () {
  return gulp.src('public/src/img/**')
    .pipe(gulp.dest('public/static/img'))
})

gulp.task('views', function () {
  return gulp.src('public/src/views/**/*.html')
    .pipe(gulp.dest('public/views'))
})

gulp.task('bower', function () {
  return gulp.src('public/bower')
    .pipe(symlink('public/static/bower'))
})

gulp.task('bootstrap', function () {
  return gulp.src([
    'public/bower/bootstrap/dist/fonts/**',
    'public/bower/bootstrap/dist/css/bootstrap.css',
    'public/bower/bootstrap/dist/css/bootstrap.css.map'
  ], {base: 'public/bower/bootstrap/dist'})
    .pipe(gulp.dest('public/static'))
})

gulp.task('rjs-lib', function () {
  return rjs({
    baseUrl: 'public/static/js',
    mainConfigFile: 'public/static/js/main.js',
    name: '../../bower/almond/almond',
    out: 'js/lib.js',
    include: ['libraries'],
    insertRequire: ['libraries'],
    removeCombined: true,
    findNestedDependencies: true,
    optimizeCss: 'none',
    optimize: 'none',
    skipDirOptimize: true,
    wrap: false
  })
    .pipe(uglify())
    .pipe(gulp.dest('public/static'))
})

gulp.task('rjs-app', function () {
  return rjs({
    baseUrl: 'public/static/js',
    mainConfigFile: 'public/static/js/main.js',
    name: 'main',
    out: 'js/app.js',
    exclude: ['libraries'],
    removeCombined: true,
    findNestedDependencies: true,
    optimizeCss: 'none',
    optimize: 'none',
    skipDirOptimize: true,
    wrap: true
  })
    .pipe(uglify())
    .pipe(gulp.dest('public/static'))
})

gulp.task('rev', function () {
  return merge2(
    gulp.src('public/views/**/*.html', {base: 'public'}),
    gulp.src('public/static/css/*.css', {base: 'public'}).pipe(minifyCSS()),
    gulp.src([
      'public/static/js/app.js',
      'public/static/js/lib.js'
    ], {base: 'public'}).pipe(uglify()),
    gulp.src([
      'public/static/img/**',
      'public/static/fonts/**'
    ], {base: 'public'})
  )
    .pipe(revall({
      quiet: true,
      prefix: config.cdnPrefix,
      ignore: ['.html']
    }))
    .pipe(gulp.dest('public/dist'))
})

gulp.task('watch', function () {
  gulp.watch('public/src/js/**/*.js', ['js'])
  gulp.watch('public/src/views/**/*.html', ['views'])
  gulp.watch('public/src/less/**/*.less', ['less'])
  gulp.watch('public/src/img/**', ['img'])
})

gulp.task('test', sequence('mocha'))
gulp.task('dev', sequence('clean', ['js', 'less', 'img', 'views', 'bootstrap', 'bower']))
gulp.task('build', sequence('dev', ['rjs-lib', 'rjs-app'], 'rev'))
gulp.task('default', sequence('dev'))

function rjs (options) {
  var stream = through.obj()
  var path = options.out

  options.out = function (string) {
    stream.push(new gutil.File({
      path: path,
      contents: new Buffer(string)
    }))
  }

  requirejs.optimize(options, function (data) {
    stream.push(null)
  }, function (err) {
    console.error(err)
    stream.emit('error', err)
  })

  return stream
}
