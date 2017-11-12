/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

const Options = {
    data: {
      whitelist: [],
    },

    init: function() {
      this.cache();
      this.bindEvents();
      this.getDataFromStorage();
      this.render(); // pointless for now. refactor getDataFromStorage()
    },

    bindEvents: function() {
      this.options.addEventListener('submit', this.submit.bind(this));
      this.urlEntry.addEventListener('keydown', this.urlEntryHandler.bind(this));
    },

    /** Caches DOM elements so they only have to be located once */
    cache: function() {
      this.options = document.forms['options'];
      this.urlEntry = document.getElementById('urlEntry');
      this.whitelist = document.getElementById('whitelist');
    },

    /**
     * Retrieves form data from storage, then renders the page
     *
     * TODO: use promises to delete this.render() and only use init();
     */
    getDataFromStorage: function() {
      chrome.storage.local.get('whitelist', (data) => {
        console.info('retrieved from storage: ' + JSON.stringify(data));
        this.data.whitelist = data.whitelist;

        this.render();
      });
    },

    /** (re)Fills the forms on the page. */
    render: function() {
      this.whitelist.textContent = this.data.whitelist;
    },

    /**
     * Handler for the form's 'submit' event
     * Saves the whitelist to local storage
     *
     * TODO: URL validation before submitting
     * @param {Event} event
     */
    submit: (event) => {
      event.preventDefault();

      let form = new FormData(document.forms['options']);
      let data = {'whitelist': form.get('whitelist')};

      chrome.storage.local.set(data, () => {
        console.info('saved to storage: ' + JSON.stringify(data));
      });
    },

    /**
     * Validates the urlEntry input before adding it to the whitelist
     *
     * TODO: refactor URL validation to a separate function
     * TODO: store URLs in a set instead of grabbing the textContent
     * @param {KeyboardEvent} event
     */
    urlEntryHandler: (event) => {
      this.urlEntry.classList.remove('is-success', 'is-danger');
      if (event.key === 'Enter') {
        event.preventDefault();

        // eslint-disable-next-line
        let pattern = new RegExp('^(http(s)?:\/\/)?(www.)?([-a-z0-9\*]{1,63}\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\.[a-z]{2,6}(\/[*-\w@\+\.~#\?&/=%]*)?');
        if (pattern.test(this.urlEntry.value)) { // URL is valid
          this.urlEntry.classList.add('is-success');
          this.whitelist.textContent = this.whitelist.textContent + '\n' +
            this.urlEntry.value;
          this.urlEntry.value = '';
        } else {
          this.urlEntry.classList.add('is-danger');
        }
      }
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    Options.init();
  });


/***/ })
/******/ ]);