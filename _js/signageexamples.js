var videoPlayer, videoIntro, data, products, buffer = '';

var initVideo = function () {
    videojs('videoIntro').ready(function () {
        videoPlayer = this;
        videoPlayer.load();
    });
};


var cleanName = function(i_fileName){
    var self = this;
    i_fileName = (i_fileName).toLowerCase();
    i_fileName = i_fileName.replace(/\.png/ig, '');
    i_fileName = i_fileName.replace(/[0-9]/ig, '');
    i_fileName = i_fileName.replace(/ /ig, '');
    i_fileName = i_fileName.replace(/_/ig, '');
    i_fileName = i_fileName.replace(/-/ig, '');
    return i_fileName;
}

var initData = function(){
    data = {
        1019: 'Sushi Restaurant',
        1029: 'food menu board',
        1007: 'Home and Garden',
        1009: 'Hotel Lobby',
        1016: 'Coffee Shop',
        1011: 'Hobby Shop',
        1013: 'Sports Bar',
        1014: 'Museum',
        1017: 'Bank',
        1018: 'Gas Station',
        1020: 'Casino',
        1000: 'Travel',
        1021: 'Bicycle Shop',
        1022: 'Tanning Salon',
        1023: 'Pharmacy',
        1024: 'Laser Away',
        1025: 'Dentistry',
        1026: 'Clothing store',
        1027: 'Golf club',
        1028: 'RC Heli',
        1030: 'seven eleven',
        1031: 'Subway',
        1032: 'Super market',
        1033: 'Investment Group',
        1035: 'Synagogue',
        1036: 'Dry Cleaning',
        1037: 'Ice Cream Shop',
        1038: 'Real Estate office',
        1039: 'Night Club',
        1040: 'Hockey',
        1041: 'Train Station',
        1042: 'Realtor',
        1043: 'Toy Store',
        1044: 'Indian Restaurant',
        1045: 'Library',
        1046: 'Movie Theater',
        1047: 'Airport',
        1048: 'LAX',
        100310: 'Motel',
        100301: 'Parks and Recreations',
        100322: 'Corner Bakery',
        100331: 'Retirement home',
        100368: 'Navy recruiting office',
        100397: 'Martial arts school',
        100414: 'Supercuts',
        100432: 'The UPS Store',
        100438: 'Cruise One',
        100483: 'Car service',
        100503: 'fedex kinkos',
        100510: 'veterinarian',
        100556: 'YMCA',
        100574: 'Tax services',
        100589: 'Wedding planner',
        100590: 'Cleaning services',
        100620: 'Pet Training',
        100661: 'Gymboree Kids',
        100677: 'Trader Joes',
        100695: 'Men Haircuts',
        100722: 'Jiffy Lube',
        100738: 'Toyota  car dealer',
        100747: 'Winery',
        100771: 'Savings and Loans',
        100805: 'Nail Salon',
        100822: 'Weight Watchers',
        100899: 'Dollar Tree',
        100938: 'Western Bagles',
        100959: 'Kaiser Permanente',
        300143: 'Funeral home',
        205734: 'Church',
        220354: 'College',
        206782: 'Dr Waiting Room',
        300769: 'NFL Stadium',
        301814: 'University Campus',
        303038: 'Day care',
        304430: 'GameStop',
        307713: 'Del Taco',
        305333: 'General Hospital',
        305206: 'Starbucks',
        308283: 'training and fitness',
        311519: 'High school hall',
        309365: 'Winery',
        310879: 'Law Firm',
        1001: 'Health Club',
        1002: 'Gym',
        1003: 'Flower Shop',
        1004: 'Car Dealership',
        1012: 'Pet Shop',
        1005: 'Hair Salon',
        1209: 'Motorcycle shop,lite',
        1210: 'Sushi and Grill,lite',
        1211: 'the Coffee Shop,lite',
        1212: 'Pizzeria,lite',
        1213: 'Music Store,lite',
        1214: 'Diner,lite',
        1215: 'the Hair Salon,lite',
        1216: 'Dentist,lite',
        1203: 'Jewelry,lite',
        1217: 'Crossfit,lite',
        1218: 'Copy and Print shop,lite',
        1219: 'Antique Store,lite',
        1220: 'Watch and Clock Repair Store,lite',
        1221: 'Mediterranean Cuisine,lite',
        1222: 'the Toy Store,lite',
        1223: 'Pet Store and Grooming,lite',
        1224: 'the Veterinarian,lite',
        1225: 'Tattoo Parlor,lite',
        1226: 'Camera Store,lite',
        1228: 'Bike shop,lite',
        1229: 'Gun Shop,lite',
        1230: 'Chiropractic Clinic,lite',
        1231: 'French Restaurant,lite',
        1233: 'Winery,lite',
        1232: 'Mexican Taqueria,lite',
        1234: 'Bistro Restaurant,lite',
        1235: 'Vitamin Shop,lite',
        1227: 'Tailor Shop,lite',
        1236: 'Computer Repair,lite',
        1237: 'Car Detail,lite',
        1238: 'Asian Restaurants,lite',
        1239: 'Marijuana Dispensary,lite',
        1240: 'the Church,lite',
        1241: 'Synagogue,lite',
        1242: 'Frozen Yogurt Store,lite',
        1244: 'Baby Day Care,lite',
        1052: 'Car wash,lite',
        1053: 'Smoke shop,lite',
        1054: 'Yoga place,lite',
        1055: 'Laundromat,lite',
        1056: 'Baby clothes,lite',
        1057: 'Travel agency,lite',
        1058: 'Real Estate agent,lite'
    };
}

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
        //var videoName = $(this).attr('data-video');

        var videoName = $(this).attr('data-video');
        videoName = cleanName(videoName);

        videoPlayer.pause();
        //self.m_videoIntro.find('video:nth-child(1)').attr("src", videoUrl);
        emptyVideos();
        videoIntro.find('video:nth-child(1)').append('<source src="http://videos.signage.me/samples/' + videoName + '.mp4" type="video/mp4"><source src="http://videos.signage.me/samples/' + videoName + '.webm" type="video/webm">');
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
        $.each(data, function (businessID, item) {
            var name = item.split(',')[0];
            var designed = item.split(',')[1] == 'lite' ? 'created with StudioLite' : 'created with StudioPro';
            var namePath = cleanName(name);
            buffer = buffer +
                '<div class="item col-xs-4 col-lg-4" data-video="' + namePath + '" >' +
                    '<div class="thumbnail">' +
                        '<li class="is-loading">' +
                            '<img class="group list-group-image" src="http://videos.signage.me/samples/' + namePath + '.png" alt=""/>' +
                                '</li>' +
                                '<div class="caption">' +
                            '<h4 class="group inner list-group-item-heading">' + name + '</h4>' +
                            '<h5 style="color: #8c8c8c" class="group inner list-group-item-heading">' + designed + '</h5>' +
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