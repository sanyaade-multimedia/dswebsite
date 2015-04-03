var fadeContainers=new Object();
var mouseCoords={'x':0,'y':0};
 
function containerFO(id){
	if (fadeContainers[id]==0){
		$('#'+id.replace('fc','fl')).fadeOut(100,function(){
			$('#'+id.replace('fc','sl')).fadeIn(400,function(){
				fadeContainers[id]=1;
				if (!containerInsider(id)){
					containerFI(id);
				}
			});
		});
	}
	return false;
}
function containerFI(id){
	if (fadeContainers[id]==1){
		$('#'+id.replace('fc','sl')).fadeOut(100,function(){
			$('#'+id.replace('fc','fl')).fadeIn(400,function(){
				fadeContainers[id]=0;
			});
		});
	}
	return false;
}
 
function containerInsider(id){
	var pageCoords = "( " + mouseCoords.x + ", " + mouseCoords.y + " )";
//	$("span:first").text("( e.pageX, e.pageY ) - " + pageCoords);
 
 	var offset;
	var left;
	var top;
	var right;
	var bottom;
 
	offset=$("#"+id).offset();
	left = offset.left; 
	top = offset.top; 
	right = offset.left+$("#"+id).width(); 
	bottom = offset.top + $("#"+id).height(); 
	if (mouseCoords.x<=right && mouseCoords.x>=left && mouseCoords.y>=top && mouseCoords.y<=bottom){
//		$("span:last").text('mouse is in '+id);
		return true;
//		$("span:last").text("( left top right bottom ) - ( "+left+" "+top+" "+right+" "+bottom+" )");
	}
 
	return false;
}
 
$(document).ready(function () {
	$(document).mousemove(function(e){
		mouseCoords['x']=e.pageX;
		mouseCoords['y']=e.pageY;
		var pageCoords = "( " + mouseCoords.x + ", " + mouseCoords.y + " )";
//		$("span:first").text("( e.pageX, e.pageY ) - " + pageCoords);
	});
 
	$('div.fadeContainer').each(function(i){
		var id=this.id;
		fadeContainers[id]=0;
		$("#"+id.replace('fc','sl')).fadeOut(1);
		$("#"+id).mousemove(function(){
			containerFO(id);
		}).mouseout(function(){
			containerFI(id);
		});
	});
});
 
