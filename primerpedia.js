/**
 * @file Primerpedia Script Entry Point
 *
 * There are 3 ways (that I know about) of getting the first section of an article.
 * 1) We can use action=parse coupled with the section=0 parameter,
 *    but the "page" parameter needs to be supplied,
 *    which means that we'd have to make two API requests
 *    (either to get a random page, or to resolve a search term)
 *    btw, this action seems to have a mobileformat= parameter, but the resuts are poor.
 * 2) Another option is to use the prop=revisions query, coupled with rvprop=content,
 *    &rvsection=0 and rvparse=true (see https://stackoverflow.com/q/13517901/266309).
 *    This request can be combined with a random article generator,
 *    using generator=random&grnnamespace=0,
 *    or with a search generator, using generator=search.
 *    But the parser returns the full html, so we'd have to clean it up ourselves.
 * 3) The third option (and the one we are using at the moment) is the prop=extracts query
 *    (from Extension:TextExtracts, https://www.mediawiki.org/wiki/Extension:TextExtracts),
 *    coupled with the "exintro" parameter.
 *    This can be paired with a random page generator, or a search generator.
 *    The cleanup is pretty good, but links are removed (maybe not a bad thing)
 *    and some templates are still displayed, so they need to be hidden via css.
 */

// Declare eslint globals (needed because we're using separated files)
/* global clearNode, toggleVisibility, getQueryVariable */

var wikipediaUrl = "wikipedia.org";
var requestTimeoutInMs = 3000;
var requestCallbackName = "requestCallback";
var notificationTimeoutInMs = 3000;
var notificationTimeout = null;

var apiUrl = wikipediaUrl + "/w/api.php";

var articleIntroQuery = "action=query&prop=extracts&exintro&indexpageids=true&format=json";
var editIntroQuery = "?action=edit&amp;section=0";

var searchQuery = "&generator=search&gsrlimit=1&gsrsearch=";
var randomArticleQuery = "&generator=random&grnnamespace=0";

var notificationElement = null;
var notificationContentElement = null;
var searchTermInputElement = null;
var languageInputElement = null;
var searchButton = null;
var contentDivElement = null;
var viewLinkElem = null;
var editLinkElement = null;
var copyShareLinkElement = null;
var articleTitleElement = null;
var licenseIconElement = null;
var infoIconElement = null;
var copyShareLinkInputElement = null;
var copyInputContainer = null;

/**
 * Used to trigger search for a random topic
 */
// Disable eslint's no-unused-vars warning for the next line.
// Needed because this function is currently only called via HTML
// eslint-disable-next-line no-unused-vars
function random() {
    searchTermInputElement.value = "";
    var language = getLanguageCode();
    apiRequest(language, articleIntroQuery + randomArticleQuery);
}

function search() {
    updateSearchButtonEnabledState();

    var searchTerm = searchTermInputElement.value;
    var language = getLanguageCode();

    if(typeof searchTerm === "string" && searchTerm.length > 0) {
        apiRequest(language, articleIntroQuery + searchQuery + searchTerm.replace(/ /g, "_"));
    }
}

function renderLoadingSpinner() {
    // Show animated loading spinner -- from https://commons.wikimedia.org/wiki/File:Chromiumthrobber.svg
    contentDivElement.innerHTML = "<img src='img/loading.svg' alt='Loading...' id='loading-spinner'/>";
}

/**
 * Execute a JSONP Request
 * @param {string} queryString
 */
function apiRequest(language, queryString) {

    if(typeof queryString !== "string" || queryString.length <= 0) {
        throw new Error("apiRequest requires a non-empty string parameter.");
    }

    renderLoadingSpinner();

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = prefixUrl(language) + apiUrl + "?" + queryString + "&callback=" + requestCallbackName;

    document.getElementsByTagName("head")[0].appendChild(script);

    var onCompleted = function () {
        // reduce global namespace pollution
        delete (window[requestCallbackName]);
        // remove jsonp result tag
        script.remove();
    }

    var requestTimeout = window.setTimeout(function () {
        onCompleted();
    }, requestTimeoutInMs);

    window[requestCallbackName] = function (jsonObject) {
        window.clearTimeout(requestTimeout);

        handleRequestResult(jsonObject);

        onCompleted();
    }
}

function getShareableLink(search, language) {
    return window.location.pathname + "?search=" + search + "&language=" + language;
}

function getLanguageCode() {
    return languageInputElement.value || 'en';
}

function renderSearchResult(jsonObject) {
    var pageid = jsonObject.query.pageids[0];
    var article = jsonObject.query.pages[pageid];
    var encodedArticleTitle = encodeURIComponent(article.title).replace(/%20/g, "_");
    article.url = prefixUrl(getLanguageCode()) + wikipediaUrl + "/wiki/" + encodedArticleTitle;
    var editlink = article.url + editIntroQuery;
    var shareLink = window.location.href;

    viewLinkElem.textContent = article.title;
    viewLinkElem.setAttribute("href", article.url);

    editLinkElement.setAttribute("href", editlink);
    toggleVisibility(articleTitleElement, true);

    copyShareLinkInputElement.value = getShareableLink(encodedArticleTitle, language.value);

    contentDivElement = clearNode(contentDivElement);
    contentDivElement.innerHTML = article.extract;

    toggleVisibility(licenseIconElement, true);
    toggleVisibility(infoIconElement, true);
}

function renderNotFoundNode() {
    toggleVisibility(articleTitleElement, false);
    toggleVisibility(licenseIconElement, false);
    toggleVisibility(infoIconElement, false);

    var notFoundNode = document.createElement("div");
    notFoundNode.classList.add("error");
    notFoundNode.textContent = "The search term wasn't found.";

    contentDivElement = clearNode(contentDivElement);

    contentDivElement.appendChild(notFoundNode);
}

function isHistoryStateSet() {
    if(history.state === undefined) {
        return false;
    }

    if(history.state === null) {
        return false;
    }

    if(!history.state.hasOwnProperty("search")) {
        return false;
    }

    return true;
}

function addToBrowserHistory(jsonObject) {
    // pretty WET, probably best to make a DTO from the request
    var pageid = jsonObject.query.pageids[0];
    var article = jsonObject.query.pages[pageid];
    var search = encodeURIComponent(article.title).replace(/%20/g, "_");
    var language = getLanguageCode();

    var historyState = {
        search: search
    };

    if(isHistoryStateSet() && history.state.search === search) {
        //Current page is already in history
        return;
    }

    history.pushState(historyState, window.title, getShareableLink(search, language));
}

function handleRequestResult(jsonObject) {
    if(jsonObject.hasOwnProperty("query")) {
        var searchData = jsonObject.query.searchinfo;

        if(typeof searchData === "undefined" || searchData.totalhits > 0) {
            renderSearchResult(jsonObject);
            addToBrowserHistory(jsonObject);

            return;
        } else if(typeof searchData.suggestion !== "undefined") {
            apiRequest(articleIntroQuery + searchQuery + searchData.suggestion);

            return;
        }
    }

    renderNotFoundNode();
}

function updateSearchButtonEnabledState() {
    if(searchTermInputElement instanceof HTMLInputElement && searchButton instanceof HTMLInputElement) {
        var searchTermInputElementValue = searchTermInputElement.value;

        if(typeof searchTermInputElementValue === "string" && searchTermInputElementValue.length > 0) {
            searchButton.removeAttribute("disabled");
        } else {
            searchButton.setAttribute("disabled", "disabled");
        }
    }
}

// Upon loading the page, check if an URL parameter was passed, and use it to perform a search
window.onload = function () {
    notificationElement = document.getElementById("notification");
    notificationContentElement = document.getElementById("notification-content");
    searchTermInputElement = document.getElementById("search-term");
    languageInputElement = document.getElementById("language");
    searchButton = document.getElementById("searchButton");
    contentDivElement = document.getElementById("content");
    viewLinkElem = document.getElementById("viewlink");
    editLinkElement = document.getElementById("editlink");
    copyShareLinkElement = document.getElementById("copysharelink");
    articleTitleElement = document.getElementById("article-title");
    licenseIconElement = document.getElementById("license-icon");
    infoIconElement = document.getElementById("info-icon");
    copyShareLinkInputElement = document.getElementById("copyShareLinkInput");
    copyInputContainer = document.getElementById("copyInputContainer");

    var queryParam = getQueryVariable("search");

    if(queryParam !== null) {
        searchTermInputElement.value = queryParam.replace(/_/g, " ");
        search();
    }

    if(!isHistoryStateSet()) {
        // just for convenience
        history.replaceState({
            search: queryParam
        }, window.title, window.location.href);
    }

    searchTermInputElement.addEventListener("keyup", function () {
        updateSearchButtonEnabledState();
    });

    searchTermInputElement.addEventListener("blur", function () {
        updateSearchButtonEnabledState();
    });

    copyShareLinkElement.addEventListener("click", function () {
        // this should allways be true, but doesn't hurt to check
        if(copyShareLinkInputElement instanceof HTMLInputElement) {
            // some browsers require a visible source for selection & copy to work
            // this container virtually stays invisible
            // since we hide it again as soon as we are done executing the copy instruction
            toggleVisibility(copyInputContainer, true);

            // clipboard interaction is a dodgy thing
            // this should prevent the worst things where browser support
            // or permissions are missing
            try {
                copyShareLinkInputElement.select(); // select the contents of the input
                document.execCommand("copy"); // copy the selection into the clipboard

                toggleVisibility(notificationElement, true); // show notification to user
                // hide notification after an agreeable time
                setTimeout(function () {
                    toggleVisibility(notificationElement, false); //
                }, notificationTimeoutInMs);
            } catch(e) {
            }

            toggleVisibility(copyInputContainer, false);
        }
    });

    notificationContentElement.addEventListener("click", function () {
        toggleVisibility(notificationElement, false);
    });
};

window.onpopstate = function () {
    if(isHistoryStateSet()) {
        if(history.state.search === null) {
            // we can't search for nothing so we reload the base location
            window.location.assign(window.location.href);
            return;
        }

        // needs to be done to comform to the requirements of search()
        var queryParam = decodeURIComponent(history.state.search);

        searchTermInputElement.value = queryParam;
        search();
    }
};
