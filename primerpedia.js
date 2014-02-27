var apiUrl = "http://en.wikipedia.org/w/api.php?";

function randomArticle(){
	startSpinner();
	// API request to load non-random page:
	// action=parse&page=Concise_Wikipedia&section=0&prop=text&format=txtfm&disablepp
	// first section of a random article. API query devised by http://stackoverflow.com/q/13517901/266309
	// action=query&prop=revisions&rvprop=content&rvparse=&rvsection=0&generator=random&grnnamespace=0&indexpageids=true&format=json
	$.ajax({
		// https://www.mediawiki.org/wiki/Extension:MobileFrontend#prop.3Dextracts
		url: apiUrl + "action=query&prop=extracts&exintro&generator=random&grnnamespace=0&indexpageids=true&format=json",
		data: {
		    format: "json"
		},
		dataType: "jsonp",
		success: function(jsonObject) {
			displayArticle(jsonObject);
		}
	});
}

function search(){
	startSpinner();
	searchTerm = $('#search-term')[0].value;
	$.ajax({
		url: apiUrl + "action=query&list=search&srsearch=" + searchTerm + "&srnamespace=0&srlimit=1&redirects=&format=json",
		data: {
		    format: "json"
		},
		dataType: "jsonp",
		success: function(jsonObject){
			loadFromSearch(jsonObject);
		}
	});
}

function loadFromSearch(searchResult){
	var title = searchResult.query.search[0].title;
	$.ajax({
		// Option 1: Using action=parse
		//url: apiUrl + "action=parse&page=" + title + "&section=0&prop=text&format=txtfm&disablepp",
		// Option 2: Using action=query&prop=extracts
		url: apiUrl + "action=query&prop=extracts&exintro&titles=" + title + "&indexpageids=true&format=json",
		data: {
		    format: "json"
		},
		dataType: "jsonp",
		success: function(jsonObject){
			// Option 1: if using action=parse
			//$("#content").html(jsonObject.parse.text['*']);
			// Option 2: if using action=query&prop=extracts
			loadFromSearch(jsonObject);
		}
	});
}

function displayArticle(articleData){
	var pageid = articleData.query.pageids[0];
	var article = articleData.query.pages[pageid];
	article.url = "http://en.wikipedia.org/wiki/" + encodeURIComponent(article.title);
	article.link = "<a href='" + article.url + "'>" + article.title + "</a>";
	var editlink = "<a href='" + article.url + "?action=edit&section=0' class='edit-link'>improve this!</a>";
	$("#content").html("<h2>" + article.link + editlink + "</h2>");
	$("#content").append( article.extract );
}

function startSpinner(){
	// Loading animation from http://www.ajaxload.info/
	$("#content").html("<img src='loading.gif' alt='Loading...' style='margin:1em 50%'>");
}
