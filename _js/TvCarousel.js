var xmlPath = "../_html/TvCarousel.xml";

$(function () {
    loadXML();
});

function loadXML() {
    $(".carousel-container").load(xmlPath, function (response, status, xhr) {
        $(this).text("");
        if (xhr.responseXML == null) return;

        $(this).append('<a title="next" href="#" class="next" onclick="return false;">next</a>');
        $(this).append('<a title="back" href="#" class="back" onclick="return false;">back</a>');
        $(this).append('<div class="project-slider-wrap">');

        $(".project-slider-wrap").append('<ul class="project-slider" />');

        var xml = xhr.responseXML.documentElement;
        $(xml).find("slide").each(function () {
            var li = document.createElement("li");
            $(".project-slider").append(li);
            var img = document.createElement("img");
            $(img).height(155);
            $(img).width(258);
            $(img).attr("src", $(this).attr("img"));
            if ($(this).attr("link") != "") {
                var link = document.createElement("a");
                $(link).attr("href", $(this).attr("link"));
                link.appendChild(img);
                li.appendChild(link);
            }
            else li.appendChild(img);

            if ($(this).attr("hideProject") != "true" && $(this).find("project").length > 0) {
                var panel = document.createElement("div");
                li.appendChild(panel);
                $(panel).addClass("panel");
                $(panel).append('<div class="panel-title"><a href="javascript:return false;">' + $(this).find("project").attr("title") + "</a></div>");
                $(panel).append("<p>" + $(this).find("project").text() + "</p>");
            }
        });

        if ($(xml).attr("showProjectTab") == "false" || $(xml).attr("showProjectTab") == "0")
            $(".panel").hide();

        $(".carousel-container .project-slider-wrap").jCarouselLite({
            btnNext: ".carousel-container .next",
            btnPrev: ".carousel-container .back",
            speed: 1000
        });

        $(".project-slider li .panel .panel-title").click(function () {
            if ($(this).hasClass("panel-title-opened")) {
                $(this).parents(".panel").animate({ height: 26 }, 500, function () {
                    $(this).find(".panel-title").removeClass("panel-title-opened");
                });
            }
            else
                $(this).parents(".panel").animate({ height: 160 }, 500, function () {
                    $(this).find(".panel-title").addClass("panel-title-opened");
                });
        });
    });
}