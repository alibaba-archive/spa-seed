fs = require('fs')
gulp = require('gulp')
rev = require('gulp-rev')
less = require('gulp-less')
mocha = require('gulp-mocha')
clean = require('gulp-clean')
jshint = require('gulp-jshint')
concat = require('gulp-concat')
coffee = require('gulp-coffee')
uglify = require('gulp-uglify')
usemin = require('gulp-usemin')
replace = require('gulp-replace')
imagemin = require('gulp-imagemin')
minifyCss = require('gulp-minify-css')
coffeelint = require('gulp-coffeelint')
gulpSequence = require('gulp-sequence')

pkg = require('./package.json')
version = 'v' + pkg.version.replace(/[^\.]+$/, 'x')

src = 'public/src'
paths = {
  images: ["#{src}/img/**"]
  views: ["#{src}/views/**"]
  less: ["#{src}/css/*.less"]
  coffee: ["#{src}/js/*.coffee"]
  lessMain: ["#{src}/css/main.less"]
  fonts: ['public/bower_components/bootstrap/dist/fonts/**']
  libCSS: ['public/bower_components/bootstrap/dist/css/bootstrap.css']
}

gulp.task('clean', ->
  gulp.src(['public/dist/*', 'public/tmp/*', '!public/tmp/bower_components'])
    .pipe(clean({force: true}))
)

gulp.task('jshint', ->
  gulp.src(['app.js', 'controllers/*.js', 'api/*.js', 'modules/*.js', 'test/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
)

gulp.task('mocha', ->
  gulp.src('test/*.js', {read: false})
    .pipe(mocha())
)

gulp.task('coffeelint', ->
  gulp.src(paths.coffee)
    .pipe(coffeelint('coffeelint.json'))
    .pipe(coffeelint.reporter())
)

gulp.task('less', ->
  gulp.src(paths.lessMain)
    .pipe(less())
    .pipe(gulp.dest("public/tmp/css"))
)

gulp.task('coffee', ->
  gulp.src(paths.coffee)
    .pipe(coffee())
    .pipe(gulp.dest("public/tmp/js"))
)

gulp.task('images', ->
  gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest("public/tmp/img"))
)

gulp.task('fonts', ->
  gulp.src(paths.fonts)
    .pipe(gulp.dest("public/tmp/fonts"))
)

gulp.task('views', ->
  gulp.src(paths.views)
    .pipe(gulp.dest('public/tmp/views'))
)

gulp.task('bower_components', (done) ->
  dir = "#{__dirname}/public"
  fs.exists("#{dir}/tmp/bower_components", (exist) ->
    return done() if exist
    fs.symlink("#{dir}/bower_components", "#{dir}/tmp/bower_components", done)
  )
)

gulp.task('watch', ->
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.views, ['views']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.scripts, ['coffee']);
)

gulp.task('test', gulpSequence('jshint', 'mocha'))
gulp.task('web', gulpSequence('coffeelint', 'clean', ['bower_components', 'fonts', 'less', 'coffee', 'views', 'images']))
gulp.task('default', gulpSequence('web'))

# gulp.task('build', gulpSequence('dev', 'usemin-dist', 'move-dist'))
