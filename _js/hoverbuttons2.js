$(document).ready(function(){

    // new v3

    var openWebID = "openWebAccount";
    var openWebOut = "http://www.digitalsignage.com/_images/WebOpenv3.png";
    var openWebOver = "http://www.digitalsignage.com/_images/WebOpenv3over.png";

    var upgradeNowID = "upgradeNow";
    var upgradeNowOut = "http://www.digitalsignage.com/_images/upgnow.png";
    var upgradeNowOver = "http://www.digitalsignage.com/_images/upgnowover.png";

    var loginID = "appLogin";
    var loginOut = "http://www.digitalsignage.com/_images/loginbar1.png";
    var loginOver = "http://www.digitalsignage.com/_images/loginbar2.png";

    var getStartedID = "appGetStartedID";
    var getStartedOut = "http://www.digitalsignage.com/_images/getstartedbar2.png";
    var getStartedOver = "http://www.digitalsignage.com/_images/getstartedbar1.png";

    var chatOffOut = "http://www.digitalsignage.com/_images/livechatonbar1.png";
    var chatOffOver = "http://www.digitalsignage.com/_images/livechatonbar2.png";

    var chatOnOut = "http://www.digitalsignage.com/_images/livechatoffbar1.png";
    var chatOnOver = "http://www.digitalsignage.com/_images/livechatoffbar2.png";

    $("#"+openWebID).hover(function(){$(this).find("img")[0].src = openWebOver;},
        function(){$(this).find("img")[0].src = openWebOut;});

    $("#"+upgradeNowID).hover(function(){$(this).find("img")[0].src = upgradeNowOver;},
        function(){$(this).find("img")[0].src = upgradeNowOut;});


    $("#"+loginID).hover(function(){$(this).find("img")[0].src = loginOver;},
        function(){$(this).find("img")[0].src = loginOut;});

    $("#"+getStartedID).hover(function(){$(this).find("img")[0].src = getStartedOut;},
        function(){$(this).find("img")[0].src = getStartedOver;});

    $("#scGC1o").hover(function(){
            var img = $(this).find("img")[0];
            img.src = (img.src == chatOnOut)?chatOnOver:chatOffOver;
        },
        function(){
            var img = $(this).find("img")[0];
            img.src = (img.src == chatOnOver)?chatOnOut:chatOffOut;
        });
});




$(document).ready(function() {

    $("#floatingBox_SEAN_DISABLE").find("td[colspan='3']").hover(function(){$(this).wrapInner("<div style='background-color:#707070; border-radius:5px; -moz-border-radius:5px; -webkit-border-radius:5px;'></div>");},

        function(){$(this).find("div").contents().unwrap();});
});
