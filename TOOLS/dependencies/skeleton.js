function Durex()
{
    var self = this;

    function popUp( mypage, myname, w, h, scroll )
    {
        var LeftPosition = (screen.width) ? (screen.width-w)/2 : 0;
        var TopPosition = (screen.height) ? (screen.height-h)/2 : 0;
        var settings = 'height='+h+',width='+w+',top='+TopPosition+',left='+LeftPosition+',scrollbars='+scroll+',resizable';
        window.open(mypage, myname, settings);
    };

	function ajaxPost( url, cb, cb2 ) 
	{
		var callback  = cb || function() { },
			callback2 = cb2 || function() { },
			ret = null;
			
		$.ajax({
    		type: "POST",
    		cache: false,
    		url: url,
    		data: requestData,
    		dataType: 'json',
    		success: function(data)
    		{
    			if(data.result == 'success')
    			{
    			 	callback();
    			}
    			else
    			{
    				callback2();
    			}
    		}
		});
		
		return ret;	
	}

    function events()
    {
    }

    /* @ init */
    (function()
    {
        events();
    }());
}

$(function(){
    durex = new Dettol(); 
});
