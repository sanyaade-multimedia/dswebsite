$(document).ready(function () {

    var validateEmail = function (email) {

    }

    document.domain = 'digitalsignage.com';
    $.support.cors = true;

    $('#submitForm').click(function (e) {

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var email = '';
        if (!re.test($('#email').val())) {
            alert('Invalid email entered');
            return false;
        } else {
            var email = $('#email').val();
        }

        var userName = $('#nameField').val();
        if (userName.length < 1) {
            alert('Invalid name entered');
            return false;
        }

        var company = $('#company').val();

        var topic = $('#topic option:selected').val();
        if (topic == 'TOPIC') {
            alert('Please select a subject');
            return false;
        }

        var message = $('#message').val();
        if (message.length < 8) {
            alert('Your message is too short');
            return false;
        }

        var captchaString = $('#captchaString').val();
        if (captchaString.length != 7) {
            alert('The Wrong Captcha entered');
            return false;
        }

        var data = {
            email: email,
            topic: topic,
            message: message,
            userName: userName,
            company: company,
            captchaString: captchaString,
            a: $('#captcha').width(),
            b: $('#captcha').height()
        };

        $.ajax({
            url: 'https://secure.digitalsignage.com/submitContact',
            type: "POST",
            crossDomain: true,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (res) {
                if (res.status=='pass') {
                    $('#contactmain').fadeOut();
                    $('#contactmain').empty();
                    $('#contactmain').append('<h1 style="padding-left: 200px; padding-bottom: 600px">Thank you, we will contact you shortly...</h1>')
                    $('#contactmain').fadeIn();
                } else {
                    alert('A Wrong captcha entered, please try again...')
                }
            },
            error: function (res) {
                alert("Oops something went wrong " + res.statusText);
            }
        });

        return false;


    });


});