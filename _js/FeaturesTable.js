
var checkedImgPath = "http://mediasignage.com/assets/images/checkitem.png", xmlPath = "http://inceptivebd.net/demo/degital/__html/Features.xml";

$("#featuredContainer").empty();
$(function () {
    $("#featuresContainer").load(xmlPath, function (response, status, xhr) {
        $(this).text("");
        if (xhr.responseXML == null) return;
        $("#featuresContainer").show();
        $("#featuresContainer").append("<div class='top-bar' />");

        var xml = xhr.responseXML.documentElement;

        var titleTable = document.createElement("table");
var titleTbody = document.createElement("tbody");
        var titleRow = document.createElement("tr");
       titleTbody.appendChild(titleRow);
 titleTable.appendChild(titleTbody);
        $("#featuresContainer").append(titleTable);

        var i = 0;
        $(xml).find("columnTitles").find("column").each(function () {
            var td = document.createElement("td");
            $(td).addClass("title-cell");
            if (i > 0) $(td).addClass("cell-secondary");
            $(td).html($(this).text());
            titleRow.appendChild(td);
            i++;
        });


        $(xml).find("featureGroup").each(function () {
            $("#featuresContainer").append('<table><tr><td colspan="3" class="subtitle">' + $(this).attr("name") + '</td></tr></table>');
            $(this).find("feature").each(function () {
                var newTable = document.createElement("table");
                var newTR = document.createElement("tr");
                var td1 = document.createElement("td");
                $(td1).html($(this).attr("name"));
                newTR.appendChild(td1);
                $(newTable).append(newTR);
                $("#featuresContainer").append(newTable);

                $(this).find("cell").each(function () {
                    var cell = $(this);
                    var td = document.createElement("td");
                    newTR.appendChild(td);
                    $(td).addClass("cell-secondary");
                    if (cell.attr("checked") == "1") {
                        $(td).addClass("centered");
                        $(td).append("<img src='" + checkedImgPath + "' alt=''/>");
                    }
                    else if (cell.text() != "") {
                        if (cell.attr("bold") == "1") $(td).css("font-weight", "bold");
                        if (cell.attr("isBlue") == "1") $(td).addClass("blue-text-cell");
                        if (cell.attr("isGreen") == "1") $(td).addClass("green-text-cell");
                        $(td).html(cell.text());
                    }
                    else $(td).html("&nbsp;");
                });

                if ($(this).find("extra").text() != "") {
                    var hiddenDiv = document.createElement("div");
                    $(hiddenDiv).attr("colspan", "3");
                    $(hiddenDiv).html($(this).find("extra").text());
                    $(hiddenDiv).addClass("hiddenRow");

                    $(newTable).after(hiddenDiv);
                    $(hiddenDiv).hide();

                    $(newTR).mouseover(function () {
                        $(newTR).addClass("hoverrow");
                    });
                    $(newTR).mouseout(function () {
                        $(newTR).removeClass("hoverrow");
                    });
                    $(newTR).click(function () {
                        if ($.browser.msie) {
                            var element = $(newTR).parents("table").first().next();
                            if ($(element).is(":visible")) {
                                $(element).animate({ height: 1 }, "fast", function () {
                                    $(this).hide();
                                    $(this).css("height", "");
                                });
                            }
                            else $(element).slideDown("fast");
                        }
                        else
                            $(newTR).parents("table").first().next().slideToggle("fast");

                    });
                }
                $("#featuresContainer").find("table").attr("cellpadding", 0);
                $("#featuresContainer").find("table").attr("cellspacing", 0);
            });
        });
    });
});
