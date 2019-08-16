// All DOM manipulation must exist inside this "content script" in order to execute in the proper context of the page

// inject the files into the head element
// plus a timestamp cache buster.
function appendStyleNode(id, href) {

    var cssNode = document.createElement('link');
    cssNode.type = 'text/css';
    cssNode.rel = 'stylesheet';
    cssNode.id = id;
    cssNode.href = href+'prototype.css' + '?' + (new Date()).getTime();
    document.getElementsByTagName('head')[0].appendChild(cssNode);

    var jsNode = document.createElement('script');
    jsNode.type = 'text/javascript';
    jsNode.id = id;
    jsNode.src = href+'prototype.js' + '?' + (new Date()).getTime();
    document.getElementsByTagName('head')[0].appendChild(jsNode);

    
    
}

// removes the css
function removeStyleNode(id) {
    var node = document.getElementById(id);
    node && node.parentNode.removeChild(node);
}

// currently does nothing but alert if error
function restoreStateCallback(resp) {
    if (!resp.ok) {
        alert('Error re-injecting file(s) on refresh. Try pushing the button again');
    }
}


// EVENT LISTENERS

// override window onload event to check the state of the current tab on each page load
var oldWindowOnload = window.onload;
window.onload = function() {

    // send request to background page to restore the state (since only it knows about state)
    chrome.extension.sendRequest({action: 'restoreState'}, restoreStateCallback);

    // execute any previously existing window onload events
    if (oldWindowOnload && typeof(oldWindowOnload) === 'function') {
        oldWindowOnload();
    }
};

// listen to injections/removal requests from background.html
chrome.extension.onRequest.addListener(

    // depending on state value, injext/remove css
    function(req, sender, sendResponse) {

        req.state === 'on' 
            ? appendStyleNode(req.id, req.href)
            : removeStyleNode(req.id);

        // notify of no problems
        sendResponse({ok: true});
    }
);
