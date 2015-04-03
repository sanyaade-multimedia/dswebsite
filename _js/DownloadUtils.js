function gup( name )
{  
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
	var regexS = "[\\?&]"+name+"=([^&#]*)";  
	var regex = new RegExp( regexS );  
	var results = regex.exec( window.location.href );  
	if( results == null )   
		return "";  
	else    
		return results[1];
}

function openLoginApp(i_mode, i_masterUrl, i_eri)
{

	if(!FlashDetect.installed){
	   alert('Adobe Flash is not installed so please use SignageStudio Desktop version or install Adobe Flash at http://get.adobe.com/flashplayer/');
	   return
	}

	url = i_masterUrl + "signagestudio.aspx?mode="+i_mode+"&v=4";
	if (i_eri!=null && i_eri!="")
	{
		url = url + "&eri="+i_eri;
	}
	try
	{
		var popup = window.open(url, 'SignageStudio', 'width=1024,height=768,resizable=1');
		if (popup == null)
		{
			notifyPopupBloker('1');
		}
		else if (window.opera)
		{
			if (!popup.opera)
			{
				notifyPopupBloker('2');
			}
		}
	}
	catch(err)
	{
		notifyPopupBloker('3');
	}
}

function notifyPopupBloker(rrr)
{
  alert("Please enable browser Popup in order to open the signage studio"); 
}


function createCookie(name,value,days) 
{
	if (days) 
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) 
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) 
{
	createCookie(name,"",-1);
}
    
