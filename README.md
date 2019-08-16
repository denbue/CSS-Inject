![Logo](https://raw.githubusercontent.com/denbue/Prototype/master/images/icon128.png)

# Prototype &mdash; A tool to test your ideas in real-time
Prototype is a Chrome extension to inject any hosted stylesheets (CSS) or Javascript (JS) file into any webpage. 

## Installation
After installing the extension from the Chrome Extension Gallery (or loading unpacked from source), right-click on the extension icon and select "Options".

Install the extension: https://chrome.google.com/webstore/detail/fdgdeaiajeafamlgajlpgbejadaegepj/

## Features
- Specify any hosted CSS or JS file to inject (local files must be hosted under `http://localhost/` - security restriction of Chrome)
- It modifies HTTP headers for full prototyping power.
- You can use the extension for your own prototyping or for others to test your prototype.
- The extension saves your options even when you restart the browser or change the code.




**Currently modified header policies:**
- Disabled `Access-Control-Allow-Origin` and `Content-Security-Policy` allow for injecting cross-origin scripts.
- Explicitly enabled `Feature-Policy` modules allow to include device hardware. [List of supported feature policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy)


## Demos
Enter one of the following URLs into the options of the extension:
- Add a darkmode to your website: https://denbue.github.io/Prototype/demos/darkmode/
- Let it rain cats on your website: https://denbue.github.io/Prototype/demos/kitties/
- Ever wondered how comic sans would look on your website? https://denbue.github.io/Prototype/demos/comic/


## Thanks
A special thanks goes to [sym3tri](https://github.com/sym3tri/CSS-Inject), the original creator of CSS-Inject

`https://denbue.github.io/Prototype/demo/darkmode/`