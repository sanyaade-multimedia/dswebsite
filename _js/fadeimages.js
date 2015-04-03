
 $(document).ready(
				function(){
					$('#news').innerfade({
						animationtype: 'slide',
						speed: 750,
						timeout: 2000,
						type: 'random',
						containerheight: '1em'
					});
					
					$('ul#portfolio').innerfade({
						speed: 1500,
						timeout: 3000,
						type: 'sequence',
						containerheight: '320px',
						animationtype: 'fade'
					});
					
					$('.fade').innerfade({
						speed: 100,
						timeout: 600,
						type: 'random_start',
						containerheight: '1.5em'
					});
					
					$('.adi').innerfade({
						speed: 'slow',
						timeout: 500,
						type: 'random',
						containerheight: '150px'
					});
 
			});
