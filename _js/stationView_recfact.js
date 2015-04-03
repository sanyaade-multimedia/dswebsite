/*/////////////////////////////////////////////

 stationView.js

 /////////////////////////////////////////////*/

var commBroker = new ComBroker();
var globs      = {};


globs['WAITSCREENON']           = 'WAITSCREENON';
globs['WAITSCREENOFF']          = 'WAITSCREENOFF';
globs['SCREEN_WIDTH']           = 0;
globs['IMAGE_RELOAD_COUNTER']   = 0;
globs['IMAGE_PATH']             = '';
globs['SELECTED_STATION_ID']    = '';
globs['STATION_UPDATE_TIMER']   = null;
globs['STATION_UPDATE_TIME']    = 60000;


$(document).ready(function(){

    initUserAgent();
    setDebugMode();

    if ($.browser.msie && $.browser.version < 10){
        alert('You are using an unsupported browser, please use IE10+, Chrome, Safari or mobile browser!')
        return;
    }

    $("#stationViewerID" ).on( "pageinit", function( event ) {
        bindScreenSizeQueries();
    });

    $("#settingsPageID" ).on( "pageinit", function( event ) {
        $('#refreshRate').val(globs['STATION_UPDATE_TIME']/1000);
        $('#refreshRate').slider('refresh');
        $('#refreshRate').on('slidestop',function(){
            localStorage.setItem("refreshRate", ($(this).val()*1000));
            setStationsTimer();
        });
    });


    var ajax = new AjaxRPC(15000);
    commBroker.setService('ajax', ajax)

    var refreshRate = localStorage.getItem("refreshRate");
    if (refreshRate)
        globs['STATION_UPDATE_TIME'] = refreshRate;

    var loginComponent = new LoginComponent(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWS-debug.php' : 'https://secure.dynawebs.net/_php/msWS.php');

    // only pass autnetication if credentials are of a standard user
    loginComponent.typeAccountEnforce('USER');

    var key     = initKey();
    var data    = {'@functionName':'f_accountType'}

    commBroker.listen(loginComponent.ALERT_MSG,function(event){
        $('#dialogTextID').text(event.edata);
        $.mobile.changePage('#dialogMessageID');
    });

    commBroker.listen(globs.WAITSCREENON,function(e){
        loginUIState(false);
        $.mobile.showPageLoadingMsg("a", "Authenticating");
    });

    commBroker.listen(globs.WAITSCREENOFF,function(e){
        loginUIState(true);
        $.mobile.hidePageLoadingMsg();
    });


    // moved function up due to firefox bug
    function onAccountType(data){
        var accountType = data == null ? null : data.responce['accountType'];
        wireStationView();
        getStationsList();
        $.mobile.changePage('#stationViewerID');


    }

    if (key===undefined) {

        wireLogin(loginComponent);
        setTimeout(function(){
            $.mobile.changePage('#loginPage');
        },3000);

    } else {

        var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php' : 'https://secure.dynawebs.net/_php/msWSsec.php');
        ajaxWrapper.getData(data,onAccountType);
        return;
    }

});


function setStationsTimer(){

    var refreshRate = localStorage.getItem("refreshRate");
    if (refreshRate)
        globs['STATION_UPDATE_TIME'] = refreshRate;

    clearInterval(globs['STATION_UPDATE_TIMER']);
    globs['STATION_UPDATE_TIMER'] = setInterval(function(){
        refreshStationStatus();
    },globs['STATION_UPDATE_TIME'])
}

function refreshStationStatus(){

    log('getting stattions...');
    var data = {
        '@functionName':'f_getStationList'
    }

    var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php' : 'https://secure.dynawebs.net/_php/msWSsec.php');
    ajaxWrapper.getData(data,onServerReply);

    function onServerReply(data){
        var counter = 0;
        var stationsArray = data.responce['Stations']['Station'];
        for (var i = 0 ; i < stationsArray.length ; i++ ) {
            o = stationsArray[i];
            switch (o['@attributes'].connection) {
                case    '2': { color = 'yellow'; break;}
                case    '1': { color = 'green'; break;}
                default:     { color = 'red'; break;}
            }

            var id = o['@attributes'].id;
            var name = o['@attributes'].name;
            var status = o['@attributes'].status;
            var lastUpdate = o['@attributes'].lastUpdate;
            var os = o['@attributes'].os;
            var totalMemory = o['@attributes'].totalMemory;
            var peakMemory = o['@attributes'].peakMemory;
            var appVersion = o['@attributes'].appVersion;
            var runningTime = o['@attributes'].runningTime;
            var airVersion = o['@attributes'].airVersion;
            var watchDogConnection = o['@attributes'].watchDogConnection;

            if (status.length<2)
                status = "not connected";

            // $('#stationList').listview('refresh');

            $('.station').each(function(){
                info = $.data(this, "stationInfo");
                if ( id == info.stationID ){
                    $.data(this, "stationInfo", {
                        'stationID': id,
                        'name': name,
                        'status': status,
                        'lastUpdate': lastUpdate,
                        'os': os,
                        'totalMemory': totalMemory,
                        'peakMemory': peakMemory,
                        'appVersion': appVersion,
                        'airVersion': airVersion,
                        'runningTime': runningTime,
                        'watchDogConnection': watchDogConnection
                    });
                    $(this).find('circle').attr('fill', color);
                    $(this).find('.lastUpdate').html('<span class="lastUpdate" style="margin-left:0px; font-size: 1em">Last update: '+ lastUpdate + ' seconds ago<br/></span>');
                    $(this).find('.lastStatus').html('<a class="lastStatus" style="float: left" data-transition="slide">Last status:'+status+'</a>');
                    $(this).find('.lastRunTime').html('<span class="lastRunTime" style="margin-left:0px; font-size: 1em">Running time: '+ runningTime +'</span>');

                    if ( globs['SELECTED_STATION_ID'] == info.stationID ){
                        $(this).trigger('tap',{manual: true});
                    }

                }
            })
        }
        $('#stationList').listview('refresh');
    }
}


function sendStationEvent(i_eventName, i_eventValue){

    var data = {
        '@functionName':'f_sendStationEvent',
        '@stationID': globs['SELECTED_STATION_ID'],
        '@eventName': i_eventName,
        '@eventValue': i_eventValue
    }
    $('#eventSendButton').button('disable');
    var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php' : 'https://secure.dynawebs.net/_php/msWSsec.php');
    ajaxWrapper.getData(data,onServerReply);

    function onServerReply(data){
        var s = data.responce['eventName'];
        switch (s) {
            case 'rebootPlayer': {
                buttonEnable('#reloadCommand', true)
                break;
            }
            default: {
                $('#eventSendButton').button('enable');
            }

        }


    }
}


function getStationsList(){

    $('#stationList').empty();

    var data = {
        '@functionName':'f_getStationList'
    }
    $.mobile.showPageLoadingMsg("a", "Loading");
    var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php' : 'https://secure.dynawebs.net/_php/msWSsec.php');
    ajaxWrapper.getData(data,onServerReply);

    function onServerReply(data){
        $.mobile.hidePageLoadingMsg();
        var counter = 0;

        if (data.responce['Stations']==undefined)
            return;

        var stationsArray = data.responce['Stations']['Station'];
        if (stationsArray.length==undefined)
            stationsArray = new Array(stationsArray);

        for (var i = 0 ; i < stationsArray.length ; i++ ) {
            o = stationsArray[i];
            switch (o['@attributes'].connection) {
                case    '2': { color = 'yellow'; break;}
                case    '1': { color = 'green'; break;}
                default:     { color = 'red'; break;}
            }

            var id = o['@attributes'].id;
            var name = o['@attributes'].name;
            var status = o['@attributes'].status;
            var lastUpdate = o['@attributes'].lastUpdate;
            var os = o['@attributes'].os;
            var totalMemory = o['@attributes'].totalMemory;
            var peakMemory = o['@attributes'].peakMemory;
            var appVersion = o['@attributes'].appVersion;
            var runningTime = o['@attributes'].runningTime;
            var airVersion = o['@attributes'].airVersion;
            var watchDogConnection = o['@attributes'].watchDogConnection;

            if (status.length<2)
                status = "not connected";

            var stationHTML =   '<li data-role="list-divider" data-theme="c" >' + o['@attributes'].name + '</li>'+
                '<li data-theme="c" class="station">'+
                '<span style="float:left; padding-left: 7px" id="stationIcon'+i+'"></span>'+
                '<a class="lastStatus" style="float: left" data-transition="slide">Last status:'+status+'</a>'+
                '<div style="padding-left: 4em" class="stationDetailsDiv">'+
                '<span class="lastUpdate" style="margin-left:10px; font-size: 0.8em">'+
                'Last update: '+ lastUpdate + ' seconds ago<br/>'+
                '</span>'+
                '<span class="lastRunTime" style="margin-left:10px; font-size: 0.5em">Running time: '+ runningTime +'</span>'+
                '</div>'+
                '</span>'+
                '</li>';

            $('#stationList').append(stationHTML);
            $('#stationList').listview('refresh');
            // $( "#stationList" ).trigger( "updatelayout" );
            latestLI = $( "#stationList" ).children().filter('.station:last-child');

            $.data(latestLI[0], "stationInfo", {    'stationID': id,
                'name': name,
                'status': status,
                'lastUpdate': lastUpdate,
                'os': os,
                'totalMemory': totalMemory,
                'peakMemory': peakMemory,
                'appVersion': appVersion,
                'airVersion': airVersion,
                'runningTime': runningTime,
                'watchDogConnection': watchDogConnection
            });

            // Station was tapped in grid or via auto server update
            $('.station').tap(function(e, i_data){

                if (!i_data) {
                    $('.station').removeClass('currentSelectedStation');
                    $(e.currentTarget).addClass('currentSelectedStation');
                }

                var ajax = commBroker.getService('ajax');
                ajax.abortAll();
                ajax.resumeAll();

                e.stopImmediatePropagation();
                selStation = e.currentTarget;
                info = $.data(selStation, "stationInfo");
                $('#stationName').text(info.name);
                $('#selName').text(info.name);
                $('#selOS').text(info.os);
                $('#selAirVer').text(info.airVersion);
                $('#selPlayerVer').text(info.appVersion);
                $('#selPeakMem').text(info.peakMemory);
                $('#selTotMem').text(info.totalMemory);
                $('#selRunning').text(info.runningTime);
                $('#selWD').text(info.watchDogConnection == 1 ? 'On' : 'Off');
                $('#selLastUpd').text(info.lastUpdate);

                // update was specifically using finger
                if (!i_data) {
                    // globs['IMAGE_PATH'] = '';
                    $('#snapShotImage').attr('src',globs['IMAGE_PATH']);
                    $('#snapShotSpinner').hide();
                    $('#snapShotImage').hide();
                    $( "#mypanel").panel( "open");
                }

                globs['SELECTED_STATION_ID'] = info.stationID;
                return false;

            });

            setTimeout(function(x,color){
                $('#stationIcon'+x).append( $('<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><g><circle stroke="black" id="svg_1" fill="'+color+'" stroke-width="2" r="16" cy="20" cx="20"/></g></svg>'));
                refreshSize();
                $( "#stationPanel" ).trigger( "updatelayout" );
                $('#stationList').listview('refresh');

            },500,i,color);

            // $(window).resetBreakpoints();
            // $(window).setBreakpoints({distinct: $('#distinct').is(":checked")});
            // $(window).resize();
        }

        $('#stationList').listview('refresh');
        setStationsTimer();

    }
}


function listenToImageLoad(){
    $('#snapShotImage').one('load',function(e){
        $('#snapShotSpinner').hide();
        $('#snapShotImage').attr('src',globs['IMAGE_PATH']);
        $('#snapShotImage').fadeIn('slow');
        buttonEnable('#liveSnapshotID', true);
    });
}

function wireStationView(){

    $('#snapShotSpinner').fadeOut();
    $('#snapShotImage').fadeOut();

    // fail load image
    $('#snapShotImage').error(function(e){

        globs['IMAGE_RELOAD_COUNTER']++;

        // timeout
        if (globs['IMAGE_RELOAD_COUNTER'] > 6) {
            $('#snapShotSpinner').fadeOut('slow');
            globs['IMAGE_RELOAD_COUNTER'] = 0;
            buttonEnable('#liveSnapshotID', true)
            return;
        }
        setTimeout(function(){
            $('#snapShotImage').attr('src',globs['IMAGE_PATH']);
        },1500)
    });

    $('#logoutID').tap(function(e){
        $.removeCookie('digitalsignage', {path: '/'});
        var url = 'https://secure.dynawebs.net/_php/msPortal.php?logout=1';
        $(location).attr('href',url);
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    $('#reloadCommand').tap(function(e){
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();

        if (!buttonIsEnabled('#reloadCommand'))
            return false;
        buttonEnable('#reloadCommand', false);

        sendStationEvent('rebootPlayer', '');

    });

    $('#playCommand,#stopCommand').tap(function(e){

        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();

        var command = 'playCommand' == e.currentTarget.id ? 'start' : 'stop';

        switch (command) {
            case 'start': {
                if (!buttonIsEnabled('#playCommand'))
                    return false;
                buttonEnable('#playCommand', false);
                break;
            }
            case 'stop': {
                if (!buttonIsEnabled('#stopCommand'))
                    return false;
                buttonEnable('#stopCommand', false);
                break;
            }
        }
        var data = {
            '@functionName':'f_sendPlayAndStop',
            '@stationID': globs['SELECTED_STATION_ID'],
            '@command': command
        }
        var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php?'+getEpochTime() : 'https://secure.dynawebs.net/_php/msWSsec.php?'+getEpochTime());
        ajaxWrapper.getData(data,onSnapshotReply);
        function onSnapshotReply(data){
            buttonEnable('#playCommand', true);
            buttonEnable('#stopCommand', true);
            if (data.responce['status'] == 'pass'){}
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    $('#uptotop').on('click', function() {
        $('body').animate({scrollTop: '0px'}, 500, function(){ $('body').clearQueue(); });
    });

    $('#eventSendButton').tap(function(){
        sendStationEvent('event',$('#sendEventID').val());
    });

    $('#liveSnapshotID').on('tap', function(e) {

        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();

        if (!buttonIsEnabled(this) )
            return false;
        buttonEnable('#liveSnapshotID', false);

        globs['IMAGE_PATH'] = '';
        $('#snapShotImage').attr('src',globs['IMAGE_PATH']);
        buttonEnable('#liveSnapshotID', false);
        $('#snapShotImage').hide();
        $('#snapShotSpinner').fadeIn('slow');
        var data = {
            '@functionName':'f_captureScreen',
            '@stationID': globs['SELECTED_STATION_ID'],
            '@quality': 1,
            '@time': getEpochTime()
        }

        var ajaxWrapper = new AjaxJsonGetter(globs['debug'] ? 'https://secure.dynawebs.net/_php/msWSsec-debug.php?'+getEpochTime() : 'https://secure.dynawebs.net/_php/msWSsec.php?'+getEpochTime());
        ajaxWrapper.getData(data,onSnapshotReply);
        function onSnapshotReply(data){
            if (data.responce['status'] == 'pass'){
                globs['IMAGE_PATH'] = data.responce['path'];
                listenToImageLoad();
                setTimeout(function(){  // IE Bug, needs timer
                    $('#snapShotImage').attr('src',globs['IMAGE_PATH']);
                },1000);
                log('got path: '+globs['IMAGE_PATH']);
            }

        }
        return false;
    });
}




function wireLogin(i_loginComponent){

    commBroker.listen(i_loginComponent.AUTHENTICATED,function(e){
        var crumb = e.edata.responce.data;

        if ( $("option:selected", '#rememberMe').val() == 'on')
            $.cookie('digitalsignage', crumb, { expires: 300 });

        var key = initKey();
        $.mobile.changePage('#stationViewerID');
        getStationsList();
        wireStationView();
    });

    commBroker.fire(i_loginComponent.USERID, $('#userName'));
    commBroker.fire(i_loginComponent.USERPASSID, $('#userPass'));
    commBroker.fire(i_loginComponent.LOGINBUTTON, $('#loginButton'));

}

function loginUIState(i_state){

    if (i_state) {
        $('#loginButton').button('enable');
    } else {
        $('#loginButton').button('disable');
    }

}



/*/////////////////////////////////////////////

 refreshSize

 /////////////////////////////////////////////*/

function refreshSize(){

    $( "#stationPanel" ).trigger( "updatelayout" );

    // 320 <
    if (globs['SCREEN_WIDTH']<=320){
        $('.stationDetailsDiv').fadeTo(1,0);
        $('#closePanel').show();
        $('#stationViewerID').removeClass('ui-responsive-panel');
        // $( "#mypanel" ).trigger( "updatelayout" );
        $( "#mypanel").panel({
            animate: false,
            display: 'push',
            dismissible: false
        });
        return;
    }

    // 480 <

    if (globs['SCREEN_WIDTH']<=480){
        $('.stationDetailsDiv').fadeTo(1,1);
        $('#closePanel').show();
        $('#stationViewerID').removeClass('ui-responsive-panel');
        // $( "#mypanel" ).trigger( "updatelayout" );
        $( "#mypanel").panel({
            animate: false,
            display: 'push',
            dismissible: false
        });
        return;
    }

    // 768 <

    if (globs['SCREEN_WIDTH']<=768){
        $('.stationDetailsDiv').fadeTo(1,1);
        $('#closePanel').show();
        $('#stationViewerID').removeClass('ui-responsive-panel');
        // $( "#mypanel" ).trigger( "updatelayout" );
        $( "#mypanel").panel({
            animate: false,
            display: 'push',
            dismissible: false
        });
        return;
    }

    // 1024 <

    if (globs['SCREEN_WIDTH']<=1024){
        a = $( "#mypanel");
        $('.stationDetailsDiv').fadeTo(1,1);
        $('#closePanel').hide();
        $('#stationViewerID').addClass('ui-responsive-panel');
        $( "#mypanel").panel({
            animate: true,
            display: 'push',
            dismissible: false
        });
        return;
    }

}


function bindScreenSizeQueries(){
    $(window).bind('exitBreakpoint320',function() {
        log('Exiting 320 breakpoint');
    });
    $(window).bind('enterBreakpoint320',function() {
        log('Entering 320 breakpoint');
        globs['SCREEN_WIDTH'] = 320;
        refreshSize();
    });
    $(window).bind('exitBreakpoint480',function() {
        log('Exiting 480 breakpoint');
    });
    $(window).bind('enterBreakpoint480',function() {
        log('Entering 480 breakpoint');
        globs['SCREEN_WIDTH'] = 480;
        refreshSize();
    });
    $(window).bind('exitBreakpoint768',function() {
        log('Exiting 768 breakpoint');
    });
    $(window).bind('enterBreakpoint768',function() {
        log('Entering 768 breakpoint');
        globs['SCREEN_WIDTH'] = 768;
        refreshSize();
    });
    $(window).bind('exitBreakpoint1024',function() {
        log('Exiting 1024 breakpoint');
    });
    $(window).bind('enterBreakpoint1024',function() {
        log('Entering 1024 breakpoint');
        globs['SCREEN_WIDTH'] = 1024;
        refreshSize();
    });
    $(window).setBreakpoints();

    /*
     $('#distinct').bind('click',function() {
     $(window).resetBreakpoints();
     $(window).setBreakpoints({distinct: $('#distinct').is(":checked")});
     $(window).resize();
     });
     */


}


/*/////////////////////////////////////////////

 mobileInit

 /////////////////////////////////////////////*/

function mobileInit(){

}


function buttonEnable(i_elem, i_state){
    switch (i_state){
        case true: {
            $(i_elem).css({opacity: 1})
            break;
        }
        case false: {
            $(i_elem).css({opacity: 0.5})
            break;
        }
    }
}

function buttonIsEnabled(i_elem){
    // log('bbb' + $(i_elem).css('opacity'));
    if  ($(i_elem).css('opacity') == 1 ) {
        // log('ccc' + $(i_elem).css('opacity'));
        return true;
    }
    return false;
}