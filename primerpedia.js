/* There are 3 ways (that I know about) of getting the first section of an article.
 * 1) We can use action=parse coupled with the section=0 parameter,
 *    but the "page" parameter needs to be supplied,
 *    which means that we'd have to make two API requests
 *    (either to get a random page, or to resolve a search term)
 *    btw, this action seems to have a mobileformat= parameter, but the resuts are poor.
 * 2) Another option is to use the prop=revisions query, coupled with rvprop=content,
 *    &rvsection=0 and rvparse=true (see http://stackoverflow.com/q/13517901/266309).
 *    This request can be combined with a random article generator,
 *    using generator=random&grnnamespace=0,
 *    or with a search generator, using generator=search.
 *    But the parser returns the full html, so we'd have to clean it up ourselves.
 * 3) Finally, we can use the prop=extracts query (from the Extension:MobileFrontend's extracts,
 *    see https://www.mediawiki.org/wiki/Extension:MobileFrontend#prop.3Dextracts)
 *    coupled with the "exintro" parameter. This can be paired
 *    with a random page generator or a search generator.
 *    The cleanup is pretty good, but links are removed (maybe not a bad thing)
 *    and some templates are still displayed, so they need to be hidden via css
 */

var apiUrl = "http://en.wikipedia.org/w/api.php?";
// https://www.mediawiki.org/wiki/Extension:MobileFrontend#prop.3Dextracts
var apiExtractsQuery = "action=query&prop=extracts&exintro&indexpageids=true&format=json";

function random(){
	apiRequest( apiExtractsQuery + "&generator=random&grnnamespace=0" );
}

function search(){
	searchTerm = $('#search-term')[0].value;
	if(searchTerm)
		apiRequest( apiExtractsQuery + "&generator=search&gsrlimit=1&gsrsearch=" + searchTerm );
	else random();
}

function apiRequest(queryString){
	// Loading animation from http://www.ajaxload.info/
	$("#content").html("<img src='img/loading.gif' alt='Loading...' style='margin:1em 50%'>");
	$.ajax({
		url: apiUrl + queryString,
		data: {
		    format: "json"
		},
		dataType: "jsonp",
		success: function(jsonObject){
			var searchData = jsonObject.query.searchinfo;
			if( typeof searchData === 'undefined' || searchData.totalhits > 0 ){ //
				var pageid = jsonObject.query.pageids[0];
				var article = jsonObject.query.pages[pageid];
				article.url = "http://en.wikipedia.org/wiki/" + encodeURIComponent(article.title);
				article.link = "<a href='" + article.url + "'>" + article.title + "</a>";
				var editlink = "<a href='" + article.url + "?action=edit&section=0' class='edit-link'>improve this!</a>";
				$("#content").html("<h2>" + article.link + editlink + "</h2>");
				$("#content").append( article.extract );
			} else if( typeof searchData.suggestion !== 'undefined' ){
				apiRequest( apiExtractsQuery + "&generator=search&gsrlimit=1&gsrsearch=" + searchData.suggestion );
			} else {
				$("#content").html("<div class='error'>The search term wasn't found.</div>");
			}
		}
	});
}
