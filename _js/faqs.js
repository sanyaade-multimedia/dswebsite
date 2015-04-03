var IE = /*@cc_on!@*/false;
$(document).ready(function() {
    $(".faq").load("../__html/faqs.xml", function(response, status, xhr) {
        $(this).text("");
        if (xhr.responseXML == null) return;
        $(xhr.responseXML.documentElement).find("Topic").each(function() {
            var topic = document.createElement("div");
            $(topic).addClass("topic");

            var header = document.createElement("h3");
            $(header).addClass("header");
            $(header).text($(this).attr("data"));
            $(header).decHTML();
            $(topic).append(header);

            var content = document.createElement("div");
            $(content).addClass("content");

            $(this).find("Question").each(function() {
                var question = document.createElement("h4");
                $(question).addClass("question");
                $(question).text($(this).attr("data"));
                $(question).decHTML();
                $(content).append(question);

                var answer = document.createElement("div");
                $(answer).addClass("answer");
                $(answer).text($(this).find("Answer").attr("data"));
                $(answer).decHTML();
                $(content).append(answer);
            });
            $(topic).append(content);
            $(".faq").append(topic);
        });

        if (IE) {
            $(".faq").find(".header").click(function() {
                var content = $(this).next();

                if ($(content).hasClass("content_open")) {
                    $(content).hide();
                    $(content).removeClass("content_open");
                }
                else {
                    $(content).toggle("normal");
                    $(content).addClass("content_open");
                }

                $(this).toggleClass("opened");
            });
        }
        else {
            $(".faq").find(".header").click(function() {
                var content = $(this).next();
                $(content).toggle("normal");
                $(this).toggleClass("opened");
            });
        }

    });
});

function CollapseAll() {
    $(".faq").find(".header").each(function() {
        var content = $(this).next();
        if (IE) {
            $(content).hide();
            $(content).removeClass("content_open");
        }
        else {
            $(content).slideUp("normal");
        }
        $(this).toggleClass("opened", false);
    });
}

function ExpandAll() {
    $(".faq").find(".header").each(function() {
        var content = $(this).next();
        if (IE) {
            $(content).show();
            $(content).addClass("content_open");
        }
        else {
            $(content).slideDown("normal");
        }
        $(this).toggleClass("opened", true);
    });
}
