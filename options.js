(function () {
  'use strict';
  var doc = window.document,
      storage = window.localStorage;

  // Restores select box state to saved value from localStorage.
  function restoreOptions() {
    var urlValue = storage.url,
        urlInput;
    if (!urlValue) {
        return;
    }
    urlInput = doc.getElementById('url');
    urlInput.value = urlValue;
    // Show visual feedback on instructions
    var savedOptionsStatus = doc.getElementById('savedOptionsStatus');
    savedOptionsStatus.classList.add("activate");
    savedOptionsStatus.innerHTML = '&#10004;';
  }

  function showStatus(msg) {
    // Show visual feedback on button
    var status = doc.getElementById('saveButton');
    status.classList.add("saved");
    status.innerHTML = msg;
    setTimeout(function() {
        status.innerHTML = 'Save';
        status.classList.remove("saved");
    }, 3000);
    // Show visual feedback on instructions
    var savedOptionsStatus = doc.getElementById('savedOptionsStatus');
    savedOptionsStatus.classList.add("activate");
    savedOptionsStatus.innerHTML = '&#10004;'
  }

  // Saves options to localStorage.
  function saveOptions() {

    // Emtpy previus error messages
    var error = doc.getElementById('error');
    error.innerHTML = "";

    var urlInput = doc.getElementById('url').value;
    // Test if URL is valid
    var re = new RegExp("^(http|https)://", "i");
    var match = re.test(urlInput);
    var notEmpty, validUrl, ends;
    if(!match) error.innerHTML += '<li>The link has to begin with <code>http://</code> or <code>https://</code>.</li>';
      else validUrl = true;
    if(!urlInput.endsWith("/")) error.innerHTML += '<li>Since the link should point to a folder, it has to end with <code>/</code>.</li>';
      else ends = true;

    if(validUrl && ends) {
      storage.url = urlInput;
      // Update status to let user know options were saved.
      showStatus('&#10004;');
    }
  }

  // Initialize
  function init() {
    doc.getElementById('url').focus();
    restoreOptions();
    doc.getElementById('saveButton')
      .addEventListener('click', saveOptions)
  }

  window.onload=init;
}());
