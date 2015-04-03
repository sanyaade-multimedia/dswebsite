$(document).ready(function () {

    document.domain = 'inceptivebd.net/demo/degital';

    var data = { getNextWebinar: 'true' };
    $.support.cors = true;
    $.ajax({
        url: 'https://secure.digitalsignage.com/nextWebinar',
        type: "POST",
        crossDomain: true,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            var d = new XDate(res.date);
            var when = d.toString("dddd, MMM d yyyy") + ' @ 11AM Pacific Time';
            $('#onDate').text(when);
            $('#register').attr('href',res.webkey)
        },
        error: function (res) {
            alert("Bad thing happend! " + res.statusText);
            console.log("Bad thing happend! " + res.statusText);
        }
    });
});