//Implemented by Costin Popescu
/// <reference path="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js" />

$(function () {
    $(".home-tabs").each(function () {
        var tabsMenu = $(this).find(".tabs-menu");
        var tabsMain = $(this).find(".tabs-main");
        tabsMenu.find("li").first().addClass("sel");
        tabsMenu.find("a").first().addClass("first");
        tabsMenu.find("a").last().addClass("last");
        tabsMain.find(".tab-content").first().show();

        tabsMenu.find("a").click(function () {
            tabsMenu.find("li.sel").removeClass("sel");
            $(this).parent().addClass("sel");

            var tabName = $(this).attr("href");

            tabsMain.queue(function () {
                $(this).find(".tab-content:visible").fadeOut(function () {
                    tabsMain.dequeue();
                });

            });
            tabsMain.queue(function () {
                $(this).find(tabName).fadeIn(function () {
                    tabsMain.dequeue();
                });

            });
            return false;
        });
    });
});
