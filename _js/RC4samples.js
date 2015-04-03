

/* same key as I use in tcl side, remember to include RC4.js Sean...*/

var passKey = '446a3a42f34ccd878ed2c3ba56644317';

function genKey(form)
{
    var key = new Array();
    var i = 0;
    var n;
    while(i < 16)
    {
        n = Math.ceil(Math.random() * 255);
        key[i] = n;
        i++;
    }
    form.userkey.value = arcfour_hex_encode(arcfour_byte_string(key));
}

function doEncrypt()
{
    var plaintext = loginForm.userName.value;
    if(plaintext.length > 0)
    {
        return arcfour_hex_encode(arcfour_crypt(plaintext, arcfour_hex_decode(passKey)));
    }
}

function doDecrypt(value)
{
    var ciphertext = arcfour_hex_decode(value);
    if(ciphertext.length > 0)
    {
        return arcfour_crypt(ciphertext, arcfour_hex_decode(passKey));
    }
}



$(document).ready(function($){

    // alert('aaaaaa top Z go insde...load .. it again');

    var request;

    $("#loginButton").click(function(event){
        if (request) {
            request.abort();
        }

        var encrypted = doEncrypt();

        // setup some local variables
        var $form = $(this);
        // let's select and cache all the fields
        var $inputs = $form.find("input, select, button, textarea");
        // serialize the data in the form
        var serializedData = $form.serialize();

        // let's disable the inputs for the duration of the ajax request
        $inputs.prop("disabled", true);

        var d = new Date()
        var postData = {
            "proj_name" : d.getFullYear(),
            "date" : String(Date.now()),
            "encrypted" : encrypted
        };

        // fire off the request to /form.php
        var pars = "?a=aaaa&sean=danna"
        var request = $.ajax({
            url: "http://dynawebs.net/cgi_bin/xml/clock.xml",
            data: postData,
            type: "xml",
            success: parseXML
        });

        function parseXML(xml){
            // console.log ( (new XMLSerializer()).serializeToString(xml) );
            $(xml).find("time").each(function(index, value){
                alert('hey ' + doDecrypt($(value).attr("encrypt")));
            });
            // var a = $(t)[0];
            // alert($(a).attr("encrypt"));

        };

        // callback handler that will be called on success
        /*request.done(function (response, textStatus, jqXHR){
            // log a message to the console
            console.log("AAZZ Hooray, it worked! n");
            console.log(jqXHR.responseText);
            var $x = $.parseXML(jqXHR.responseText);
            console.log( $($x).find('encrypt') );

        });                                       */



        // callback handler that will be called on failure
        request.fail(function (jqXHR, textStatus, errorThrown){
            // log the error to the console
            console.error(
                "The following error occured: "+
                    textStatus, errorThrown
            );
        });

        // callback handler that will be called regardless
        // if the request failed or succeeded
        request.always(function () {
            // reenable the inputs
            $inputs.prop("disabled", false);
        });

        // prevent default posting of form
        event.preventDefault();
    });

});