(function () {
  'use strict';

  // global object to store headers
  var headers = [
    { name: 'content-security-policy', value: '' },
    { name: 'feature-policy', value: 'geolocation *; camera *; payment *;' },
    { name: 'allow-control-allow-origin', value: '*' },
  ]

  // global object to track on/off state of each tab
  var state = {},
      storage = window.localStorage;

  // Displays error messages
  function error(msg) {
    window.alert('ERROR: ' + msg);
  }

  // send 'load/unload' request to the embedded content script
  function sendInjectionRequest(tabId, tabState, callback) {
    chrome.tabs.sendRequest(
      tabId,
      {
        // state of current tab
        state: tabState,
        // id of <link> element to inject
        id: 'cssjsinject-injected-folder',
        // file path specified by user in options
        href: storage.url
      },
      function(resp) {
        // something went wrong
        if (!resp.ok) {
          error('Could not load folder');
        }
        if (callback) {
          callback();
        }
      }
    );
  }

  // Turn on the plugin badge and inject the file
  function turnOn(tabId) {
    // send request to content script
    sendInjectionRequest(tabId, state[tabId], function() {
      // update badge
      chrome.browserAction.setBadgeText({text: 'on', tabId: tabId});
      // reload tab
      //chrome.tabs.update(tabId);
    });
    // modify headers
    modifyHeaders(tabId, 'modify')
    // reload tab when enabling for first time
    if (state[tabId] != 'on') chrome.tabs.reload(tabId);
    // update state
    state[tabId] = 'on';
  }

  // Turn off the plugin badge
  function turnOff(tabId) {
    // send request to content script
    sendInjectionRequest(tabId, 'off', function() {
      // update badge
      chrome.browserAction.setBadgeText({text: '', tabId: tabId});
    });
    // restore headers
    modifyHeaders(tabId, 'restore')
    // reload tab when enabling for first time
    if (state[tabId] == 'on') chrome.tabs.reload(tabId);
    // just delete the property if it exists
    delete state[tabId];
  }

  // toggles injection on/off
  function toggleInjection(tab) {
    // toggle state on click
    if (state[tab.id] === 'on') {
      turnOff(tab.id);
    } else {
      turnOn(tab.id);
    }
  }

  // restore state on page reloads
  function restoreState(req, sender, sendResponse) {
    // first get current window
    chrome.windows.getCurrent(function(win) {
      // then get current tab
      chrome.tabs.getSelected(win.id, function(tab) {
        // check the tab's state
        if (state[tab.id] === 'on') {
          // if it should be on turn it on
          turnOn(tab.id);
          // notify content script that all is good
          sendResponse({ok: true});
        }
      });
    });
  }

   // modify headers
   function modifyHeaders(tab, action) {

    chrome.webRequest.onHeadersReceived.addListener(details => {
      let myResponseHeaders = details.responseHeaders;
      // console.log(myResponseHeaders)
  
      for(var i=0; i<headers.length; i++) {
        // Check if the header has been defined already and if, then replace from header
        let header = myResponseHeaders.find(e => e.name.toLowerCase() == headers[i].name);      
        if (header) {
            let headerIndex = myResponseHeaders.indexOf(header);
            // Save header value in localStorage for restoring
            storage[tab+'-'+headers[i].name] = myResponseHeaders[headerIndex].value;
            // Remove to replace it later
            myResponseHeaders.splice(headerIndex,1);

            if (action === 'modify') {
              // insert modified header
              // console.log ('Modifying header in '+tab+': '+headers[i].name);
              myResponseHeaders.push(headers[i]);
            }
            else if (action === 'restore') {
              // restore header from localstorage
              // console.log ('Restoring header in '+tab+': '+headers[i].name);
              myResponseHeaders.push({
                'name': headers[i].name,
                'value': storage[tab+'-'+headers[i].name]
              });
              storage.removeItem(tab+'-'+headers[i].name)
            }
        }
      }
      // add 'Access-Control-Allow-Origin' manually for all headers
      let accessControl = myResponseHeaders.find(e => e.name.toLowerCase() == 'access-control-allow-origin');      
      if (accessControl) {
          let accessControlIndex = myResponseHeaders.indexOf(accessControl);
          // Remove to replace it later
          myResponseHeaders.splice(accessControlIndex,1);
      }
      myResponseHeaders.push({
        'name': 'access-control-allow-origin',
        'value': '*'
      });
      //console.log(details.url, myResponseHeaders)
      // return headers
      return {responseHeaders: myResponseHeaders};
      

    }, {urls: ["*://*/*"], tabId: tab}, ['blocking', 'responseHeaders']);

   }

  // EVENT HANDLERS

  // User clicked the activate action button,
  // kick off all the injection goodness.
  chrome.browserAction.onClicked.addListener(toggleInjection);
  // Handle requests from embedded content script.
  chrome.extension.onRequest.addListener(restoreState);

 

}());
