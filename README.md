# Eagle-Creek
Udacity Neighborhood Project

This project uses the [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/ "https://developers.google.com/maps/documentation/javascript/"), [Knockout.js](http://knockoutjs.com/ "http://knockoutjs.com/"), the [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page "https://www.mediawiki.org/wiki/API:Main_page"), and the [FourSquare API](https://developer.foursquare.com/ "https://developer.foursquare.com/")  as required tools. I used the latter two as redundant data backups to try and ensure third party data will be available to the Google Maps information window regardless of internet connection speed, as the request for data from all of these data services involves asynchronous ajax calls.

### Features
The entry point to this app is index.html. Once opened, a map for Indianapolis, IN, will appear with different colored location markers. Clicking on a location marker will open a Google Maps information window. The information window provides a Google Maps street view photo (if that particular location has photo data in the Google database), the address of the location, the location's URL link, the FourSquare URL link (if that particular location has an associated URL link in the FourSquare database), and a URL link to the Wikipedia page that is associated with the title of the particular location.

A list view of the locations is aligned to the left of the page. Locations can be filtered, and only the titles of the locations matching the filter will remain in the list view, as well as, only the corresponding location markers of the filtered list will remain in view on the map. This app is responsive to different device view widths.

### Sources
1. [Stackoverflow](https://stackoverflow.com/questions/37375015/how-to-access-an-object-in-a-wikipedia-api-if-the-other-objects-names-keys-keep "https://stackoverflow.com/questions/37375015/how-to-access-an-object-in-a-wikipedia-api-if-the-other-objects-names-keys-keep")
2. [Iconfinder](https://www.iconfinder.com/icons/134216/hamburger_lines_menu_icon "https://www.iconfinder.com/icons/134216/hamburger_lines_menu_icon")
3. [Mozilla Developer Network](https://developer.mozilla.org/en-US/ "https://developer.mozilla.org/en-US/")
4. [Benoheads's Software Blog](https://benohead.com/javascript-variables-asynchronous-callback-functions/ "https://benohead.com/javascript-variables-asynchronous-callback-functions/")
5. [Knock Me Out](http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html "http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html")
6. [w3schools.com](http://www.w3schools.com/jsref/prop_element_classlist.asp "http://www.w3schools.com/jsref/prop_element_classlist.asp")

### Development Tools Used
1. [Atom](https://atom.io/ "https://atom.io/") version 1.10.2
2. [Google Chrome - Canary](https://www.google.com/chrome/browser/canary.html "https://www.google.com/chrome/browser/canary.html") Version 55.0.2877.0 canary (64-bit)
3. [npm](https://www.npmjs.com/ "https://www.npmjs.com/")
4. [nodejs](https://nodejs.org/en/ "https://nodejs.org/en/")
5. [gulpjs](http://gulpjs.com/ "http://gulpjs.com/")
6. [gulp plugins](http://gulpjs.com/plugins/ "http://gulpjs.com/plugins/")
7. [GitHub Desktop](https://desktop.github.com/ "https://desktop.github.com/")
8. MacBook Pro OSX 10.11.6

  * The gulpfile.js file used for pre/post processing is located in the root directory of my [repository](https://github.com/mindgriot/phil-website-optimization "https://github.com/mindgriot/phil-website-optimization"). To use the pre/post processes I used install the following gulpjs plugins:

  ```bash
  $> sudo npm install --save-dev gulp gulp gulp-minify lost axis postcss-cssnext gulp-cssnano gulp-plumber gulp-concat browser-sync autoprefixer gulp-sourcemaps gulp-responsive gulp-stylus poststylus rupture gulp-load-plugins gulp-rename gulp-imagemin critical
  ```
  * run the gulp command to start the server and run default gulp scripts, or run individuals scripts by themselves:

  ```bash
  $> gulp
  or
  $> gulp 'script name'
  ```
