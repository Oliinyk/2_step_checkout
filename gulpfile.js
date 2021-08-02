const { watch, series, src, dest,parallel } = require('gulp');
const browserSync  = require('browser-sync').create();
const reload       = browserSync.reload;
const concat       = require('gulp-concat');
const sass         = require('gulp-sass');
const del          = require('del');
const gulpIf       = require('gulp-if');
const cssnano      = require('gulp-cssnano');
const useref       = require('gulp-useref');
const uglify       = require('gulp-uglify')
const imagemin       = require('gulp-imagemin')
const config       = require('./config.js');
const webp         = require('gulp-webp');
var jpegRecompress = require('imagemin-jpeg-recompress');
var cache          = require('gulp-cache')
const list_plugins = require('./list_plugins.js');
function webp_clean(cb) {
    del.sync(config.basepath+config.devPaths.images + 'webp');
    cb();
}
function convertImageToWebp() {
    return src([config.basepath+config.devPaths.images + '**/*.{png,jpg,jpeg}', '!webp'])
        .pipe(webp())
        .pipe(dest(config.basepath+config.distPaths.images + '/webp'))
}
function convertImageToWebpdevPaths() {
    return src([config.basepath+config.devPaths.images + '**/*.{png,jpg,jpeg}', '!webp'])
        .pipe(webp())
        .pipe(dest(config.distPaths.images + '/webp'))
}
function clean(cb) {
    del.sync(config.sync.server.baseDir);
    del.sync(config.distPaths.headerFolder);
    cb();
}
function browser_sync_reload(cb) {
    browserSync.reload();
    cb();
}
function browser_sync_refresh(cb) {
    browserSync.reload({stream:true});
    cb();
}
function useref_builder() {
    return src('./'+config.devPaths.html+config.devPaths.headerTpl)
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(dest(config.distPaths.headerFolder))
}
function html_build(cb) {
    src(config.basepath+config.devPaths.headerTpl)
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano({zindex: false})))
        .pipe(dest(config.distPaths.headerFolder));
    return cb();
}
function images_build(cb) {
    src(config.distPaths.images + '**/*.{png,jpg,jpeg,webp,svg}')
        .pipe(dest(config.distPaths.headerFolder + config.devPaths.images));
    return cb();
}
function sass_tocss() {
    return src(config.basepath+config.devPaths.scss + '**/*.scss')
        // .pipe(gulpIf(!flags.production, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        // .pipe(autoprefixer({ browsers: config.settingsAutoprefixer.browsers }))
        // .pipe(gulpIf(!flags.production, sourcemaps.write()))
        .pipe(dest(config.basepath+config.devPaths.css))
}
function javascript(cb) {
    // console.log("hello");
    src(config.basepath+config.devPaths.scripts + '**/*.js')
        .pipe(dest(config.distPaths.scripts));
    cb();
}
function pluginsScripts(cb) {
        src(list_plugins.list)
        .pipe(concat('plugins.js'))
        .pipe(dest(config.basepath+config.devPaths.scripts));
    cb();
}
function css(cb) {
    src(config.basepath+config.devPaths.css + '**/*.css')
        .pipe(cssnano({zindex: false}))
        .pipe(dest(config.distPaths.css))
        .pipe(browserSync.reload({stream:true}));
    cb();
}
function html_change(cb) {
    console.log(config.basepath + '**/*.html');
    src(config.basepath + '**/*.html')
        .pipe(dest(config.distPaths.html));
    cb();
}
function browser_sync(cb) {
    browserSync.init(config.sync);
    cb();
}
function fonts() {
    return src(config.basepath+config.devPaths.fonts + '**/*.{woff,woff2,otf,ttf}')
        .pipe(dest(config.distPaths.fonts))
}
function fonts_build() {
    return src(config.basepath+config.devPaths.fonts + '**/*.{woff,woff2,otf,ttf}')
        .pipe(dest(config.distPaths.headerFolder + config.devPaths.fonts))
}
function watch_change() {
    watch(config.basepath+config.devPaths.scss+'**/*.scss', sass_tocss);
    watch(config.basepath+config.devPaths.css+'**/*.css', series(css,  browser_sync_refresh));
    watch(config.basepath+config.devPaths.scripts+'**/*.js', series(javascript,  browser_sync_reload));
    // watch('./list_plugins.js', series(pluginsScripts,  browser_sync_reload));
    watch(config.basepath+"**/*.html", series(html_change, browser_sync_reload ));
    watch(config.basepath+config.devPaths.images + '**/*.{png,jpg,jpeg,svg,webp}', series(images_clean,webp_clean, convertImageToWebpdevPaths, images, images_webp ));
    watch(config.basepath+config.devPaths.fonts+"**/*.{woff,woff2,otf,ttf}", fonts);
    // watch(config.basepath+config.devPaths.images + '**/*.webp', images_webp);
}
function images_webp() {
    return src(config.basepath+config.devPaths.images + '**/*.webp').pipe(dest(config.distPaths.images))
}
function images_clean(cb) {
    // return src(config.basepath+config.distPaths.images + '**/*.webp').pipe(dest(config.distPaths.images))
    del.sync(config.distPaths.images);
    cb();
}
function images() {
    return src(config.basepath+config.devPaths.images + '**/*.{png,jpg,jpeg,svg}')
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            jpegRecompress({
                loops:4,
                min: 50,
                max: 95,
                quality:'high'
            }),
            imagemin.optipng({optimizationLevel: 7})
        ])))
        .pipe(dest(config.distPaths.images))
}
exports.default = series(clean, webp_clean, convertImageToWebpdevPaths, images, images_webp, fonts, html_change,pluginsScripts, javascript, sass_tocss, css, browser_sync, watch_change);
exports.build = series(clean, webp_clean, convertImageToWebp, images, images_webp, fonts, html_change,pluginsScripts, javascript, sass_tocss, css, html_build,images_build,fonts_build);