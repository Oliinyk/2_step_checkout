// PATH for folder/files - relative to gulpfile.js
var devPaths = {
  root: 'assets/',
  allCss: 'assets/scss/plugins.scss',
  scss: 'assets/scss/',
  css: 'assets/css/',
  allScripts: 'assets/js/plugins.js',
  scripts: 'assets/js/',
  images: 'assets/images/',
  fonts: 'assets/fonts/',
  html: 'dist/',
  headerFolder: '',
  headerTpl: '*.html'
}
var distPaths = {
  root: 'dist/assets/',
  css: 'dist/assets/css/',
  scripts: 'dist/assets/js/',
  images: 'dist/assets/images/',
  fonts: 'dist/assets/fonts/',
  html: 'dist/',
  headerFolder: 'build/',
  headerTpl: 'dist/*.html'
}

// browserSync
var sync = {
  server: {
    baseDir: "./dist"
  },
}

// autoprefixer
var settingsAutoprefixer = {
  browsers: [
    'last 2 versions'
  ]
}

// critical css
var critical = {
  base: 'dist/',
  ignore: ['@font-face','content',/url\(/ /*, /.modal/,/.dropdown/*/],
  include: [/.col-/, /svg/, '.row', '.img-fluid', '.modal'],
  minify: true,
  timeout: 3000000,
  width: 2000,
  height: 1000
}


module.exports = {
    critical: critical,
    devPaths: devPaths,
    distPaths: distPaths,
    settingsAutoprefixer: settingsAutoprefixer,
    basepath: 'src/',
    sync: sync
}