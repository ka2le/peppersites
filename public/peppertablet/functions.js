


function onload(){
	//alert("hej");
	var url = window.location.href;
	var urlSplit = url.split("#");
	console.log(urlSplit);
	if(urlSplit.length>1){
		var page = urlSplit[1];
		var id = page;
		$('.link').removeClass("activeLink");
		//$(this).addClass("activeLink");
		$('.link[rel='+page+']').addClass("activeLink")
		//console.log(this)
		$('.box').hide();
		$('#'+id).show();  
	}else{
		$('#startMenu').show();
		$('.link[rel=startMenu]').addClass("activeLink")		
	}
	$('.link').click(function(){
		var id = $(this).attr("rel");
		$('.link').removeClass("activeLink");
		$(this).addClass("activeLink");
		console.log(this)
		$('.box').hide();
		$('#'+id).show();                      
	});
}

// -------------------------------------------------------- PHP Kod 
/* $.post( "php/php.php",   { 
		value: "test", 
		value2: "test2"
		},
	function( data ) {
		console.log(data);
		
	}); */