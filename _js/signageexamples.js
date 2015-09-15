var videoPlayer, videoIntro, data, products, buffer = '';

var initVideo = function () {
    videojs('videoIntro').ready(function () {
        videoPlayer = this;
        videoPlayer.load();
    });
};

var initData = function () {
    data = {
        1: {
            title: '123',
            video: '1'
        },
        2: {
            title: 'ABC',
            video: '2'
        }
    }
};

var emptyVideos = function () {
    var self = this;
    videoIntro.find('video:nth-child(1)').find('source').remove();
};

var listenStopVideo = function () {
    var stopVideo = function () {
        videoPlayer.pause();
        emptyVideos();
        // self.m_videoPlayer.load();
    };
    $('.close').on('click', function () {
        stopVideo();
    });
    $('#closeModal').on('click', function () {
        stopVideo();
    });
};

var listenItemClick = function () {
    $('.item').on('click', function () {
        var videoName = $(this).attr('data-video');
        videoPlayer.pause();
        //self.m_videoIntro.find('video:nth-child(1)').attr("src", videoUrl);
        emptyVideos();
        videoIntro.find('video:nth-child(1)').append('<source src="/video/' + videoName + '.mp4" type="video/mp4"><source src="/video/' + videoName + '.webm" type="video/webm">');
        videoPlayer.load();
        videoIntro.width('768').height('432');
        $('#videoModal').modal('show');
        videoPlayer.play();
        return false;
    })
};

var importSceneModal = function (finalBuffer) {
    var self = this;

    var $progress, $status;
    var supportsProgress;
    var loadedImageCount, imageCount;

    var $demo = $('#sceneImportWrapper');
    var $container = $demo.find('#image-container');
    $status = $demo.find('#status');
    $progress = $demo.find('progress');

    supportsProgress = $progress[0] &&
            // IE does not support progress
        $progress[0].toString().indexOf('Unknown') === -1;

    function populateScenes() {
        $container.prepend($(finalBuffer));
        $container.imagesLoaded()
            .progress(onProgress)
            .always(function () {
                $status.css({opacity: 0});
            })
            .fail(function (e) {
                //console.log('some fail ' + e)
            })
            .done(function () {
                //console.log('completed...')
            });
        // reset progress counter
        imageCount = $container.find('img').length;
        resetProgress();
        updateProgress(0);
    }

    // reset container
    $('#reset').click(function () {
        $container.empty();
        self.m_counter = 0;
    });

    function resetProgress() {
        $status.css({opacity: 1});
        loadedImageCount = 0;
        if (supportsProgress) {
            $progress.attr('max', imageCount);
        }
    }

    function updateProgress(value) {
        if (supportsProgress) {
            $progress.attr('value', value);
        } else {
            // if you don't support progress elem
            $status.text(value + ' / ' + imageCount);
        }
    }

    // triggered after each item is loaded
    function onProgress(imgLoad, image) {
        // change class if the image is loaded or broken
        var $item = $(image.img).parent();
        $item.removeClass('is-loading');
        if (!image.isLoaded) {
            $item.addClass('is-broken');
        }
        // update progress element
        loadedImageCount++;
        updateProgress(loadedImageCount);
    }
    populateScenes();

};

$(document).ready(function () {
    initData();
    videoIntro = $('#videoIntro');
    products = $('#products');
    listenStopVideo();

    $('#list').click(function (event) {
        event.preventDefault();
        $('#products .item').addClass('list-group-item');
    });

    $('#grid').click(function (event) {
        event.preventDefault();
        $('#products .item').removeClass('list-group-item');
        $('#products .item').addClass('grid-group-item');
    });

    var loadSamples = function () {
        $.each(data, function (k, item) {
            var title = item.title;
            var video = item.video;
            buffer = buffer +
                '<div class="item col-xs-4 col-lg-4" data-video="' + video + '" >' +
                '<div class="thumbnail">' +
                '<li class="is-loading">' +
                '<img class="group list-group-image" src="/_images/signage_samples/' + video + '.png" alt=""/>' +
                '</li>' +
                '<div class="caption">' +
                '<h4 class="group inner list-group-item-heading">' + title + '</h4>' +
                '</div>' +
                '</div>' +
                '</div>';
        });
        return buffer;
    };

    var finalBuffer = loadSamples();
    importSceneModal(finalBuffer);
    listenItemClick();
    initVideo();

});