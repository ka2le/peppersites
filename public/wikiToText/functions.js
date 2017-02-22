//var wikipediaLink = "https://en.wikipedia.org/wiki/Beyonc%C3%A9";
var wikipediaLink = "https://en.wikipedia.org/wiki/Justin_Timberlake";
var contentArray = []
var myTableArray = [];




function makeArrayFromTable(){
	myTableArray = [];
	$("table tr").each(function() {
    var arrayOfThisRow = [];
    var tableData = $(this).find('td');
	var titel = $(this).find('th').text();
    if (tableData.length > 0) {
        tableData.each(function() { arrayOfThisRow.push($(this).text()); });
		var thisRow = [];
		thisRow[0] = titel;
		thisRow[1] = arrayOfThisRow;
		
        myTableArray.push(thisRow);
    }
});
console.log(myTableArray);
}

function removeBrackets(inputText){
	var startSplitter = "[";
	var endSplitter = "]";
	//console.log("removeBrackets")
	var firstRemoved = inputText.split(startSplitter);
	for(var i=0; i<firstRemoved.length; i++){
		var currentLineArray = firstRemoved[i].split(endSplitter);
		firstRemoved[i] = currentLineArray[currentLineArray.length-1]
	}
	var cleanText = firstRemoved.join();
	//console.log(cleanText);
	return cleanText;
}
function getTitleAndText(inputText){
	var headerArray = inputText.split('class="mw-headline"');
	//console.log(headerArray);
	var titelAndTextArray = [];
	for(var i =1; i<headerArray.length-3; i++){
		var titelAndText = headerArray[i].substr(headerArray[i].indexOf('>')+1);
		var titel = htmlToCleanText(titelAndText.substr(0,titelAndText.indexOf('</'))); 
		var text = htmlToCleanText(titelAndText.substr(titelAndText.indexOf('</')));
		var texts = text.split(".");
		titelAndTextArray.push([titel, texts]);
	}
	return titelAndTextArray;
}

function htmlToCleanText(htmlText){
	document.getElementById("tempDiv").innerHTML = htmlText;
	var cleanText = removeBrackets($("#tempDiv").text()).replace(/(\r\n|\n|\r)/gm,"");
	cleanText = cleanText.replace(/,/gi,"");
	cleanText = cleanText.replace(/#/gi,"");
		cleanText = cleanText.replace(/"/gi,"");
			cleanText = cleanText.replace(/'/gi,"");
		cleanText = cleanText.replace(/:/gi,"");
	cleanText = cleanText.replace(/[()]/gi,"");
	//cleanText = cleanText.replace(")","");
	return cleanText;
}

function onload(){
		console.log("Laddar..");
		var theUrl = wikipediaLink;
		$.ajax({
			url: theUrl,
			type: 'GET',
			success: function(res) {
				var text = res.responseText;
				//console.log(text);
				document.getElementById("tempDiv").innerHTML = text;
				var content = document.getElementById("bodyContent").innerHTML;
				makeArrayFromTable();
				//console.log(content);
				//document.getElementById("container").innerHTML = content;
				contentArray = getTitleAndText(content);
				console.log(contentArray);
				document.getElementById("tempDiv").innerHTML = "";
				createTopic();
			}
		});
		

}
function creatQuestionText(){
	var dialogtxt = "";
	
	return dialogtxt;
}

function createTopic(){
	var dialogtxt = "";
	//dialogtxt = "topic: ~ronaldTalk () \n language: enu";
	//dialogtxt += "\nconcept:(music) [music artist]";
	dialogtxt += "\nu:(story) %storyMode Look at my stomach to see the headlines and tell me what you want to hear about?";
	for(var i = 0; i<contentArray.length; i++){
		var sentences = contentArray[i][1];
		var titel = contentArray[i][0];
		if(sentences.length>2){
			//rubriker här
			dialogtxt += "\n\tu1:("+titel+") Wikipedia says "+sentences[0]+"";
			//tre första meningarna
			for(var j = 1; j<sentences.length && j<3; j++){
				dialogtxt += sentences[j]+" ";
			}
			
			dialogtxt +=" Do you want to me to keep reading about this topic";
			dialogtxt += "\n\t\tu2:(~yes) ";
			for(var j = 3; j<sentences.length; j++){
				dialogtxt += sentences[j]+" ";
			}
			dialogtxt += "\n\t\tu2:(~no) ok  ^goto(storyMode) \n";
		}else{
			dialogtxt += "\n\tu1:("+titel+") Wikipedia says "+sentences[0]+"";
			//tre första meningarna
			for(var j = 1; j<sentences.length && j<3; j++){
				dialogtxt += sentences[j]+" ";
			}
		}	
	}
	//dialogtxt = creatQuestionText();
	document.getElementById("topicArea").value = dialogtxt;

}
/*

function createTopic(){
	var dialogtxt = "topic: ~ronaldTalk () \n language: enu";
	dialogtxt += "\nconcept:(music) [music artist]";
	for(var i = 0; i<contentArray.length; i++){
		var sentences = contentArray[i][1];
		var titel = contentArray[i][0];
		dialogtxt += "\nu:("+titel+") Wikipedia says "+sentences[0]+"";
		for(var j = 1; j<sentences.length; j++){
			dialogtxt += "\n";
			for(var t = 0; t<j; t++){
				dialogtxt += "\t";
			}
			
			dialogtxt += "u"+j+":(more) "+sentences[j]+"";
		}
	}
	
	document.getElementById("topicArea").value = dialogtxt;

}*/



//get html from website
jQuery.ajax = (function(_ajax){

    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';

    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }

    return function(o) {

        var url = o.url;

        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {

            // Manipulate options so that JSONP-x request is made to YQL

            o.url = YQL;
            o.dataType = 'json';

            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };

            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }

            o.success = (function(_success){
                return function(data) {

                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: data.results[0]
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }

                };
            })(o.success);

        }

        return _ajax.apply(this, arguments);

    };

})(jQuery.ajax);




// -------------------------------------------------------- PHP Kod 
/* $.post( "php/php.php",   { 
		value: "test", 
		value2: "test2"
		},
	function( data ) {
		console.log(data);
		
	}); */
	
	
	
	
		/*
				var titles = [];
				var pTexts = []
				$( ".mw-headline" ).each(function( index ) {
					titles.push([$(this).text(), 4]);
					pTexts.push($(this).next());
					  //console.log( index + ": " + $( this ).text() );
				});
				
				console.log(titles);
				
				var thePs = content.split("<p>");
				//console.log(thePs);
				var htmlText = "";
				var thePsText = [];
				for(var i=0; i<thePs.length; i++){
					thePs[i] = thePs[i].split("<h")[0];
					document.getElementById("container").innerHTML = thePs[i];
					thePsText.push( removeBrackets($("#container").text()));
				}
				//var firstP = thePs[7];
				document.getElementById("container").innerHTML = content;
				//var firstPtext = $("#container").text();
				//document.getElementById("container").innerHTML = firstPtext;
				console.log(thePsText);
				
				//cleanText = removeBrackets(firstPtext);
				//document.getElementById("container").innerHTML = thePsText[7];
				//createTopic();
				//var pText = $( ".mw-headline" );
				//var array = $(".mw-headline").html();
				// then you can manipulate your text as you wish
				//alert(text);
				//makeArrayFromTable()
				
				*/