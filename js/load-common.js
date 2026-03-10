// Common script loader for all pages.
// Loads Lodash + jQuery + Bootstrap from CDN, then js/main.js.
(function () {
  var CDN_SRC = 'https://cdn.jsdelivr.net/combine/npm/lodash@4.17.23,npm/jquery@4.0.0,npm/bootstrap@5.3/dist/js/bootstrap.bundle.min.js';

  function loadScript(src, onLoad) {
    var s = document.createElement('script');
    s.src = src;
    if (onLoad) s.onload = onLoad;
    document.head.appendChild(s);
  }

  // First load the CDN bundle, then main.js from the same directory as this script (works from root or case-studies/).
  var scriptDir = document.currentScript.src.replace(/\/[^/]*$/, '/');
  loadScript(CDN_SRC, function () {
    loadScript(scriptDir + 'main.js');
  });
})();

