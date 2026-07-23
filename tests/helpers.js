const path = require("path");

/**
 * Loads jQuery fresh, installs stubs for third-party jQuery plugins used by the
 * site scripts, evaluates one of the site's own scripts under coverage
 * instrumentation, and waits for its `jQuery(document).ready(...)` handler to
 * run.
 *
 * The site scripts are plain `<script>` files (not modules) that register a
 * document-ready handler. jsdom reports the document as already loaded during
 * tests, so jQuery schedules the ready handler on a timer; awaiting a macrotask
 * lets it run before assertions.
 *
 * @param {string} scriptFile - file name inside the repo `js/` directory.
 * @param {(jq: Function) => void} [beforeReady] - optional hook run with the
 *   jQuery instance after the plugin stubs are installed but before the
 *   script's document-ready handler executes (e.g. to swap a stub for a spy).
 * @returns {Promise<Function>} the jQuery instance the script ran against.
 */
async function loadSiteScript(scriptFile, beforeReady) {
  jest.resetModules();
  const $ = require("jquery");
  global.$ = $;
  global.jQuery = $;

  // Site scripts call third-party jQuery plugins that are not under test.
  // Stub them so requiring the script does not throw.
  const noop = function () {
    return this;
  };
  $.fn.tooltip = noop;
  $.fn.fancybox = noop;
  $.fn.flexslider = noop;

  if (typeof beforeReady === "function") {
    beforeReady($);
  }

  require(path.join(__dirname, "..", "js", scriptFile));

  // jQuery resolves document-ready handlers through a Deferred (`then`), which
  // runs on a later microtask/macrotask than the handler that fires
  // `jQuery.ready`. Registering our own ready callback after the script has
  // registered its handler guarantees ours runs last, i.e. once the script's
  // ready handler has finished wiring up the DOM.
  await new Promise((resolve) => $.ready.then(resolve));
  return $;
}

module.exports = { loadSiteScript };
