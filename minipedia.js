function onFormSubmit(){
	apiUrl = "http://en.wikipedia.org/w/api.php?";
	// API request to load non-random page:
	// action=parse&page=Concise_Wikipedia&section=0&prop=text&format=txtfm&disablepp
	$.ajax({
		// first section of a random article. API query devised by http://stackoverflow.com/q/13517901/266309
		url: apiUrl + 'action=query&prop=revisions&rvprop=content&rvparse=&rvsection=0&generator=random&grnnamespace=0&indexpageids=true&format=json',
		data: {
		    format: 'json'
		},
		dataType: 'jsonp',
		success: function(jsonObject) {
			var pageid = jsonObject.query.pageids[0];console.log(pageid);
			var article = jsonObject.query.pages[pageid];
			article.url = "http://en.wikipedia.org/wiki/" + encodeURIComponent(article.title);
			article.link = "<a href='" + article.url + "'>" + article.title + "</a>";
			article.text = cleanup( article.revisions[0]["*"] );
			$("#content").html("<h2>" + article.link + "</h2>");
			$("#content").append( article.text );
		}
	});
}

function cleanup( txt ){
	tmp = $(txt).find("table").remove().end();
	$("#debug").html(tmp);
	return txt;
}
