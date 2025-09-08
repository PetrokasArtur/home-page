const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();

const paths = {
  html: {
    entry: 'index.html',
    watch: ['index.html', 'src/components/**/*.html'],
    dest: 'dist/'
  },
  styles: {
    entry: 'scss/main.scss',
    watch: 'scss/**/*.scss',
    dest: 'dist/css'
  },
  assets: {
    src: 'assets/**/*',
    dest: 'dist/assets'
  }
};


const del = require('del');

function clean() {
  return del(['dist']);
}

// HTML с include
function html() {
  return src(paths.html.entry, { allowEmpty: true })
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// SCSS → CSS
function styles() {
  return src(paths.styles.entry)
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Копируем assets
function assets() {
  return src(paths.assets.src).pipe(dest(paths.assets.dest));
}

// Слежение за изменениями и live reload
function watcher() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    port: 5500
  });
  watch(paths.html.watch, html);
  watch(paths.styles.watch, styles);
  watch(paths.assets.src, assets).on('change', browserSync.reload);
}

// Сборка
exports.build = series(clean, parallel(html, styles, assets));
exports.default = series(clean, parallel(html, styles, assets), watcher);
