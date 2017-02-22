function onload(){

	  
}



$(document).keypress(function(e) {
  if(e.which == 13) {
     console.log("Enter press");
        talk();
  }
});
function talk(){
	var ipF = document.getElementById("ipF").value;
	var portF = document.getElementById("portF").value;
	var ip = document.getElementById("ip").value;
	var port = document.getElementById("port").value;
	var text = document.getElementById("text").value;
	var url = ("http://"+ipF+":"+portF+"/"+ip+"/"+port+"/"+text+"");
	console.log(url);
	$.ajax({
  type: "POST",
  url: url
}).done(function( o ) {
   console.log(o);
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