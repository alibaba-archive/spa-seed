'use strict'

const gulp = require('gulp')
const merge2 = require('merge2')
const rjs = require('gulp-rjs2')
const less = require('gulp-less')
const mocha = require('gulp-mocha')
const clean = require('gulp-rimraf')
const uglify = require('gulp-uglify')
const symlink = require('gulp-symlink')
const RevAll = require('gulp-rev-all')
const sequence = require('gulp-sequence')
const minifyCSS = require('gulp-minify-css')

const cdnPrefix = ''
gulp.task('clean', function () {
  return gulp.src([
    'public/dist',
    'public/tmp'
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
    .pipe(gulp.dest('public/tmp/static/css'))
})

gulp.task('js', function () {
  return gulp.src('public/src/js/**/*.js')
    .pipe(gulp.dest('public/tmp/static/js'))
})

gulp.task('img', function () {
  return gulp.src('public/src/img/**')
    .pipe(gulp.dest('public/tmp/static/img'))
})

gulp.task('views', function () {
  return gulp.src('public/src/views/**/*.html')
    .pipe(gulp.dest('public/tmp/views'))
})

gulp.task('bower', function () {
  return gulp.src('public/bower')
    .pipe(symlink('public/tmp/static/bower'))
})

gulp.task('bootstrap', function () {
  return gulp.src([
    'public/bower/bootstrap/dist/fonts/**',
    'public/bower/bootstrap/dist/css/bootstrap.css',
    'public/bower/bootstrap/dist/css/bootstrap.css.map'
  ], {base: 'public/bower/bootstrap/dist'})
    .pipe(gulp.dest('public/tmp/static'))
})

gulp.task('rjs-lib', function () {
  return rjs({
    baseUrl: 'public/tmp/static/js',
    mainConfigFile: 'public/tmp/static/js/main.js',
    name: '../bower/almond/almond',
    out: 'lib.js',
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
    .pipe(gulp.dest('public/tmp/static/js'))
})

gulp.task('rjs-app', function () {
  return rjs({
    baseUrl: 'public/tmp/static/js',
    mainConfigFile: 'public/tmp/static/js/main.js',
    name: 'main',
    out: 'app.js',
    exclude: ['libraries'],
    removeCombined: true,
    findNestedDependencies: true,
    optimizeCss: 'none',
    optimize: 'none',
    skipDirOptimize: true,
    wrap: true
  })
    .pipe(uglify())
    .pipe(gulp.dest('public/tmp/static/js'))
})

gulp.task('revall', function () {
  let revAll = new RevAll({
    prefix: cdnPrefix,
    dontGlobal: [/\/favicon\.ico$/],
    dontRenameFile: [/\.html$/],
    dontUpdateReference: [/\.html$/],
    dontSearchFile: [/\.js$/, /images/]
  })

  return merge2([
    gulp.src('public/tmp/views/**/*.html'),
    gulp.src('public/tmp/static/css/*.css').pipe(minifyCSS({rebase: false})),
    gulp.src([
      'public/tmp/static/js/app.js',
      'public/tmp/static/js/lib.js'
    ]).pipe(uglify()),
    gulp.src([
      'public/tmp/static/img/**',
      'public/tmp/static/fonts/**'
    ])
  ])
    .pipe(revAll.revision())
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
gulp.task('build', sequence('dev', ['rjs-lib', 'rjs-app'], 'revall'))
gulp.task('default', sequence('dev'))
