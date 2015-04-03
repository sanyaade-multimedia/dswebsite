function Carousel(el, ui, pages, opts) {
	var C1 = "current-card";
	var C2 = "new-card";
	var W = 908;
	var actualWidth = 909;
	var self = this;
	var len = pages.length;
	var sid = null
	var animating = false;
	var currentIndex = 0;
	var template = ''
	var templateFullLink = '';

	function createDot(i) {
		var d = document.createElement('div');
		d.id = 'dot' + i;
		d.className = 'cr-dot' + (i != 0 ? '' : ' selected');
		d.onclick = function() {
			callByIndex(i, false, true);
            if ( $('#frontBanner'+i).css('display') !='none')
                return;

            $('.homeBanners').each(function(){
                $(this).fadeOut('fast');
            });
            $('#frontBanner'+i).fadeIn('slow');

		};

		return d;
	}

	if (el != null) {
		this.container = el;
		this.pages = pages;
		this.index = 0;
		this.timer = 50000;
		this.transitionDuration = 1;
		for (var i = 0; i < len; i++) {
			var d = createDot(i);
			var item = pages[i];
			var left = Math.round(actualWidth/len*i);
			var w = Math.round(actualWidth/len)-1;
			d.style.left = left + 'px';
			d.style.width = w + 'px';
			if (i==len-1) d.className = d.className + ' last';
			d.innerHTML = '<img src="URL"/>'.replace('URL', item.thumb) + '<span>'+item.title+'</span><div class="tip2"></div>';
			item.left = Math.round(left + w/2);

			ui.appendChild(d);
		}

		if (opts) {
			if (opts.timePerSlide) this.timer = opts.timePerSlide*1000;
			if (opts.transitionDuration) this.transitionDuration = opts.transitionDuration;
		}

		function callNext() {
			self.index++;
			if (self.index > len-1)
				self.index = 0;

			callByIndex(self.index, true);
		}

		function callBefore() {
			self.index--;
			if (self.index < 0)
				self.index = len-1;

			self.reverse = true;
			callByIndex(self.index, true);
		}

		function callByIndex(index, force, click) {
			if (animating || index == self.index && !force) return;
			if (currentIndex > index) self.reverse = true;
			self.index = index;
			var first = document.getElementById(C1);
			var second = document.createElement('div');
			second.id = C2;
			second.className = 'card';
			second.style.left = (self.reverse ? '-150' : '150') + '%';

			el.appendChild(second);
			var item = pages[index];
			//var btLabel = item.btLabel ? item.btLabel : 'Learn More';
			//var temp = item.fullLink ? templateFullLink : template;
			var html = $(".car-slide:eq("+index+")").html();
			second.innerHTML = html;
			//if (item.large) second.className = second.className + ' large'

			animate();

			if (sid)
				clearTimeout(sid);
			if(!click)
			sid = setTimeout(callNext, self.timer);

            // $('.cr-dot').removeClass('selected');

			for (var i = 0; i < len; i++) {
				var d = document.getElementById('dot' + i);
				d.className = 'cr-dot' + (i == index ? ' selected' : '');

                /*if (i==index){
                   $('.cr-dot').addClass('selected');
                } */

				if (i==len-1) d.className = d.className + ' last';
			}
			currentIndex = index;
			$('.carousel .tip').animate({left:$("#carousel-ui").offset().left + $(".cr-dot").width()*(currentIndex) + $(".cr-dot").width()/2 + 'px'});
		}

		function onAnimateEnd() {
			var first = document.getElementById(C1);
			var second = document.getElementById(C2);
			first.parentNode.removeChild(first);
			second.id = C1;
			second.style.left = '50%';
			animating = false;
			self.reverse = false;
		}

		function animate() {
			animating = true;
			var first = document.getElementById(C1);
			var second = document.getElementById(C2);
			var opts = {complete:onAnimateEnd};
			if (self.reverse) {
				$(first).animate({left:'150%'}, opts);
				$(second).animate({left:'50%'});
			}
			else {
				$(first).animate({left:'-150%'}, opts);
				$(second).animate({left:'50%'});
			}
		}

		sid = setTimeout(callNext, self.timer);
	}

	this.next = function() {
		callNext();
	};

	this.prev = function() {
		callBefore();
	};

	this.precache = function(slides) {
		var i, m1, m2;
		var imgs = [];
		for (var i = 0; i < slides.length; i++){
			imgs.push(slides[i].img);
		}

		var len = imgs.length;
		var iIndex = 0;
		var temp = document.createElement('img');
		temp.style.display = 'none';

		function nextImage() {
			iIndex++;
			loadImage();
		}

		function loadImage() {
			if (iIndex >= len) {
				temp = null;
				return;
			}
			var src = imgs[iIndex];
			temp.src = src;
		}

		temp.onload = nextImage;
		loadImage();
	};

	this.loadFirst = function(){
		var second = document.getElementById(C1);
		var item = pages[0];
		//var btLabel = item.btLabel ? item.btLabel : 'Learn More';
		//var temp = item.fullLink ? templateFullLink : template;
		var html = $(".car-slide:eq(0)").html();
		second.innerHTML = html;
		//if (item.large) second.className = second.className + ' large';
		$('.carousel .tip').css("left", $("#carousel-ui").offset().left + $(".cr-dot").width()/2 + 'px');
        $('#tiptop').css("left", $("#tipbottom"));
	}
	self.loadFirst();
};
