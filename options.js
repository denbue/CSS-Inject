(function () {
  'use strict';
  var doc = window.document,
      storage = window.localStorage;

  // Restores select box state to saved value from localStorage.
  function restoreOptions() {
    var cssfileValue = storage.cssfile,
        cssfileInput;
    if (!cssfileValue) {
        return;
    }
    protofileInput = doc.getElementById('protoURL');
    protofileInput.value + "/style.css" = cssfileValue;
  }

  function showStatus(msg) {
    var status = doc.getElementById('status');
    status.innerHTML = msg;
    setTimeout(function() {
        status.innerHTML = '';
    }, 1500);
  }

  // Saves options to localStorage.
  function saveOptions() {
    var protofileInput = doc.getElementById('protoURL');
    storage.cssfile = protofileInput.value + "/style.css";
    // Update status to let user know options were saved.
    showStatus('Prototype Saved');
  }

  // Initialize
  function init() {
    doc.getElementById('protoURL').focus();
    restoreOptions();
    doc.getElementById('saveButton')
      .addEventListener('click', saveOptions);
  }

  window.onload=init;
}());
