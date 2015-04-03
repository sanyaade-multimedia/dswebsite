function activateDropDown(target, height) {
	var animate = true;
	var prefix = '.dropdown-' + target;
	var menu = $(prefix);
	var height = 25;
	height += $(prefix + ' ul li').length*28;
	height += $(prefix + ' ul li br').length*15;
	
	$(prefix +', ' + '.menu-item-' + target).hover(function(r){
		var item = $(this);
		if (item[0].className && item[0].className.indexOf('menu') > -1) {
			var left = item.position().left-8;
			menu.css('left', left+'px');
			menu.clearQueue().animate({height:height+'px'}, 200);
		}
		animate = false;
		setTimeout(function(){animate = true;},1);
		menu.css('display', 'block');
	}, function(r) {
		setTimeout(function(){if (animate) menu.animate({height:'0px'}, 200);}, 0);
	});
}
$(document).ready(function(){
activateDropDown('enterprise');
activateDropDown('products');
activateDropDown('technology');
activateDropDown('support');
});
