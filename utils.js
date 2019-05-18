/**
 * @file Primerpedia Utility Functions
 */

// This file only provides static global functions,
// which are called from primerpedia.js; so we tell eslint
// to ignore the "no unused variables" check for this entire file:
/* eslint-disable no-unused-vars */

/**
 * Remove any Child Nodes from an Element
 * @param {HTMLElement} node - any DOM Node
 */
function clearNode(node) {
    var clone = node.cloneNode(false);
    node.parentNode.replaceChild(clone, node);

    return clone;
}

/**
 * Changes Visibility of an HTMLElement
 * @param {HTMLElement} element - any DOM Node
 * @param {boolean} visibility - show or hide DOM Node
 */
function toggleVisibility(element, visibility) {
    if(element instanceof HTMLElement) {
        if(!visibility) {
            element.style.setProperty("display", "none");
        } else {
            element.style.removeProperty("display");
        }
    }
}

/**
 * Get query string from URL parameter
 *
 * @see [origin on stackoverflow]{@link https://stackoverflow.com/a/2091331/266309}
 * @param {string} parameter - Name of the query parameter to retrieve
 * @returns {string|null} - Decoded query parameter or null
 */
function getQueryVariable(parameter) {
    // Get query string, excluding the first character, "?"
    var query = window.location.search.substring(1);
    // Split each parameter=value pair using "&" as separator
    var vars = query.split("&");
    // Loop over all the parameter=value pairs, and split them into their parameter/value components
    for(var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If one of the parameter names is the one we're looking for, return its value
        if(decodeURIComponent(pair[0]) == parameter) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}

function prefixUrl(language) {
    return "https://" + language + ".";
}
