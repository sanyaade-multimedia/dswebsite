var logos = [];
for (var i = 0; i < 60; i++)
    logos.push(i);
var rand = function(max){
    return Math.floor(Math.random() * max);
};
$(function () {
    $('.logos-dnt').find('img').each(function (k, v) {
        var position = rand(logos.length);
        var num = logos.splice(position,1);
        $(v).attr('src', '../_images/client-logo' + num + '.png');
    });
});