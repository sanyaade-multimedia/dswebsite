$(document).ready(function(){
	
    var vH=$('#clouds').height();
    var vW=$('#clouds').width();
    var vT=$('#clouds').offset().top;
    var vL=$('#clouds').offset().left;
    $('#clouds').mousemove(function(e){
        var ypos=e.pageY-vT;
        var xpos=e.pageX-vL;
        var y=Math.round(ypos/vW*20);

        // var x=Math.round(xpos/vH*150);
        var x=Math.round(xpos/vH*20);
		var x2=Math.round(xpos/vH*20);
		var y2=y+104;
		var y=y+100;
		$('#test').val(x+' , '+y);
        $('#clouds').css({backgroundPosition: ' '+x+'% '+'100%'});
		$('#clouds_2').css({backgroundPosition: ' '+x2+'% '+y2+'%'});
		
    });

	//$(document).pngFix();
	$('#slide_contents').fadeIn();

	$("#slide_control_container").jFlow({
		slides: "#slide_contents",
		controller: ".slide_control_button", // must be class, use . sign
		//slideWrapper : "#jFlowSlide", // must be id, use # sign
		selectedWrapper: "selected_button",  // just pure text, no sign
		width: "100%",
		height: "385px",
		duration: 600
		// prev: ".jFlowPrev", // must be class, use . sign
		// next: ".jFlowNext" // must be class, use . sign
	});
	
	$(".slide_control_button").mouseover(function(){
		$('#'+this.id).addClass('rollover_button');
	});
	
	$(".slide_control_button").mouseout(function(){
		$('#'+this.id).removeClass('rollover_button');
	});
	
});