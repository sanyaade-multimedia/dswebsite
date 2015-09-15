var videoPlayer, videoIntro, data, buffer = '';

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

$(document).ready(function () {

    initData();
    videoIntro = $('#videoIntro');
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
                ' <img class="group list-group-image" src="/_images/signage_samples/' + video + '.png" alt=""/>' +
                '<div class="caption">' +
                '<h4 class="group inner list-group-item-heading">' + title + '</h4>' +
                '</div>' +
                '</div>' +
                '</div>';
        });


        $('#products').append(buffer);
        $('#products').imagesLoaded()
            .always(function (instance) {
                console.log('all images loaded');
            })
            .done(function (instance) {
                console.log('all images successfully loaded');
            })
            .fail(function () {
                console.log('all images loaded, at least one is broken');
            })
            .progress(function (instance, image) {
                var result = image.isLoaded ? 'loaded' : 'broken';
                console.log('image is ' + result + ' for ' + image.img.src);
            });

        listenItemClick();
    };

    initVideo();
    loadSamples();


});