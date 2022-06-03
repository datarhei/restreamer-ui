/*! @name videojs-license @version 0.1.0 @license MIT */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js'), require('global/document')) :
	typeof define === 'function' && define.amd ? define(['video.js', 'global/document'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.videojsLicense = factory(global.videojs, global.document));
}(this, (function (videojs, document) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var videojs__default = /*#__PURE__*/_interopDefaultLegacy(videojs);
	var document__default = /*#__PURE__*/_interopDefaultLegacy(document);

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var assertThisInitialized = createCommonjsModule(function (module) {
	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  module.exports = _assertThisInitialized;
	  module.exports["default"] = module.exports, module.exports.__esModule = true;
	});

	var setPrototypeOf = createCommonjsModule(function (module) {
	  function _setPrototypeOf(o, p) {
	    module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    module.exports["default"] = module.exports, module.exports.__esModule = true;
	    return _setPrototypeOf(o, p);
	  }

	  module.exports = _setPrototypeOf;
	  module.exports["default"] = module.exports, module.exports.__esModule = true;
	});

	var inheritsLoose = createCommonjsModule(function (module) {
	  function _inheritsLoose(subClass, superClass) {
	    subClass.prototype = Object.create(superClass.prototype);
	    subClass.prototype.constructor = subClass;
	    setPrototypeOf(subClass, superClass);
	  }

	  module.exports = _inheritsLoose;
	  module.exports["default"] = module.exports, module.exports.__esModule = true;
	});

	var version = "0.1.0";

	var Plugin = videojs__default['default'].getPlugin('plugin');
	var Component = videojs__default['default'].getComponent('Component');
	var Button = videojs__default['default'].getComponent('MenuButton'); // Default options for the plugin.

	var defaults = {
	  license: 'none',
	  title: '',
	  author: '',
	  languages: {
	    license: 'License',
	    loading: 'Loading'
	  }
	};
	/**
	 * An advanced Video.js plugin. For more information on the API
	 *
	 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
	 */

	var License = /*#__PURE__*/function (_Plugin) {
	  inheritsLoose(License, _Plugin);

	  /**
	   * Create a License plugin instance.
	   *
	   * @param  {Player} player
	   *         A Video.js Player instance.
	   *
	   * @param  {Object} [options]
	   *         An optional options object.
	   *
	   *         While not a core part of the Video.js plugin architecture, a
	   *         second argument of options is a convenient way to accept inputs
	   *         from your plugin's caller.
	   */
	  function License(player, options) {
	    var _this;

	    // the parent class will add player under this.player
	    _this = _Plugin.call(this, player) || this;
	    _this.playerId = _this.player.id();
	    _this.options = videojs__default['default'].mergeOptions(defaults, options);

	    if (options.license === 'none') {
	      return assertThisInitialized(_this);
	    }

	    _this.player.ready(function () {
	      _this.player.addClass('vjs-license');

	      _this.buildUI();

	      if (videojs__default['default'].browser.IS_IOS || videojs__default['default'].browser.IS_ANDROID) {
	        _this.mobileBuildUI();
	      }
	    }); // close the menu if open on userinactive


	    _this.player.on('userinactive', function () {
	      document__default['default'].getElementById(_this.playerId).querySelectorAll('.vjs-menu').forEach(function (element) {
	        element.classList.remove('vjs-lock-open');
	      });
	    }); // close the menu if anywhere in the player is clicked


	    _this.player.on('click', function (evt) {
	      if (evt.target.tagName === 'VIDEO') {
	        document__default['default'].getElementById(_this.playerId).querySelectorAll('.vjs-menu').forEach(function (element) {
	          element.classList.remove('vjs-lock-open');
	        });
	      }
	    });

	    _this.player.on('loadstart', function (_event) {
	      _this.removeElementsByClass('vjs-license-clear');

	      if (videojs__default['default'].browser.IS_IOS || videojs__default['default'].browser.IS_ANDROID) {
	        _this.mobileBuildTopLevelMenu();
	      } else {
	        _this.buildTopLevelMenu();
	      }
	    });

	    return _this;
	  }
	  /**
	   * Add the menu ui button to the controlbar
	   */


	  var _proto = License.prototype;

	  _proto.buildUI = function buildUI() {
	    var playerId = this.playerId;
	    var that = this;
	    /**
	     * LicenseMenuButton
	     */

	    var LicenseMenuButton = /*#__PURE__*/function (_Button) {
	      inheritsLoose(LicenseMenuButton, _Button);

	      /**
	       * Contructor
	       *
	       * @param {*} player videojs player instance
	       * @param {*} options videojs player options
	       */
	      function LicenseMenuButton(player, options) {
	        var _this2;

	        _this2 = _Button.call(this, player, options) || this;

	        _this2.addClass('vjs-license');

	        _this2.controlText(that.options.languages.loading);

	        player.one('canplaythrough', function (_event) {
	          _this2.controlText(that.options.languages.settings);
	        });
	        _this2.menu.contentEl_.id = playerId + '-vjs-license-default';
	        return _this2;
	      }
	      /**
	       * Handle click
	       */


	      var _proto2 = LicenseMenuButton.prototype;

	      _proto2.handleClick = function handleClick() {
	        if (videojs__default['default'].browser.IS_IOS || videojs__default['default'].browser.IS_ANDROID) {
	          this.player.getChild('licenseMenuMobileModal').el().style.display = 'block';
	        } else {
	          this.el().classList.toggle('vjs-toogle-btn');
	          this.menu.el().classList.toggle('vjs-lock-open');
	        }
	      };

	      return LicenseMenuButton;
	    }(Button);

	    videojs__default['default'].registerComponent('licenseMenuButton', LicenseMenuButton);
	    this.player.getChild('controlBar').addChild('licenseMenuButton');

	    if (this.player.getChild('controlBar').getChild('fullscreenToggle')) {
	      this.player.getChild('controlBar').el().insertBefore(this.player.getChild('controlBar').getChild('licenseMenuButton').el(), this.player.getChild('controlBar').getChild('fullscreenToggle').el());
	    }
	  }
	  /**
	   *
	   * This is just build the top level menu no sub menus
	   */
	  ;

	  _proto.buildTopLevelMenu = function buildTopLevelMenu() {
	    var settingsButton = this.player.getChild('controlBar').getChild('licenseMenuButton'); // settingsButton.addClass('vjs-license-is-loaded');

	    var main = settingsButton.menu.contentEl_; // Empty the main menu div to repopulate

	    main.innerHTML = '';
	    main.classList.add('vjs-license-top-level'); // Start building new list items

	    var menuTitle = document__default['default'].createElement('li');
	    menuTitle.className = 'vjs-license-top-level-header';
	    var menuTitleInner = document__default['default'].createElement('span');
	    menuTitleInner.innerHTML = 'About';
	    menuTitleInner.className = 'vjs-license-top-level-header-titel';
	    menuTitle.appendChild(menuTitleInner);
	    main.appendChild(menuTitle);
	    var itemTitel = document__default['default'].createElement('li');
	    itemTitel.innerHTML = this.buildItemTitel();
	    itemTitel.className = 'vjs-license-top-level-item';
	    main.appendChild(itemTitel);

	    if (this.options.author) {
	      var itemAuthor = document__default['default'].createElement('li');
	      itemAuthor.innerHTML = this.buildItemAuthor();
	      itemAuthor.className = 'vjs-license-top-level-item';
	      main.appendChild(itemAuthor);
	    }

	    var itemLicense = document__default['default'].createElement('li');
	    itemLicense.innerHTML = this.buildItemLicense();
	    itemLicense.className = 'vjs-license-top-level-item';
	    main.appendChild(itemLicense);
	  }
	  /**
	   * Add the menu ui button to the controlbar
	   */
	  ;

	  _proto.mobileBuildUI = function mobileBuildUI() {
	    /**
	     * bla
	     */
	    var LicenseMenuMobileModal = /*#__PURE__*/function (_Component) {
	      inheritsLoose(LicenseMenuMobileModal, _Component);

	      /**
	       * Contructor
	       *
	       * @param {*} player videojs player instance
	       * @param {*} options videojs player options
	       */
	      function LicenseMenuMobileModal(player, options) {
	        return _Component.call(this, player, options) || this;
	      }
	      /**
	       * Creates an HTML element
	       *
	       * @return {Object} HTML element
	       */


	      var _proto3 = LicenseMenuMobileModal.prototype;

	      _proto3.createEl = function createEl() {
	        return videojs__default['default'].createEl('div', {
	          className: 'vjs-license-mobile'
	        });
	      };

	      return LicenseMenuMobileModal;
	    }(Component);

	    videojs__default['default'].registerComponent('licenseMenuMobileModal', LicenseMenuMobileModal);
	    videojs__default['default'].dom.prependTo(this.player.addChild('licenseMenuMobileModal').el(), document__default['default'].body);
	  }
	  /**
	   * Add the menu ui button to the controlbar
	   */
	  ;

	  _proto.mobileBuildTopLevelMenu = function mobileBuildTopLevelMenu() {
	    var _this3 = this;

	    var settingsButton = this.player.getChild('licenseMenuMobileModal');
	    var menuTopLevel = document__default['default'].createElement('ul');
	    menuTopLevel.className = 'vjs-license-mob-top-level vjs-setting-menu-clear';
	    settingsButton.el().appendChild(menuTopLevel); // Empty the main menu div to repopulate

	    var menuTitle = document__default['default'].createElement('li');
	    menuTitle.innerHTML = 'About';
	    menuTitle.className = 'vjs-setting-menu-mobile-top-header';
	    menuTopLevel.appendChild(menuTitle);
	    var itemTitel = document__default['default'].createElement('li');
	    itemTitel.innerHTML = this.buildItemTitel();
	    itemTitel.className = 'vjs-license-top-level-item';

	    if (this.options.author) {
	      var itemAuthor = document__default['default'].createElement('li');
	      itemAuthor.innerHTML = this.buildItemAuthor();
	      itemAuthor.className = 'vjs-license-top-level-item';
	    }

	    var itemLicense = document__default['default'].createElement('li');
	    itemLicense.innerHTML = this.buildItemLicense();
	    itemLicense.className = 'vjs-license-top-level-item';
	    var menuClose = document__default['default'].createElement('li');
	    menuClose.innerHTML = 'Close';
	    menuClose.className = 'setting-menu-footer-default';

	    menuClose.onclick = function (e) {
	      _this3.player.getChild('settingsMenuMobileModal').el().style.display = 'none';
	    };

	    menuTopLevel.appendChild(menuClose);
	  }
	  /**
	   * Add the menu ui button to the controlbar
	   *
	   * @return {string} Returns license text
	   */
	  ;

	  _proto.buildItemTitel = function buildItemTitel() {
	    var titel = '';

	    if (this.options.title) {
	      titel = "" + this.options.title;
	    }

	    return 'Title: ' + titel;
	  }
	  /**
	   * Add the menu ui button to the controlbar
	   *
	   * @return {string} Returns license text
	   */
	  ;

	  _proto.buildItemAuthor = function buildItemAuthor() {
	    var author = '';

	    if (this.options.author) {
	      author = " by " + this.options.author;
	    }

	    return 'Author: ' + author;
	  }
	  /**
	   * Add the menu ui button to the controlbar
	   *
	   * @return {string} Returns license text
	   */
	  ;

	  _proto.buildItemLicense = function buildItemLicense() {
	    var license = '';
	    var reVersion = new RegExp('[0-9]+.[0-9]+$');
	    var version = '4.0';
	    var matches = this.options.license.match(reVersion);

	    if (matches !== null) {
	      version = matches[0];
	    }

	    var which = this.options.license.replace(reVersion, '').trim();
	    var deed = null;

	    switch (which) {
	      case 'CC0':
	        deed = 'https://creativecommons.org/licenses/zero/1.0/';
	        break;

	      case 'CC BY':
	        deed = "https://creativecommons.org/licenses/by/" + version + "/";
	        break;

	      case 'CC BY-SA':
	        deed = "https://creativecommons.org/licenses/by-sa/" + version + "/";
	        break;

	      case 'CC BY-NC':
	        deed = "https://creativecommons.org/licenses/by-nc/" + version + "/";
	        break;

	      case 'CC BY-NC-SA':
	        deed = "https://creativecommons.org/licenses/by-nc-sa/" + version + "/";
	        break;

	      case 'CC BY-ND':
	        deed = "https://creativecommons.org/licenses/by-nd/" + version + "/";
	        break;

	      case 'CC BY-NC-ND':
	        deed = "https://creativecommons.org/licenses/by-nc-nd/" + version + "/";
	        break;
	    }

	    if (deed) {
	      license = "<a href=\"" + deed + "\" onclick=\"window.open('" + deed + "')\" target=\"_blank\" rel=\"noopener\">" + this.options.license + "</a>";
	    } else {
	      license = this.options.license;
	    }

	    return 'License: ' + license;
	  }
	  /**
	   *
	   * Helper class to clear menu items before rebuild
	   *
	   * @param {*} className Name of a class
	   */
	  ;

	  _proto.removeElementsByClass = function removeElementsByClass(className) {
	    // Need to prevent the menu from not showing sometimes
	    document__default['default'].querySelectorAll('.vjs-sm-top-level').forEach(function (element) {
	      element.classList.remove('vjs-hidden');
	    });
	    var elements = document__default['default'].getElementsByClassName(className);

	    while (elements.length > 0) {
	      elements[0].parentNode.removeChild(elements[0]);
	    }
	  };

	  return License;
	}(Plugin); // Define default values for the plugin's `state` object here.


	License.defaultState = {}; // Include the version number.

	License.VERSION = version; // Register the plugin with video.js.

	videojs__default['default'].registerPlugin('license', License);

	return License;

})));
