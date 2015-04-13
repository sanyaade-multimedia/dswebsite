/**
 Web site tools and generator via index.html template files
 <!-- MAIN_CONTENT_START -->
 ...
 <!-- MAIN_CONTENT_END -->
 @method compileHeaderFooter
 **/

var gulp = require('gulp');
var express = require('express');
var gutil = require('gulp-util');
var headerfootergen = require('gulp-header-footer-gen');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var shell = require('gulp-shell');
var minifyHTML = require('gulp-minify-html');
var fs = require('fs');
var Rsync = require('rsync');
var gulpIgnore = require('gulp-ignore');
var convertEncoding = require('gulp-convert-encoding');
var gulplocaltranslate = require('gulp-local-translate');
var server;


gulp.task('compile', function (done) {
    runSequence('_makeLegacyFiles', '_headerFooterGenerator', 'rsync', done);
});

gulp.task('headerFooterGenerator', function (done) {
    runSequence('_makeLegacyFiles', '_headerFooterGenerator', done);
});



gulp.task('rsync', function () {
    var rsync = Rsync.build({
        source: '/cygdrive/c/msweb/dswebsite/',
        destination: 'root@digitalsignage.com:/var/www/sites/mediasignage.com/htdocs/',
        exclude: ['.git', '*node_modules', '*SignageStudio/', '*Spotify/']
    });
    rsync.set('progress');
    rsync.flags('avz');
    console.log('running the command ' + rsync.command());
    rsync.output(
        function (data) {
            console.log('sync: ' + data);
        }, function (data) {
            console.log('sync: ' + data);
        }
    );
    rsync.execute(function (error, stdout, stderr) {
        console.log('completed ' + error + ' ' + stdout + ' ' + stderr)
    });
});


gulp.task('liveServer', ['_watchSource'], function () {
    server = express();
    server.use(express.static('C:/msweb/dswebsite/'));
    server.listen(8002);
    browserSync({
        proxy: 'localhost:8002'
    });
});


gulp.task('_headerFooterGenerator', function () {
    gulp.src('./_source/*.html')
        .pipe(headerfootergen('./index.html')).on('error', handleError)
        .pipe(gulp.dest('./_html/'))
        .pipe(reload())
});

gulp.task('_minifyHTML', function () {
    var opts = {comments: true, spare: true};
    var condition = ['**/_html/signage_video.html','**/_html/examples.html'];
    gulp.src('./_html/*.html')
        .pipe(gulpIgnore.exclude(condition))
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./_html/'))
});

gulp.task('_watchSource', function () {
    console.log('watching source files');
    gulp.watch('./index.html', ['_headerFooterGenerator']);
    gulp.watch('./_source/*.html', ['_headerFooterGenerator']);
    gulp.watch('./css/*', ['_headerFooterGenerator']);
});


gulp.task('_makeLegacyFiles', function () {
    var d = './_html/';
    fs.createReadStream(d + 'mediaserver.html').pipe(fs.createWriteStream(d + 'signage_server.html'));
    fs.createReadStream(d + 'signage_video.html').pipe(fs.createWriteStream(d + 'reseller_video.html'));
    fs.createReadStream(d + 'signage_video.html').pipe(fs.createWriteStream(d + '_video_tutorials.html'));
    fs.createReadStream(d + 'signage_video.html').pipe(fs.createWriteStream(d + 'video_tutorials.html'));
    fs.createReadStream(d + 'info_graphics.html').pipe(fs.createWriteStream(d + 'signage.html'));
    fs.createReadStream(d + 'mediaplayer.html').pipe(fs.createWriteStream(d + 'models.html'));
    fs.createReadStream(d + 'mediaplayer.html').pipe(fs.createWriteStream(d + 'mediabox_models.html'));
    fs.createReadStream(d + 'mediaplayer.html').pipe(fs.createWriteStream(d + 'mediabox_model.html'));
    fs.createReadStream(d + 'mediaplayer.html').pipe(fs.createWriteStream(d + 'mediabox_models_cart.html'));
    fs.createReadStream(d + 'mediaplayer.html').pipe(fs.createWriteStream(d + 'media_players.html'));
    fs.createReadStream(d + 'benefits.html').pipe(fs.createWriteStream(d + 'narrowcasting.html'));
    fs.createReadStream(d + 'get_started.html').pipe(fs.createWriteStream(d + 'start_page.html'));
    fs.createReadStream(d + 'get_started.html').pipe(fs.createWriteStream(d + 'digital_signage_software.html'));
    fs.createReadStream(d + 'get_started.html').pipe(fs.createWriteStream(d + 'download.html'));
    fs.createReadStream(d + 'get_started.html').pipe(fs.createWriteStream(d + 'downloads.html'));
    fs.createReadStream(d + 'get_started.html').pipe(fs.createWriteStream(d + 'download_.html'));
    fs.createReadStream(d + 'get_started.html').pipe(fs.createWriteStream(d + 'download_1.html'));
    fs.createReadStream(d + 'get_started.html').pipe(fs.createWriteStream(d + 'download1.html'));
    fs.createReadStream(d + 'get_started.html').pipe(fs.createWriteStream(d + 'free_narrowcast.html'));
    fs.createReadStream(d + 'get_started.html').pipe(fs.createWriteStream(d + 'digital_signage_saas.html'));
    fs.createReadStream(d + 'get_started.html').pipe(fs.createWriteStream(d + 'digital_out_of_home.html'));
    fs.createReadStream(d + 'cloud_vs_server.html').pipe(fs.createWriteStream(d + 'free_digital_signage.html'));
    fs.createReadStream(d + 'content_creation.html').pipe(fs.createWriteStream(d + 'content.html'));
    fs.createReadStream(d + 'about.html').pipe(fs.createWriteStream(d + 'about_us.html'));

});


function reload() {
    if (1) {
        return browserSync.reload({
            stream: true
        });
    }
    return gutil.noop();
}


function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

/*

 gulp.task('inSequenceExample', function (done) {
 runSequence('liveServer', 'watch', done);
 });


 gulp.task('buildHeadersThenRsync', function (done) {
 runSequence('headerFooterGan', ['syncHtmlDir', 'liveServer'], done);
 });


 gulp.task('watch', function () {
 console.log('watching source files');
 gulp.watch('./index.html', ['headerFooterGan']);
 gulp.watch('./_html/*.html', ['headerFooterGan']);
 gulp.watch('./css/*', ['headerFooterGan']);
 });



 gulp.task('exampleBatMultiple', function () {
 setTimeout(function () {
 return gulp.src('*.js', {read: false})
 .pipe(shell([
 'syncer.bat'
 ]));
 }, 200);
 });


 gulp.task('testRsync', function () {
 gulp.src('./_source/*.html')
 .pipe(rsync({
 options: {
 chmod: 'ugo=rwX',
 'r': true,
 'v': true,
 'e': 'ssh',
 'delete': true,
 'verbose': true,
 'progress': true
 },
 username: 'root',
 root: '_source/',
 hostname: 'some_domain.com',
 destination: '/tmp',
 recursive: true
 }));
 });


 gulp.task('syncHtmlDir', shell.task([
 'syncer.bat'
 ]));

 gulp.task('gulpLocalTranslate', function () {
 gulp.src('./_source/*.html')
 .pipe(gulplocaltranslate('5')).on('error', handleError)
 .pipe(gulp.dest('./_tmp/'))
 .pipe(reload());
 });

 gulp.task('default', ['headerFooterGan'], function () {
 });

 gulp.task('copyJson', function () {
 gulp.src('./_source/*.json')
 .pipe(gulp.dest('./_html/'))
 });

 */

