$(document).ready(function(){
        $(".floatingBox").fadeIn('slow');
        $("#floatingBox").mouseover(function(){
                $(this).stop();
                $(this).animate({
                        "right": [0, 'easeOutCirc']
                },500);
        });

        $("#floatingBox").mouseout(function(){
                $(this).stop();
                $(this).animate({
                        "right": [-111, 'easeOutCirc']
                },500);
        });

        $(".tab_line").mouseover(function(){
                hide=$(this).attr("id")+"img";
                show=$(this).attr("id")+"imgh";
                $("#"+hide).hide();
                $("#"+show).show();
        });
        $(".tab_line").mouseout(function(){
                hide=$(this).attr("id")+"imgh";
                show=$(this).attr("id")+"img";
                $("#"+hide).hide();
                $("#"+show).show();
        });

});

