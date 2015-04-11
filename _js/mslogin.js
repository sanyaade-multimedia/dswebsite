var ajx;

$(document).ready(function(){

    $('#loginButton').hover(function(){
       // $(this).toggleClass('ui-state-hover');
    });

    ajx = new AjaxRPC(8000);

    $('#dialog_link').button().attr('id', 'myButton').addClass('ui-button ui-corner-all ').text('Login').click(function(){
        $('#dialog').dialog('open');
        return false;
    });
    $('#loaderImgae').hide();
    $('#loginButton').click(function(){
        $('#apDiv1').fadeOut('slow');
        $('#loaderImgae').fadeIn('fast');
        ajx.getData({userName: $('#userName').val(), userPass: $('#userPass').val()} ,'https://secure.dynawebs.net/cgi_bin/msAuth.cgi', authenticateReply);
        return false;
    });
});



function authenticateReply(data)
{

    // communication error

    if (data.textStatus == 'error')
    {
        $('#loaderImgae').fadeOut('fast');
        $('#apDiv1').fadeIn('slow');

        $().toastmessage('showToast', {
            text     : 'Communication error',
            sticky   : false,
            position : 'middle-center',
            type     : 'error'
        });
        return;
    }

    // check authentication

    var xml = data.response;

    $(xml).find("msAuth").each(function(index, value){
        if ( $(value).attr("status") == 'pass' )
        {
            ajx.abortAll();
            data = $(value).attr("data");
            $('#userPass').val(data);
            $('#loginButton').attr('type','submit').unbind().click();
            return false;

        } else {

            $('#loaderImgae').fadeOut('fast');
            $('#apDiv1').fadeIn('slow');

            $().toastmessage('showToast', {
                text     : 'User or password entered are invalid, enter your Provider`s user name and password...',
                sticky   : false,
                stayTime: 6000,
                position : 'middle-center',
                type     : 'error'
            });
        }
    });
};






























