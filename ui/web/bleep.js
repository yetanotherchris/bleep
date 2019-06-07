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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/api/index.js":
/*!**************************!*\
  !*** ./src/api/index.js ***!
  \**************************/
/*! exports provided: API */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "API", function() { return API; });

const TestMessage = "test";
const StatusMessage = "status";
const ChannelDefMessage = "channel_def";
const SequencerDefMessage = "sequencer_def";
const SetSequencerDefMessage = "set_sequencer_def";

class API {

  constructor(app) {
    this.app = app;
    this.socket = null;
  }

  start() {
    var socket = new WebSocket("ws://localhost:10000/ws");
    socket.onopen = ((e) => {
      this.socket = socket;
      this.sendData(ChannelDefMessage, "test");
    }).bind(this)
    socket.onmessage = this.handleMessageReceived.bind(this);
  }

  handleMessageReceived(message) {
    console.log(message)
    var msg = JSON.parse(message.data);
    if (msg.type === ChannelDefMessage) {
      this.app.initialiseChannels(msg.data);
    } else if (msg.type === SequencerDefMessage) {
      this.app.initialiseSequenceTracks(msg.data);
    }
  }
  requestSequencerDef() {
    this.sendData(SequencerDefMessage, null);
  }
  setSequencerDef(def) {
    this.sendData(SetSequencerDefMessage, JSON.stringify(def));
  }

  sendData(type, data) {
    return this.sendJSON({"type": type, "data": data});
  }

  sendJSON(obj) {
    return this.sendMessage(JSON.stringify(obj));
  }

  sendMessage(message) {
    if (this.socket) {
      this.socket.send(message);
    }
  }

}


/***/ }),

/***/ "./src/components/button.js":
/*!**********************************!*\
  !*** ./src/components/button.js ***!
  \**********************************/
/*! exports provided: Button, CloseButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Button", function() { return Button; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CloseButton", function() { return CloseButton; });

class Button {
  constructor(x, y, onClick, label) {
    this.x = x;
    this.y = y;
    this.w = 25;
    this.h = 25;
    this.handleClick = onClick;
    this.label = label;
    this.colour = null;
    if (this.label) {
      this.w = 35;
    }
  }
  draw(app) {
    var w = this.w;
    var h = this.h;
    app.ctx.save();
    app.ctx.fillStyle = app.theme.colours.Button;
    if (this.colour) {
      app.ctx.fillStyle = this.colour;
    }
    app.ctx.strokeStyle = app.theme.colours.OutlineColour;
    app.ctx.lineWidth = 1;
    app.ctx.fillRect(this.x, this.y, w, h);
    app.ctx.strokeRect(this.x, this.y, w, h);
    if (this.label) {
      app.ctx.font = '10px mono';
      app.ctx.fillStyle = app.theme.colours.ButtonText;
      app.ctx.textAlign = "center";
      app.ctx.fillText(this.label, this.x + w / 2, this.y + 15);
    }
    app.ctx.restore();
  }
  handleMouseDown(app, x, y) {
    if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
      return this;
    }
  }
}

class CloseButton extends Button {
}


/***/ }),

/***/ "./src/components/dial.js":
/*!********************************!*\
  !*** ./src/components/dial.js ***!
  \********************************/
/*! exports provided: Dial */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dial", function() { return Dial; });
class Dial {
  constructor(x, y, label, min, max, current) {
    this.x = x;
    this.y = y;
    this.label = label;
    this.radius = 15;
    this.min = min;
    this.max = max;
    this.value = current;
  }
  draw(app) {

    // Draw dial
    app.ctx.fillStyle = app.theme.colours.Dial;
    app.ctx.beginPath();
    app.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    app.ctx.fill();
    app.ctx.closePath();

    var range = this.max - this.min;
    var tau = 2 * Math.PI
    var value = tau - (tau * (this.value - this.min) / range)
    app.ctx.beginPath();
    var dx = Math.sin(value) * this.radius;
    var dy = Math.cos(value) * this.radius;
    app.ctx.strokeStyle = app.theme.colours.DialLine;
    app.ctx.lineWidth = 2;
    app.ctx.moveTo(this.x, this.y);
    app.ctx.lineTo(this.x + dx, this.y + dy);
    app.ctx.stroke();
    app.ctx.lineWidth = 1;

    // Draw label
    app.ctx.fillStyle = app.theme.colours.ModuleText;
    app.ctx.font = '10px mono';
    var centerX = this.x;
    var y = this.y - this.radius - 3;
    app.ctx.textAlign = "center";
    app.ctx.fillText(this.label, centerX, y);

    // Draw value
    app.ctx.fillText(this.value.toFixed(2), centerX, this.y + this.radius + 12);
  }
  handleMouseDown(app, x, y) {
    if (x >= this.x - this.radius && x <= this.x + this.radius && y >= this.y - this.radius && y <= this.radius + this.y) {
      return this;
    }
  }
  handleDrag(app, dx, dy, x, y) {
    dx = x - this.x;
    dy = y - this.y;
    var sin = dy / Math.sqrt(dy * dy + dx * dx)
    var scaledCos = 1.0 - (sin + 1) / 2;
    var range = this.max - this.min;
    this.value = range * scaledCos + this.min;
    app.uploadSequencerDef();
    app.draw();
  }
}



/***/ }),

/***/ "./src/components/editor.js":
/*!**********************************!*\
  !*** ./src/components/editor.js ***!
  \**********************************/
/*! exports provided: Editor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Editor", function() { return Editor; });
/* harmony import */ var _button_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button.js */ "./src/components/button.js");
/* harmony import */ var _module_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module.js */ "./src/components/module.js");



class Editor {
  constructor(app, target, handleClose) {
    this.app = app;
    this.padding = app.theme.padding;
    this.scale = 1.0
    this.showCompile = true;
    this.selected = null;
    this.target = target;
    this.buttons = [
      new _button_js__WEBPACK_IMPORTED_MODULE_0__["CloseButton"](10, 10, handleClose, "X"),
      new _button_js__WEBPACK_IMPORTED_MODULE_0__["Button"](10, 10, this.handleShowCompile.bind(this), "JSON"),
      new _button_js__WEBPACK_IMPORTED_MODULE_0__["Button"](10, 10, this.handleZoomIn.bind(this), "+"),
      new _button_js__WEBPACK_IMPORTED_MODULE_0__["Button"](10, 10, this.handleZoomOut.bind(this), "-"),
      new _button_js__WEBPACK_IMPORTED_MODULE_0__["Button"](10, 10, this.handleUpload.bind(this), ">>>"),
    ];
  }
  handleAddUnit(constructor) {
    var g = constructor()
    this.target.modules.push(new _module_js__WEBPACK_IMPORTED_MODULE_1__["Module"](this.target, Math.random() * 700, Math.random() * 600, g));
    this.app.draw();
  }
  handleZoomIn() {
    this.scale += .1
    this.app.draw();
  }
  handleZoomOut() {
    this.scale -= .1;
    this.app.draw();
  }
  handleDrag(app, dx, dy, x, y) {
    if (this.selected) {
      this.selected.handleDrag(app, dx, dy, x, y);
    }
  }
  handleDrop(app, x, y) {
    if (this.selected) {
      this.selected.handleDrop(app, x - this.padding, y - this.padding);
    }
  }
  handleShowCompile() {
    this.showCompile = !this.showCompile;
    this.app.draw();
  }
  handleUpload() {
    this.app.uploadSequencerDef();
  }
  handleMouseDown(app, x, y) {
    this.selected = null;
    for (var b of this.buttons) {
      var v = b.handleMouseDown(app, x, y);
      if (v) {
        return v;
      }
    }
    for (var m of this.target.modules) {
      var v = m.handleMouseDown(app, x - this.padding, y - this.padding);
      if (v) {
        this.selected = v;
        return this;
      }
    }
  }
  draw(app) {
    var w = app.canvas.width - 2 * this.padding;
    var h = app.canvas.height - 2 * this.padding;
    this.buttons[0].x = w - this.buttons[0].w + this.padding;
    this.buttons[0].y = this.padding;
    this.buttons[1].x = w - this.buttons[1].w + this.padding;
    this.buttons[1].y = this.padding + 25;
    this.buttons[2].x = w - this.buttons[2].w + this.padding;
    this.buttons[2].y = this.padding + 50;
    this.buttons[3].x = w - this.buttons[3].w + this.padding;
    this.buttons[3].y = this.padding + 75;
    this.buttons[4].x = w - this.buttons[4].w + this.padding;
    this.buttons[4].y = this.padding + 100;
    app.ctx.save();
    app.ctx.lineWidth = 1;
    
    // Draw the background
    app.ctx.fillStyle = app.theme.colours.InstrumentEditorBackground;
    app.ctx.strokeStyle = app.theme.colours.OutlineColour;
    app.ctx.fillRect(this.padding, this.padding, w, h);

    // Draw the buttons 
    for (var b of this.buttons) {
      b.draw(app);
    }

    // Draw the compiled generator JSON
    if (this.showCompile) {
      var txt = JSON.stringify(this.target.compile(), null, 2);
      var lineNr = 0;
      app.ctx.fillStyle = app.theme.colours.ModuleText;
      app.ctx.textAlign = "start";
      for (var line of txt.split("\n")) {
        app.ctx.fillText(line, w - 300, 90 + lineNr * 12);
        lineNr++;
      }
    }

    // Draw the modules
    for (var m of this.target.modules) {
      app.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset translate
      app.ctx.scale(this.scale, this.scale);
      app.ctx.translate(this.padding, this.padding);
      m.draw(app);
    }
    app.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset translate
    app.ctx.scale(this.scale, this.scale);


    app.ctx.fillStyle = app.theme.colours.Patch;
    app.ctx.strokeStyle = app.theme.colours.Patch;

    // Draw the patches
    for (var p of this.target.patches) {
      var fromMod = this.target.modules[p.from];
      var toMod = this.target.modules[p.to];
      var fromSocket = p.getFromSocket(fromMod);
      var toSocket = p.getToSocket(toMod);
      var fromX = this.padding + fromMod.x + fromSocket.x;
      var fromY = this.padding + fromMod.y + fromSocket.y;
      var toX = this.padding + toMod.x + toSocket.x;
      var toY = this.padding + toMod.y + toSocket.y;
      var pointOffset = 70;

      app.ctx.strokeStyle = p.getColor(app.theme);
      app.ctx.lineWidth = 4;
      app.ctx.beginPath();
      app.ctx.moveTo(fromX, fromY);
      app.ctx.bezierCurveTo(
        fromX, 
        fromY + pointOffset, 
        toX, 
        toY + pointOffset, 
        toX, 
        toY);
      app.ctx.stroke();
    }

    app.ctx.restore();
  }
}


/***/ }),

/***/ "./src/components/index.js":
/*!*********************************!*\
  !*** ./src/components/index.js ***!
  \*********************************/
/*! exports provided: Dial, Socket, InputSocket, OutputSocket, Button, CloseButton, Patch, Module, ModuleUnit, Editor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dial_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dial.js */ "./src/components/dial.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Dial", function() { return _dial_js__WEBPACK_IMPORTED_MODULE_0__["Dial"]; });

/* harmony import */ var _socket_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./socket.js */ "./src/components/socket.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Socket", function() { return _socket_js__WEBPACK_IMPORTED_MODULE_1__["Socket"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InputSocket", function() { return _socket_js__WEBPACK_IMPORTED_MODULE_1__["InputSocket"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OutputSocket", function() { return _socket_js__WEBPACK_IMPORTED_MODULE_1__["OutputSocket"]; });

/* harmony import */ var _button_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./button.js */ "./src/components/button.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Button", function() { return _button_js__WEBPACK_IMPORTED_MODULE_2__["Button"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CloseButton", function() { return _button_js__WEBPACK_IMPORTED_MODULE_2__["CloseButton"]; });

/* harmony import */ var _patch_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./patch.js */ "./src/components/patch.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Patch", function() { return _patch_js__WEBPACK_IMPORTED_MODULE_3__["Patch"]; });

/* harmony import */ var _module_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./module.js */ "./src/components/module.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Module", function() { return _module_js__WEBPACK_IMPORTED_MODULE_4__["Module"]; });

/* harmony import */ var _module_unit_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./module_unit.js */ "./src/components/module_unit.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ModuleUnit", function() { return _module_unit_js__WEBPACK_IMPORTED_MODULE_5__["ModuleUnit"]; });

/* harmony import */ var _editor_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./editor.js */ "./src/components/editor.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Editor", function() { return _editor_js__WEBPACK_IMPORTED_MODULE_6__["Editor"]; });










/***/ }),

/***/ "./src/components/module.js":
/*!**********************************!*\
  !*** ./src/components/module.js ***!
  \**********************************/
/*! exports provided: Module */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Module", function() { return Module; });
/* harmony import */ var _socket_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./socket.js */ "./src/components/socket.js");
/* harmony import */ var _dial_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dial.js */ "./src/components/dial.js");



class Module {
  constructor(target, x, y, unit) {
    this.target = target;
    this.x = x;
    this.y = y;
    this.unit = unit;
    this.selected = null;
  }
  draw(app) {
    app.ctx.translate(this.x, this.y);
    this.unit.draw(app);
  }
  handleMouseDown(app, x, y) {
    this.selected = null;
    var v = this.unit.handleMouseDown(app, x - this.x, y - this.y);
    if (!v) {
      return false;
    }
    this.selected = v;
    return this;
  }
  handleDrag(app, dx, dy, x, y) {
    var v = this.selected;
    if (v instanceof _socket_js__WEBPACK_IMPORTED_MODULE_0__["Socket"]) {
      v.handleDrag(app, dx, dy, x, y);
    } else if (v instanceof _dial_js__WEBPACK_IMPORTED_MODULE_1__["Dial"]) {
      v.handleDrag(app, dx, dy, x - this.x, y - this.y);
    } else {
      this.x += dx;
      this.y += dy;
    }
  }
  handleDrop(app, x, y) {
    var v = this.selected;
    if (v instanceof _socket_js__WEBPACK_IMPORTED_MODULE_0__["Socket"]) {
      for (var module of this.target.modules) {
        for (var key of Object.keys(module.unit.sockets)) {
          var s = module.unit.sockets[key];
          var sx = x - module.x;
          var sy = y - module.y;
          var result = s.handleMouseDown(app, sx, sy);
          if (result) {
            this.target.addPatch(this, module, v.label, result.label);
            app.draw();
            return;
          }
        }
      }
    }
    this.selected = null;
  }
}


/***/ }),

/***/ "./src/components/module_unit.js":
/*!***************************************!*\
  !*** ./src/components/module_unit.js ***!
  \***************************************/
/*! exports provided: ModuleUnit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModuleUnit", function() { return ModuleUnit; });
class ModuleUnit {
  constructor(type) {
    this.type = type;
    this.w = 150;
    this.h = 150;
    this.sockets = {};
    this.dials = {};
    this.background = "";
  }
  draw(app) {
    var w = this.w;
    var h = this.h;
    app.ctx.fillStyle = app.theme.colours[this.background];
    app.ctx.strokeStyle = app.theme.colours.ModuleOutline;
    app.ctx.fillRect(0, 0, w, h);
    app.ctx.strokeRect(0, 0, w, h);
    app.ctx.fillStyle = app.theme.colours.ModuleText;
    app.ctx.font = '14px mono';
    app.ctx.textAlign = "center";
    app.ctx.fillText(this.type, w / 2, 14);
    for (var o of Object.keys(this.sockets)) {
      this.sockets[o].draw(app);
    }
    for (var o of Object.keys(this.dials)) {
      this.dials[o].draw(app);
    }
  }
  handleMouseDown(app, x, y) {
    for (var o of Object.keys(this.sockets)) {
      var v = this.sockets[o].handleMouseDown(app, x, y);
      if (v) {
        return v;
      }
    }
    for (var o of Object.keys(this.dials)) {
      var v = this.dials[o].handleMouseDown(app, x, y);
      if (v) {
        return v;
      }
    }
    var path = new Path2D();
    path.rect(0, 0, this.w, this.h);
    if (app.ctx.isPointInPath(path, x, y)) {
      return this;
    }
  }

  // connections is a {} mapping this unit's input socket IDs 
  // to a list of connected units.
  //
  compile(connections) {
    return null;
  }
}



/***/ }),

/***/ "./src/components/patch.js":
/*!*********************************!*\
  !*** ./src/components/patch.js ***!
  \*********************************/
/*! exports provided: Patch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Patch", function() { return Patch; });
class Patch {
  constructor(fromModule, toModule, fromSocket, toSocket, type) {
    this.from = fromModule;
    this.to = toModule;
    this.fromSocket = fromSocket;
    this.toSocket = toSocket;
    if (!type) {
      throw 'Missing type in Patch';
    }
    this.type = type;
  }
  getFromSocket(mod) {
    return mod.unit.sockets[this.fromSocket];
  }
  getToSocket(mod) {
    return mod.unit.sockets[this.toSocket];
  }
  isIsomorphic(p) {
    return (this.from == p.from 
        && this.to == p.to 
        && this.fromSocket == p.fromSocket 
        && this.toSocket == p.toSocket) 
      || 
      (this.to == p.from
        && this.from == p.to 
        && this.fromSocket == p.toSocket 
        && this.toSocket == p.fromSocket);
  }
  doesPatchConnectTo(module, socket) {
    return (this.from == module && this.fromSocket == socket) ||
      (this.to == module && this.toSocket == socket)
  }
  connectsTo(module, socket) {
    if (this.from == module && this.fromSocket == socket) {
      return {module: this.to, socket: this.toSocket}
    }
    return {module: this.from, socket: this.fromSocket}
  }
  getColor(theme) {
    if (theme.colours.Patches[this.type]) {
      return theme.colours.Patches[this.type];
    }
    return theme.colours.Patch;
  }
}



/***/ }),

/***/ "./src/components/socket.js":
/*!**********************************!*\
  !*** ./src/components/socket.js ***!
  \**********************************/
/*! exports provided: Socket, InputSocket, OutputSocket */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Socket", function() { return Socket; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InputSocket", function() { return InputSocket; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutputSocket", function() { return OutputSocket; });
class Socket {
  constructor(x, y, label, type, isInput) {
    this.x = x;
    this.y = y;
    this.label = label;
    this.radius = 8;
    this.type = type;
    this.isInput = isInput;
    if (!type) {
      throw 'Missing Socket type for Socket with label: ' + label;
    }
    if (isInput === undefined) {
      throw 'Missing Socket isInput for Socket with label: ' + label;
    }
  }
  draw(app) {
    // Draw Octagon
    var octa_short = 0.29289321881345247559915563789515;;
    var octa_long = 1 - octa_short;
    var octagon = {
      size: 2 * this.radius + 4,
    }
    var x = this.x - this.radius - 2;
    var y = this.y - this.radius - 2;
    app.ctx.beginPath();
    app.ctx.fillStyle = app.theme.colours.SocketBackground;
    if (app.theme.colours.Sockets[this.type]) { 
      app.ctx.fillStyle = app.theme.colours.Sockets[this.type];
    }
    app.ctx.strokeStyle = app.theme.colours.SocketOutline;
    app.ctx.moveTo(x + octagon.size * octa_short, y);
    app.ctx.lineTo(x, y + octagon.size * octa_short);
    app.ctx.lineTo(x, y + octagon.size * octa_long);
    app.ctx.lineTo(x + octagon.size * octa_short, y + octagon.size);
    app.ctx.lineTo(x + octagon.size * octa_long, y + octagon.size);
    app.ctx.lineTo(x + octagon.size, y +  octagon.size * octa_long);
    app.ctx.lineTo(x + octagon.size, y + octagon.size * octa_short);
    app.ctx.lineTo(x + octagon.size * octa_long, y);
    app.ctx.lineTo(x + octagon.size * octa_short, y);
    app.ctx.fill();
    app.ctx.stroke();

    // Draw hole
    app.ctx.strokeStyle = app.theme.colours.SocketInside;
    app.ctx.fillStyle = app.theme.colours.SocketInside;
    app.ctx.beginPath();
    app.ctx.arc(this.x, this.y, this.radius - 2, 0, 2 * Math.PI);
    app.ctx.fill();

    // Draw label
    app.ctx.fillStyle = app.theme.colours.ModuleText;
    app.ctx.font = '10px mono';
    var centerX = this.x;
    app.ctx.textAlign = "center";
    app.ctx.fillText(this.label, centerX, y - 3);
  }
  handleMouseDown(app, x, y) {
    if (x >= this.x - this.radius && x <= this.x + this.radius + 4 && y >= this.y - this.radius && y <= this.y + this.radius + 4) {
      return this;
    }
  }
  handleDrag(app, dx, dy, x, y) {
    if (this.onDrag) {
      this.onDrag(app, this, dx, dy, x, y);
    }
  }
}

class InputSocket extends Socket {
  constructor(x, y, label, type) {
    super(x, y, label, type, true);
  }
}

class OutputSocket extends Socket {
  constructor(x, y, label, type) {
    super(x, y, label, type, false);
  }
}


/***/ }),

/***/ "./src/instrument_editor/index.js":
/*!****************************************!*\
  !*** ./src/instrument_editor/index.js ***!
  \****************************************/
/*! exports provided: Instrument, InstrumentEditor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InstrumentEditor", function() { return InstrumentEditor; });
/* harmony import */ var _instrument_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instrument.js */ "./src/instrument_editor/instrument.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Instrument", function() { return _instrument_js__WEBPACK_IMPORTED_MODULE_0__["Instrument"]; });

/* harmony import */ var _module_units__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module_units */ "./src/instrument_editor/module_units/index.js");
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/ */ "./src/components/index.js");





class InstrumentEditor extends _components___WEBPACK_IMPORTED_MODULE_2__["Editor"] {
  constructor(app, instrument, handleClose) {
    super(app, instrument, handleClose);
    if (!instrument) {
      instrument = new _instrument_js__WEBPACK_IMPORTED_MODULE_0__["Instrument"]([], []);
      var modules = [
        new _components___WEBPACK_IMPORTED_MODULE_2__["Module"](instrument, 30, 30, new _module_units__WEBPACK_IMPORTED_MODULE_1__["ChannelInput"]('input')), 
        new _components___WEBPACK_IMPORTED_MODULE_2__["Module"](instrument, 800, 30, new _module_units__WEBPACK_IMPORTED_MODULE_1__["ChannelOutput"]('output')),
      ];
      instrument.modules = modules;
    }
    this.target = instrument;
    var buttonDefs = [
        {label: "SIN", onclick: () => this.handleAddGenerator("sine")},
        {label: "SQU", onclick: () => this.handleAddGenerator("square")},
        {label: "SAW", onclick: () => this.handleAddGenerator("saw")},
        {label: "TRI", onclick: () => this.handleAddGenerator("triangle")},
        {label: "PWM", onclick: () => this.handleAddGenerator("pulse")},
        {label: "WAV", onclick: () => this.handleAddGenerator("wav")},
        {label: "NOI", onclick: () => this.handleAddGenerator("white_noise")},
        {label: "GRA", onclick: () => this.handleAddGenerator("grain")},
        {label: "VOC", onclick: () => this.handleAddGenerator("vocoder")},
    ];
    var filterDefs = [
      {label: "LPF", onclick: () => this.handleAddFilter("low pass filter")},
      {label: "HPF", onclick: () => this.handleAddFilter("high pass filter")},
      {label: "DLY", onclick: () => this.handleAddFilter("delay")},
      {label: "FLA", onclick: () => this.handleAddFilter("flanger")},
      {label: "DIS", onclick: () => this.handleAddFilter("distortion")},
      {label: "OVR", onclick: () => this.handleAddFilter("overdrive")},
      {label: "TRE", onclick: () => this.handleAddFilter("tremelo")},
    ];
    var derivedDefs = [
      {label: "TRA", onclick: () => this.handleAddUnit(() => new _module_units__WEBPACK_IMPORTED_MODULE_1__["Transpose"]("transpose"))},
      {label: "PAN", onclick: () => this.handleAddUnit(() => new _module_units__WEBPACK_IMPORTED_MODULE_1__["Panning"]("panning"))},
    ];
    var x = 10;
    for (var def of buttonDefs) {
      var b = new _components___WEBPACK_IMPORTED_MODULE_2__["Button"](x, 0, def.onclick.bind(this), def.label);
      b.colour = app.theme.colours.ModuleGenerator;
      this.buttons.push(b);
      x += b.w + 3;
    }
    for (var def of filterDefs) {
      var b = new _components___WEBPACK_IMPORTED_MODULE_2__["Button"](x, 0, def.onclick.bind(this), def.label);
      b.colour = app.theme.colours.ModuleFilter;
      this.buttons.push(b);
      x += b.w + 3;
    }
    for (var def of derivedDefs) {
      var b = new _components___WEBPACK_IMPORTED_MODULE_2__["Button"](x, 0, def.onclick.bind(this), def.label);
      b.colour = app.theme.colours.ModuleDerived;
      this.buttons.push(b);
      x += b.w + 3;
    }
  }
  handleAddFilter(type) {
    return this.handleAddUnit(() => new _module_units__WEBPACK_IMPORTED_MODULE_1__["Filter"](type));
  }
  handleAddGenerator(type) {
    return this.handleAddUnit(() => new _module_units__WEBPACK_IMPORTED_MODULE_1__["SampleGenerator"](type));
  }
}



/***/ }),

/***/ "./src/instrument_editor/instrument.js":
/*!*********************************************!*\
  !*** ./src/instrument_editor/instrument.js ***!
  \*********************************************/
/*! exports provided: Instrument */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Instrument", function() { return Instrument; });
/* harmony import */ var _module_units__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module_units */ "./src/instrument_editor/module_units/index.js");
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/ */ "./src/model/index.js");




class Instrument extends _model___WEBPACK_IMPORTED_MODULE_2__["Patchable"] {
  constructor(modules, patches) {
    super(modules, patches);
    this.name = null;
    this.instrumentBankIndex = null;
    this.modules = [];
    this.patches = [];
  }
  loadFromDefinition(instrDef) {
    this.modules = [
      new _components___WEBPACK_IMPORTED_MODULE_1__["Module"](this, 10, 40, new _module_units__WEBPACK_IMPORTED_MODULE_0__["ChannelInput"]('input')), 
      new _components___WEBPACK_IMPORTED_MODULE_1__["Module"](this, 700, 40, new _module_units__WEBPACK_IMPORTED_MODULE_0__["ChannelOutput"]('output')),
    ];
    this.patches = [];
    if (instrDef.name) {
      this.name = instrDef.name;
    }
    if (instrDef.index !== undefined) {
      this.instrumentBankIndex = instrDef.index;
    }
    var ix = this.loadGenerator(instrDef, 0, 1);
    this.patchInput(ix);
  }
  patchInput(ix) {
    if (ix) {
      if (Array.isArray(ix)) {
        for (var i of ix) {
          this.patchInput(i);
        }
        return;
      }
      var s = this.modules[ix].unit.sockets;
      var candidate = null;
      if (s) {
        for (var key of Object.keys(s)) {
          if (s[key].type === _model___WEBPACK_IMPORTED_MODULE_2__["FREQUENCY_TYPE"]) {
            candidate = key;
            break;
          }
        }
        this._addPatch(ix, 0, "FREQ", candidate, _model___WEBPACK_IMPORTED_MODULE_2__["FREQUENCY_TYPE"]);
      }
    }
  }
  loadGenerator(instrDef, input, output) {
    if (instrDef["combined"]) {
      var gs = [];
      for (var iDef of instrDef["combined"]) {
        var ix = this.loadGenerator(iDef, input, output);
        if (ix) {
          gs.push(ix);
        }
      }
      return gs;
    } else if (instrDef["panning"]) {
      var g = new _module_units__WEBPACK_IMPORTED_MODULE_0__["Panning"]("panning");
      var tIx = this.addModule(g);
      var ix = this.loadGenerator(instrDef["panning"], input, output);
      this._addPatch(tIx, ix, "PAN", "PAN", _model___WEBPACK_IMPORTED_MODULE_2__["PANNING_TYPE"]);
      this._addPatch(input, tIx, "FREQ", "FREQ", _model___WEBPACK_IMPORTED_MODULE_2__["FREQUENCY_TYPE"]);
      return ix;
    } else if (instrDef["transpose"]) {
      var g = new _module_units__WEBPACK_IMPORTED_MODULE_0__["Transpose"]("transpose");
      g.dials["semitones"].value = instrDef["transpose"]["semitones"] || 0;
      var tIx = this.addModule(g);
      var ix = this.loadGenerator(instrDef["transpose"], tIx, output);
      this._addPatch(tIx, ix, "FREQ", "FREQ", _model___WEBPACK_IMPORTED_MODULE_2__["FREQUENCY_TYPE"]);
      this._addPatch(input, tIx, "FREQ", "FREQ IN", _model___WEBPACK_IMPORTED_MODULE_2__["FREQUENCY_TYPE"]);
      return ix;
    } else if (instrDef["sine"] 
      || instrDef["triangle"] 
      || instrDef["square"] 
      || instrDef["sawtooth"] 
      || instrDef["white_noise"]
      || instrDef["pulse"]
      || instrDef["wav"]) {
      var g = new _module_units__WEBPACK_IMPORTED_MODULE_0__["Factory"]().generatorFromDefinition(instrDef);
      var ix = this.addModule(g);
      this._addPatch(ix, output, "OUT", "IN", _model___WEBPACK_IMPORTED_MODULE_2__["AUDIO_TYPE"]);
      return ix;
    } else if (instrDef["vocoder"]) {
      var source = new _module_units__WEBPACK_IMPORTED_MODULE_0__["Factory"]().generatorFromDefinition(instrDef["vocoder"]["source"])
      var vocoder = new _module_units__WEBPACK_IMPORTED_MODULE_0__["Factory"]().generatorFromDefinition(instrDef["vocoder"]["vocoder"])
      return [];
    } else if (instrDef["filter"]) {
      var g = new _module_units__WEBPACK_IMPORTED_MODULE_0__["Factory"]().filterFromDefinition(instrDef["filter"])
      var tIx = this.addModule(g);
      var ix = this.loadGenerator(instrDef["filter"], input, tIx);
      this._addPatch(tIx, output, "OUT", "IN", _model___WEBPACK_IMPORTED_MODULE_2__["AUDIO_TYPE"]);
      return ix;
    } else {
      console.log(instrDef);
      throw 'Unknown instrument def';
    }
  }
  load(instrDef) {
    var modules = [];
    for (var m of instrDef.modules) {
      var g = null;
      if (m.type == "input") {
        g = new _module_units__WEBPACK_IMPORTED_MODULE_0__["ChannelInput"](m.type);
      } else if (m.type == "output") {
        g = new _module_units__WEBPACK_IMPORTED_MODULE_0__["ChannelOutput"](m.type);
      } else if (m.type == "low pass filter") {
        g = new _module_units__WEBPACK_IMPORTED_MODULE_0__["Filter"](m.type);
      } else if (m.type == "sine" || m.type == "triangle") {
        g = new _module_units__WEBPACK_IMPORTED_MODULE_0__["SampleGenerator"](m.type);
      }
      if (g) {
        var mod = new _components___WEBPACK_IMPORTED_MODULE_1__["Module"](this, m.x, m.y, g);
        modules.push(mod);
      }
    }
    var patches = [];
    for (var p of instrDef.patches) {
      this._addPatch(p.from_module, p.to_module, p.from_socket, p.to_socket);
    }
    this.modules = modules;
    this.patches = patches;
  }

  compile() {
    var output = null;
    for (var i = 0; i < this.modules.length; i++) {
      var m = this.modules[i];
      if (m.unit.type == "output") {
        output = i;
      }
    }
    if (!output) {
      return null;
    }

    var queue = [output];
    var seen = {};
    var dependencies = [];
    while (queue.length > 0) {
      var q = queue[0];
      var queue = queue.splice(1);
      if (seen[q]) {
        continue
      }
      dependencies.push(q);
      for (var p of this.patches) {
        if (!this.modules[q]) {
          console.log("Big troubles: trying to reach non existent module:", ix);
          continue
        }
        var modSockets = this.modules[q].unit.sockets;
        if (p.to === q && modSockets[p.toSocket] && modSockets[p.toSocket].isInput) {
          if (!seen[p.from]) {
            queue.push(p.from);
          }
        } else if (p.from === q && modSockets[p.fromSocket] && modSockets[p.fromSocket].isInput) {
          if (!seen[p.to]) {
            queue.push(p.to);
          }
        }
      }
      seen[q] = true;
    }
    var generators = {};
    for (var i = dependencies.length - 1; i >= 0; i--) {
      var ix = dependencies[i];
      if (!this.modules[ix]) {
        console.log("Big troubles: trying to reach non existent module:", ix);
        continue
      }
      var unit = this.modules[ix].unit;
      var g = null;
      if (unit.type == "input") {
        g = null;
      } else if (unit.type == "wav") {
        g = unit.compile();
      } else if (unit.type == "triangle" 
        || unit.type == "sine" 
        || unit.type == "saw" 
        || unit.type == "square" 
        || unit.type == "white_noise") {
        g = {};
        g[unit.type] = {
          "gain": unit.dials["gain"].value,
          "panning": unit.dials["panning"].value,
          "attack": unit.dials["attack"].value,
          "decay": unit.dials["decay"].value,
          "sustain": unit.dials["sustain"].value,
          "release": unit.dials["release"].value,
        };
        var pitchFound = false;
        for (var p of this.patches) {
          if (p.doesPatchConnectTo(ix, "FREQ")) {
            pitchFound = true;
            var pg = generators[p.connectsTo(ix, "FREQ").module];
            if (pg) {
              g[unit.type]["auto_pitch"] = pg;
            }
          }
        }
        if (!pitchFound) {
          g[unit.type]["pitch"] = unit.dials["pitch"].value;
        }
      } else if (unit.type == "low pass filter") {
        g = {};
        g["filter"] = {"lpf": {"cutoff": unit.dials["cutoff"].value}}
        var on = this.compileGenerators(generators, ix, "IN");
        Object.keys(on).map((k) => {
          g["filter"][k] = on[k];
        });
      } else if (unit.type == "high pass filter") {
        g = {};
        g["filter"] = {"hpf": {"cutoff": unit.dials["cutoff"].value}}
        var on = this.compileGenerators(generators, ix, "IN");
        Object.keys(on).map((k) => {
          g["filter"][k] = on[k];
        });
      } else if (unit.type == "transpose") {
        g = {"transpose": {
          "semitones": unit.dials["semitones"].value,
        }}
        var on = this.compileGenerators(generators, ix, "FREQ IN");
        if (on) {
          Object.keys(on).map((k) => {
            g["transpose"][k] = on[k];
          });
        }
      } else if (unit.type == "panning") {
        g = {"panning": {}}
        var on = this.compileGenerators(generators, ix, "FREQ IN");
        if (on) {
          Object.keys(on).map((k) => {
            g["panning"][k] = on[k];
          });
        }
      } else if (unit.type == "output") {
        var result = this.compileGenerators(generators, ix, "IN");
        if (this.name) {
          result.name = this.name
        }
        if (this.instrumentBankIndex) {
          result.index = this.instrumentBankIndex;
        }
        return result;
      }
      generators[ix] = g;
    }
    return null;
  }

  compileGenerators(generators, ix, input) {
    var gs = [];
    for (var p of this.patches) {
      if (p.doesPatchConnectTo(ix, input)) {
        gs.push(generators[p.connectsTo(ix, input).module])
      }
    }
    if (gs.length === 0) {
      return null;
    } else if (gs.length === 1) {
      return gs[0];
    } else {
      return {"combined": gs}
    }
  }
}



/***/ }),

/***/ "./src/instrument_editor/module_units/channel_input.js":
/*!*************************************************************!*\
  !*** ./src/instrument_editor/module_units/channel_input.js ***!
  \*************************************************************/
/*! exports provided: ChannelInput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChannelInput", function() { return ChannelInput; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class ChannelInput extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(type) {
    super(type);
    this.sockets = {
      "FREQ": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "FREQ", _model___WEBPACK_IMPORTED_MODULE_1__["FREQUENCY_TYPE"]),
    }
    this.background = 'ModuleOutput';
  }
}


/***/ }),

/***/ "./src/instrument_editor/module_units/channel_output.js":
/*!**************************************************************!*\
  !*** ./src/instrument_editor/module_units/channel_output.js ***!
  \**************************************************************/
/*! exports provided: ChannelOutput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChannelOutput", function() { return ChannelOutput; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");




class ChannelOutput extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(type) {
    super(type);
    this.sockets = {
      "IN": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "IN", _model___WEBPACK_IMPORTED_MODULE_1__["AUDIO_TYPE"]),
    }
    this.background = 'ModuleOutput';
  }
}



/***/ }),

/***/ "./src/instrument_editor/module_units/factory.js":
/*!*******************************************************!*\
  !*** ./src/instrument_editor/module_units/factory.js ***!
  \*******************************************************/
/*! exports provided: Factory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Factory", function() { return Factory; });
/* harmony import */ var _sample_generator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sample_generator.js */ "./src/instrument_editor/module_units/sample_generator.js");
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filter.js */ "./src/instrument_editor/module_units/filter.js");




class Factory {

  generatorFromDefinition(instrDef) {

    if (instrDef["sine"] 
      || instrDef["triangle"] 
      || instrDef["square"] 
      || instrDef["sawtooth"] 
      || instrDef["white_noise"]) {
      var typ = "triangle";
      var instr = null;
      if (instrDef["triangle"]) {
        instr = instrDef["triangle"];
      } else if (instrDef["sine"]) {
        instr = instrDef["sine"];
        typ = "sine";
      } else if (instrDef["square"]) {
        instr = instrDef["square"];
        typ = "square";
      } else if (instrDef["sawtooth"]) {
        instr = instrDef["sawtooth"];
        typ = "saw";
      } else if (instrDef["white_noise"]) {
        instr = instrDef["white_noise"];
        typ = "white_noise";
      }
      var g = new _sample_generator_js__WEBPACK_IMPORTED_MODULE_0__["SampleGenerator"](typ)
      g.dials["attack"].value = instr["attack"] || 0.0;
      g.dials["decay"].value = instr["decay"] || 0.0;
      g.dials["sustain"].value = instr["sustain"] || 0.0;
      g.dials["release"].value = instr["release"] || 0.0;
      g.dials["gain"].value = instr["gain"] || 1.0;
      return g;
    } else if (instrDef["wav"]) {
      var g = new _sample_generator_js__WEBPACK_IMPORTED_MODULE_0__["WavGenerator"]();
      var instr = instrDef["wav"];
      g.file = instr["file"] || "";
      g.is_pitched = instr["pitched"] || false;
      g.base_pitch = instr["base_pitch"] || 440.0;
      g.dials["attack"].value = instr["attack"] || 0.0;
      g.dials["decay"].value = instr["decay"] || 0.0;
      g.dials["sustain"].value = instr["sustain"] || 0.0;
      g.dials["release"].value = instr["release"] || 0.0;
      g.dials["gain"].value = instr["gain"] || 1.0;
      return g;
    } else if (instrDef["pulse"]) {
      var g = new _sample_generator_js__WEBPACK_IMPORTED_MODULE_0__["SampleGenerator"]("pulse");
      var instr = instrDef["pulse"];
      g.dials["attack"].value = instr["attack"] || 0.0;
      g.dials["decay"].value = instr["decay"] || 0.0;
      g.dials["sustain"].value = instr["sustain"] || 0.0;
      g.dials["release"].value = instr["release"] || 0.0;
      g.dials["gain"].value = instr["gain"] || 1.0;
      return g;
    }
  }

  filterFromDefinition(filterDef) {
    if (filterDef["lpf"]) {
      var g = new _filter_js__WEBPACK_IMPORTED_MODULE_1__["Filter"]("low pass filter")
      g.dials["cutoff"].value = filterDef["lpf"]["cutoff"] || 5000;
      return g;
    } else if (filterDef["distortion"]) {
      var g = new _filter_js__WEBPACK_IMPORTED_MODULE_1__["Filter"]("distortion")
      return g;
    } else if (filterDef["overdrive"]) {
      var g = new _filter_js__WEBPACK_IMPORTED_MODULE_1__["Filter"]("overdrive")
      return g;
    } else if (filterDef["flanger"]) {
      var g = new _filter_js__WEBPACK_IMPORTED_MODULE_1__["Filter"]("flanger")
      return g;
    } else if (filterDef["average"]) {
      var g = new _filter_js__WEBPACK_IMPORTED_MODULE_1__["Filter"]("average")
      return g;
    } else {
      console.log(filterDef);
      throw 'Unknown filter def';
    }
  }
}


/***/ }),

/***/ "./src/instrument_editor/module_units/filter.js":
/*!******************************************************!*\
  !*** ./src/instrument_editor/module_units/filter.js ***!
  \******************************************************/
/*! exports provided: Filter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Filter", function() { return Filter; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class Filter extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(type) {
    super(type);
    this.sockets = {
      "IN": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "IN", _model___WEBPACK_IMPORTED_MODULE_1__["AUDIO_TYPE"]),
      "OUT": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "OUT", _model___WEBPACK_IMPORTED_MODULE_1__["AUDIO_TYPE"]),
    }
    this.background = 'ModuleFilter';
    this.dials = { }

    if (type === "low pass filter" || type === "high pass filter") {
      this.w = 150;
      this.dials["cutoff"] = new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 59, "CUTOFF", 1.0, 22000.0, 5000.0);
    } else if (type === "delay") {
      this.w = 170;
      this.dials["time"] = new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 59, "TIME", 0.00001, 4.0, 1.0);
      this.dials["factor"] = new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](79, 59, "FACTOR", 0.0, 2.0, 1.0);
      this.dials["feedback"] = new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](129, 59, "FEEDBACK", 0.0, 2.0, 0.0);
    }
  }
}


/***/ }),

/***/ "./src/instrument_editor/module_units/index.js":
/*!*****************************************************!*\
  !*** ./src/instrument_editor/module_units/index.js ***!
  \*****************************************************/
/*! exports provided: ChannelInput, ChannelOutput, Filter, SampleGenerator, Transpose, Panning, Factory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _channel_input_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./channel_input.js */ "./src/instrument_editor/module_units/channel_input.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ChannelInput", function() { return _channel_input_js__WEBPACK_IMPORTED_MODULE_0__["ChannelInput"]; });

/* harmony import */ var _channel_output_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./channel_output.js */ "./src/instrument_editor/module_units/channel_output.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ChannelOutput", function() { return _channel_output_js__WEBPACK_IMPORTED_MODULE_1__["ChannelOutput"]; });

/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filter.js */ "./src/instrument_editor/module_units/filter.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Filter", function() { return _filter_js__WEBPACK_IMPORTED_MODULE_2__["Filter"]; });

/* harmony import */ var _sample_generator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sample_generator.js */ "./src/instrument_editor/module_units/sample_generator.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SampleGenerator", function() { return _sample_generator_js__WEBPACK_IMPORTED_MODULE_3__["SampleGenerator"]; });

/* harmony import */ var _transpose_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./transpose.js */ "./src/instrument_editor/module_units/transpose.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Transpose", function() { return _transpose_js__WEBPACK_IMPORTED_MODULE_4__["Transpose"]; });

/* harmony import */ var _panning_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./panning.js */ "./src/instrument_editor/module_units/panning.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Panning", function() { return _panning_js__WEBPACK_IMPORTED_MODULE_5__["Panning"]; });

/* harmony import */ var _factory_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./factory.js */ "./src/instrument_editor/module_units/factory.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Factory", function() { return _factory_js__WEBPACK_IMPORTED_MODULE_6__["Factory"]; });










/***/ }),

/***/ "./src/instrument_editor/module_units/panning.js":
/*!*******************************************************!*\
  !*** ./src/instrument_editor/module_units/panning.js ***!
  \*******************************************************/
/*! exports provided: Panning */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Panning", function() { return Panning; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class Panning extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(type) {
    super(type);
    this.background = 'ModuleDerived';
    this.w = 120;
    this.h = 150;
    this.sockets = {
      "FREQ": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "FREQ", _model___WEBPACK_IMPORTED_MODULE_1__["FREQUENCY_TYPE"]),
      "PAN": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "PAN", _model___WEBPACK_IMPORTED_MODULE_1__["PANNING_TYPE"]),
    }
    this.dials = {
    }
  }
}


/***/ }),

/***/ "./src/instrument_editor/module_units/sample_generator.js":
/*!****************************************************************!*\
  !*** ./src/instrument_editor/module_units/sample_generator.js ***!
  \****************************************************************/
/*! exports provided: SampleGenerator, WavGenerator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SampleGenerator", function() { return SampleGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WavGenerator", function() { return WavGenerator; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class SampleGenerator extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(type) {
    super(type);
    this.background = 'ModuleGenerator';
    this.w = 220;
    this.h = 250;
    this.sockets = {
      "FREQ": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "FREQ", _model___WEBPACK_IMPORTED_MODULE_1__["FREQUENCY_TYPE"]),
      "PAN": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](79, this.h - 29, "PAN", _model___WEBPACK_IMPORTED_MODULE_1__["PANNING_TYPE"]),
      "OUT": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "OUT", _model___WEBPACK_IMPORTED_MODULE_1__["AUDIO_TYPE"]),
    }
    this.dials = {
      "pitch": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 49, "FREQ", 0.0, 22000.0, 0.0),
      "gain": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](79, 49, "GAIN", 0.0, 4.0, 1.0),
      "panning": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](129, 49, "PAN", 0.0, 1.0, 0.5),
      "attack": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 120, "ATTACK", 0.0, 10.0, 0.1),
      "decay": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](79, 120, "DECAY", 0.0, 10.0, 0.1),
      "sustain": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](129, 120, "SUSTAIN", 0.0, 1.0, 0.8),
      "release": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](179, 120, "RELEASE", 0.0, 10, 0.1),
    }
  }
}


class WavGenerator extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor() {
    super("wav");
    this.background = 'ModuleGenerator';
    this.w = 220;
    this.h = 250;
    this.file = "";
    this.is_pitched = false;
    this.base_pitch = 440.0;
    // TODO: file input and is_pitched boolean
    this.sockets = {
      "FREQ": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "FREQ", _model___WEBPACK_IMPORTED_MODULE_1__["FREQUENCY_TYPE"]),
      "PAN": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](79, this.h - 29, "PAN", _model___WEBPACK_IMPORTED_MODULE_1__["PANNING_TYPE"]),
      "OUT": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "OUT", _model___WEBPACK_IMPORTED_MODULE_1__["AUDIO_TYPE"]),
    }
    this.dials = {
      "pitch": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 49, "FREQ", 0.0, 22000.0, 0.0),
      "gain": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](79, 49, "GAIN", 0.0, 4.0, 1.0),
      "panning": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](129, 49, "PAN", 0.0, 1.0, 0.5),
      "attack": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 120, "ATTACK", 0.0, 10.0, 0.1),
      "decay": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](79, 120, "DECAY", 0.0, 10.0, 0.1),
      "sustain": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](129, 120, "SUSTAIN", 0.0, 1.0, 0.8),
      "release": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](179, 120, "RELEASE", 0.0, 10, 0.1),
    }
  }

  compile() {
    return {
      "wav": {
        "file": this.file,
        "gain": this.dials["gain"].value,
        "pitched": this.is_pitched,
        "base_pitch": this.base_pitch,
      }
    };
  }
}


/***/ }),

/***/ "./src/instrument_editor/module_units/transpose.js":
/*!*********************************************************!*\
  !*** ./src/instrument_editor/module_units/transpose.js ***!
  \*********************************************************/
/*! exports provided: Transpose */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transpose", function() { return Transpose; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class Transpose extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(type) {
    super(type);
    this.background = 'ModuleDerived';
    this.w = 120;
    this.h = 150;
    this.sockets = {
      "FREQ IN": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "FREQ IN", _model___WEBPACK_IMPORTED_MODULE_1__["FREQUENCY_TYPE"]),
      "FREQ": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "FREQ", _model___WEBPACK_IMPORTED_MODULE_1__["FREQUENCY_TYPE"]),
    }
    this.dials = {
      "semitones": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 49, "SEMITONES", -24, 24, 0.0),
    }
  }
}


/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! exports provided: Bleep */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Bleep", function() { return Bleep; });
/* harmony import */ var _theme_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./theme.js */ "./src/theme.js");
/* harmony import */ var _instrument_editor___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instrument_editor/ */ "./src/instrument_editor/index.js");
/* harmony import */ var _timeline_editor___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./timeline_editor/ */ "./src/timeline_editor/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./model/ */ "./src/model/index.js");
/* harmony import */ var _sequence_editor___WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sequence_editor/ */ "./src/sequence_editor/index.js");
/* harmony import */ var _api___WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./api/ */ "./src/api/index.js");







class RegisterDefinitions {
  constructor(initWith) {
    this.reset(initWith);
  }
  reset(initWith) {
    this.ints = [];
    this.floats = [];
    this.arrays = [];
    for (var i = 0; i < 32; i++) {
      this.ints.push([]);
      this.floats.push([]);
      this.arrays.push([]);
    }
  }
  add(otherRegisterDefinitions) {
    for (var i = 0; i < 32; i++) {
      for (var defSeq of otherRegisterDefinitions.ints[i]) {
        this.ints[i].push(defSeq);
      }
      for (var defSeq of otherRegisterDefinitions.floats[i]) {
        this.floats[i].push(defSeq);
      }
      for (var defSeq of otherRegisterDefinitions.arrays[i]) {
        this.arrays[i].push(defSeq);
      }
    }
  }

}

class Bleep {
  constructor() {
    this.canvas = document.getElementById('main');
    this.theme = new _theme_js__WEBPACK_IMPORTED_MODULE_0__["Theme"]();
    this.ctx = this.canvas.getContext('2d');
    this.canvas.onmousedown = this.handleMouseDown.bind(this)
    this.canvas.onmouseup = this.handleMouseUp.bind(this)
    this.canvas.onmousemove = this.handleMouseMove.bind(this)
    this.selectedElem = null;
    this.startSelectedPos = {};
    this.selectedPos = {};
    this.api = new _api___WEBPACK_IMPORTED_MODULE_5__["API"](this);
    this.api.start();
    this.channels = [];
    this.registers = new RegisterDefinitions();
    this.tracks = [];
    this.openTimelineEditor();
    this.draw();
  }

  // api callback
  initialiseChannels(channelDefs) {
    this.channels = [];
    this.tracks = [];
    var seenPercussionChannel = false;
    for (var def of channelDefs) {
      var ch = new _model___WEBPACK_IMPORTED_MODULE_3__["Channel"](def.channel || 0);
      ch.loadFromDefinition(def);
      this.channels.push(ch);
      this.tracks.push(new _timeline_editor___WEBPACK_IMPORTED_MODULE_2__["ChannelTrack"](ch, this));
      if (ch.channelNr == 9) {
        seenPercussionChannel = true;
      }
      ch.instrument = new _instrument_editor___WEBPACK_IMPORTED_MODULE_1__["Instrument"]();
      if (def.generator) {
        console.log("Loading channel generator", def.generator);
        ch.instrument.loadFromDefinition(def.generator);
      }
      console.log("New channel", def);
    }
    if (!seenPercussionChannel) {
      var ch = new _model___WEBPACK_IMPORTED_MODULE_3__["Channel"](9);
      this.channels.push(ch);
      this.tracks.push(new _timeline_editor___WEBPACK_IMPORTED_MODULE_2__["ChannelTrack"](ch, this));
    }
    this.api.requestSequencerDef();
    this.openTimelineEditor();
  }
  
  // api callback
  initialiseSequenceTracks(sequences) {
    var channelSequences = {};
    for (var ch of this.channels) {
      channelSequences[ch.channelNr] = [];
    }
    this.registers.reset(() => []);
    for (var seq of sequences) {
      var channelsAndRegisters = this.sequenceDefByChannelAndRegister(seq);
      var defs = channelsAndRegisters.channelSequences;
      for (var ch of this.channels) {
        for (var s of defs[ch.channelNr]) {
          channelSequences[ch.channelNr].push(s);
        }
      }
      defs = channelsAndRegisters.registerSequences;
      this.registers.add(defs);
    }
    for (var track of this.tracks) {
      if (track instanceof _timeline_editor___WEBPACK_IMPORTED_MODULE_2__["ChannelTrack"]) {
        track.initialiseSequenceTracks(channelSequences[track.unit.channelNr])
      } else if (track instanceof _timeline_editor___WEBPACK_IMPORTED_MODULE_2__["RegisterTrack"]) {
      }
    }
    for (var i = 0; i < 32; i++) {
      if (this.registers.ints[i].length > 0) {
        var track = new _timeline_editor___WEBPACK_IMPORTED_MODULE_2__["RegisterTrack"](new _model___WEBPACK_IMPORTED_MODULE_3__["Register"](i, "register"), this);
        track.initialiseSequenceTracks(this.registers.ints[i]);
        this.tracks.push(track);
      }
      if (this.registers.floats[i].length > 0) {
        var track = new _timeline_editor___WEBPACK_IMPORTED_MODULE_2__["RegisterTrack"](new _model___WEBPACK_IMPORTED_MODULE_3__["Register"](i, "float_register"), this);
        track.initialiseSequenceTracks(this.registers.floats[i]);
        this.tracks.push(track);
      }
      if (this.registers.arrays[i].length > 0) {
        var track = new _timeline_editor___WEBPACK_IMPORTED_MODULE_2__["RegisterTrack"](new _model___WEBPACK_IMPORTED_MODULE_3__["Register"](i, "array_register"), this);
        track.initialiseSequenceTracks(this.registers.arrays[i]);
        this.tracks.push(track);
      }
    }
    this.openTimelineEditor();
    //this.uploadSequencerDef();
  }

  compile() {
    var result = {
      "bpm": 120,
      "granularity": 64,
      "channels": [],
      "sequences": [],
    };
    for (var track of this.tracks) {
      var trackResult = track.compile();
      if (trackResult.track) {
        result.tracks.push(trackResult.track);
      }
      for (var s of trackResult.sequences) {
        result.sequences.push(s);
      }
    }
    console.log(result);
    return result;
  }

  uploadSequencerDef() {
    this.api.setSequencerDef(this.compile());
  }

  sequenceDefByChannelAndRegister(seq) {
    var channelSequences = {};
    var registerSequences = new RegisterDefinitions();
    var result = {
      channelSequences: channelSequences,
      registerSequences: registerSequences,
    }
    for (var ch of this.channels) {
      channelSequences[ch.channelNr] = [];
    }
    var leaves = ["play_note", "play_notes", "volume",
                  "lpf_cutoff", "hpf_cutoff", "panning"];
    for (var leaf of leaves) {
      if (seq[leaf]) {
        var s = seq[leaf];
        if (channelSequences[s.channel] !== undefined) {
          channelSequences[s.channel].push(seq);
        } else {
          console.log("Missing channel", s);
        }
        return result;;
      }
    }
    if (seq["register"]) {
      if (seq.register.register !== undefined) {
        registerSequences.ints[seq.register.register].push(seq);
        console.log(result);
      }
      return result;;
    } else if (seq["float_register"]) {
      if (seq.float_register.register !== undefined) {
        registerSequences.floats[seq.float_register.register].push(seq);
      }
      return result;;
    } else if (seq["array_register"]) {
      if (seq.array_register.register !== undefined) {
        registerSequences.arrays[seq.array_register.register].push(seq);
      }
      return result;;
    }


    var wrappedSequences = ["repeat", "after", "before", "euclidian", "offset"];
    for (var wrapped of wrappedSequences) {
      if (seq[wrapped]) {
        if (!seq[wrapped].sequence) {
          console.log("Missing sequence", seq);
        }
        var subResult = this.sequenceDefByChannelAndRegister(seq[wrapped].sequence)
        var ch = subResult.channelSequences;
        var merger = (defSeq) => {
          var merged = {};
          for (var key of Object.keys(seq)) {
            merged[key] = seq[key];
          }
          merged.sequence = defSeq;
          return merged;
        }
        for (var channelNr of Object.keys(ch)) {
          var seqs = ch[channelNr];
          if (seqs.length == 0) {
            continue;
          } 
          for (var defSeq of seqs) {
            channelSequences[channelNr].push(merger(defSeq));
          }
        }
        var registers = subResult.registerSequences;
        for (var i = 0; i < 32; i++) {
          for (var defSeq of registers.ints[i]) {
            registerSequences.ints[i].push(merger(defSeq));
          }
          for (var defSeq of registers.floats[i]) {
            registerSequences.floats[i].push(merger(defSeq));
          }
          for (var defSeq of registers.arrays[i]) {
            registerSequences.arrays[i].push(merger(defSeq));
          }
        }
        return result;
      }
    }
    if (seq.combine) {
      for (var seq of seq.combine) {
        var subResult = this.sequenceDefByChannelAndRegister(seq);
        var defs = subResult.channelSequences;
        for (var ch of this.channels) {
          for (var s of defs[ch.channelNr]) {
            channelSequences[ch.channelNr].push(s);
          }
        }
        registerSequences.add(subResult.registerSequences);
      }
    } else {
      console.log("unknown def", seq);
    }
    return result;
  }

  openInstrumentEditor(instr) {
    this.active = new _instrument_editor___WEBPACK_IMPORTED_MODULE_1__["InstrumentEditor"](this, instr, this.openTimelineEditor.bind(this));
    this.draw()
  }
  openTimelineEditor() {
    this.active = new _timeline_editor___WEBPACK_IMPORTED_MODULE_2__["TimelineEditor"](this.tracks, this);
    this.draw();
  }
  openSequenceEditor(sequence, channelNr) {
    this.active = new _sequence_editor___WEBPACK_IMPORTED_MODULE_4__["SequenceEditor"](this, sequence, channelNr, this.openTimelineEditor.bind(this))
    this.draw();
  }
  openRegisterSequenceEditor(sequence, register) {
    this.active = new _sequence_editor___WEBPACK_IMPORTED_MODULE_4__["RegisterSequenceEditor"](this, sequence, register, this.openTimelineEditor.bind(this))
    this.draw();
  }

  handleMouseDown(e) {
    var bound = this.canvas.getBoundingClientRect()
    var x = e.clientX - bound.left; 
    var y = e.clientY - bound.top;
    this.selectedElem = null;
    this.selectedPos = {};
    if (this.active.handleMouseDown) {
      var elem = this.active.handleMouseDown(this, x, y);
      if (elem) {
        this.selectedElem = elem;
        this.startSelectedPos = {x, y};
        this.selectedPos = {x, y};
      }
    }
  }

  handleMouseUp(e) {
    var bound = this.canvas.getBoundingClientRect()
    var x = e.clientX - bound.left; 
    var y = e.clientY - bound.top;
    if (this.selectedElem) {
      var elem = this.selectedElem;
      var sx = this.startSelectedPos.x;
      var sy = this.startSelectedPos.y;
      if (sx >= x -5 && sx <= x + 5 && sy >= y - 5 && sy <= y + 5) {
        if (elem.handleClick) {
          elem.handleClick(this, x, y);
        }
      } else {
        if (elem.handleDrop) {
          elem.handleDrop(this, x, y);
          this.draw();
        }
      }
      this.selectedElem = null;
    }
  }

  handleMouseMove(e) {
    var bound = this.canvas.getBoundingClientRect()
    var x = e.clientX - bound.left; 
    var y = e.clientY - bound.top;
    if (this.selectedElem) {
      var elem = this.selectedElem;
      var sx = this.selectedPos.x;
      var sy = this.selectedPos.y;
      if (sx >= x -5 && sx <= x + 5 && sy >= y - 5 && sy <= y + 5) {
      } else {
        if (elem.handleDrag) {
          elem.handleDrag(this, x - sx, y - sy, x, y, sx, sy);
          this.selectedPos = {x, y};
          this.draw();
        }
      }
    }
  }

  draw() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var bound = this.canvas.getBoundingClientRect()
    var body = document.getElementsByTagName('body')[0];
    this.canvas.width = windowWidth;
    this.canvas.height = windowHeight - bound.top;
    body.style.background = this.theme.colours.Background;
    body.style.color = this.theme.colours.Foreground;
    this.active.draw(this);
  }
}

window.onload = () => {
  try { 
  new Bleep();
  } catch(e) {
    console.log(e);
    alert(e);
  }
}


/***/ }),

/***/ "./src/model/channel.js":
/*!******************************!*\
  !*** ./src/model/channel.js ***!
  \******************************/
/*! exports provided: Channel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Channel", function() { return Channel; });
class Channel {
  constructor(channelNr) {
    this.channelNr = channelNr;
    this.instrument = null;
    this.name = "Untitled " + this.channelNr;
    this.loadFromDefinition({});
  }

  loadFromDefinition(def) {
    this.bank = def.bank || null;
    this.bankIndex = def.instrument || null;
    this.reverb = def.reverb || 0;
    this.reverbTime = def.reverb_time || 0;
    this.reverbFeedback = def.reverb_feedback || 0;
    this.tremelo = def.tremelo || 0;
    this.volume = def.volume || 100;
    this.panning = def.panning || 64;
    this.lpfCutoff = def.lpf_cutoff || 0;
    this.hpfCutoff = def.hpf_cutoff || 0;
    this.grain = def.grain || null;
  }
  getCompileTarget() {
    return this.channelNr;
  }
  compile(sequenceTracks) {
    var channel = {
      "channel": this.channelNr,
      "generator": this.instrument ? this.instrument.compile() : null,
      "bank": this.bank,
      "instrument": this.bankIndex,
      "reverb": this.reverb,
      "reverb_time": this.reverbTime,
      "reverb_feedback": this.reverbFeedback,
      "tremelo": this.tremelo,
      "volume": this.volume,
      "panning": this.panning,
      "lpf_cutoff": this.lpfCutoff,
      "hpf_cutoff": this.hpfCutoff,
      "grain": this.grain,
    };
    var sequences = [];
    for (var tr of sequenceTracks) {
      var trResult = tr.compile();
      if (trResult) {
        sequences.push(trResult);
      }
    }
    return {
      "channel": channel,
      "sequences": sequences,
    };
  }
}


/***/ }),

/***/ "./src/model/index.js":
/*!****************************!*\
  !*** ./src/model/index.js ***!
  \****************************/
/*! exports provided: Patchable, Register, Channel, AUDIO_TYPE, FREQUENCY_TYPE, PANNING_TYPE, CLOCK_TYPE, TRIGGER_TYPE, INT_TYPE, FLOAT_TYPE, INT_ARRAY_TYPE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _patchable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./patchable.js */ "./src/model/patchable.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Patchable", function() { return _patchable_js__WEBPACK_IMPORTED_MODULE_0__["Patchable"]; });

/* harmony import */ var _register_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./register.js */ "./src/model/register.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Register", function() { return _register_js__WEBPACK_IMPORTED_MODULE_1__["Register"]; });

/* harmony import */ var _channel_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./channel.js */ "./src/model/channel.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Channel", function() { return _channel_js__WEBPACK_IMPORTED_MODULE_2__["Channel"]; });

/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types.js */ "./src/model/types.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AUDIO_TYPE", function() { return _types_js__WEBPACK_IMPORTED_MODULE_3__["AUDIO_TYPE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FREQUENCY_TYPE", function() { return _types_js__WEBPACK_IMPORTED_MODULE_3__["FREQUENCY_TYPE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PANNING_TYPE", function() { return _types_js__WEBPACK_IMPORTED_MODULE_3__["PANNING_TYPE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CLOCK_TYPE", function() { return _types_js__WEBPACK_IMPORTED_MODULE_3__["CLOCK_TYPE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TRIGGER_TYPE", function() { return _types_js__WEBPACK_IMPORTED_MODULE_3__["TRIGGER_TYPE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "INT_TYPE", function() { return _types_js__WEBPACK_IMPORTED_MODULE_3__["INT_TYPE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FLOAT_TYPE", function() { return _types_js__WEBPACK_IMPORTED_MODULE_3__["FLOAT_TYPE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "INT_ARRAY_TYPE", function() { return _types_js__WEBPACK_IMPORTED_MODULE_3__["INT_ARRAY_TYPE"]; });







/***/ }),

/***/ "./src/model/patchable.js":
/*!********************************!*\
  !*** ./src/model/patchable.js ***!
  \********************************/
/*! exports provided: Patchable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Patchable", function() { return Patchable; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/ */ "./src/components/index.js");


class Patchable {
  constructor(modules, patches) {
    this.modules = modules;
    this.patches = patches;
  }
  _addPatch(fromModule, toModule, fromSocket, toSocket, type) {
    if (Array.isArray(toModule)) {
      for (var to of toModule) {
        this._addPatch(fromModule, to, fromSocket, toSocket, type);
      }
      return;
    }
    var p = new _components___WEBPACK_IMPORTED_MODULE_0__["Patch"](fromModule, toModule, fromSocket, toSocket, type);
    this.patches.push(p);
  }
  addPatch(fromMod, toMod, fromSocket, toSocket) {
    var from = null;
    var to = null;
    for (var i = 0; i < this.modules.length; i++) {
      var m = this.modules[i];
      if (m === fromMod) {
        from = i;
      }
      if (m === toMod) {
        to = i;
      }
    }
    if (from === null || to === null || (from === to && fromSocket === toSocket)) {
      return
    }
    if (this.modules[from].unit.sockets[fromSocket].type != this.modules[to].unit.sockets[toSocket].type) {
      alert("Wrong types");
      return;
    }
    var patch = new _components___WEBPACK_IMPORTED_MODULE_0__["Patch"](from, to, fromSocket, toSocket, this.modules[from].unit.sockets[fromSocket].type);
    var remove = null;
    for (var i = 0; i < this.patches.length; i++) {
      var p = this.patches[i];
      if (p.isIsomorphic(patch)) {
        remove = i;
        break;
      }
    }
    if (remove === null) {
      this.patches.push(patch);
    } else {
      this.patches.splice(remove, 1);
    }
  }
  addModule(unit) {
    var m = new _components___WEBPACK_IMPORTED_MODULE_0__["Module"](this, Math.random() * 800 + 100, Math.random() * 600, unit);
    this.modules.push(m);
    return this.modules.length - 1;
  }

}


/***/ }),

/***/ "./src/model/register.js":
/*!*******************************!*\
  !*** ./src/model/register.js ***!
  \*******************************/
/*! exports provided: Register */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Register", function() { return Register; });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "./src/model/types.js");


class Register {
  constructor(register, type) {
    this.register = register;
    this.type = type || "register";
    this.socketType = _types_js__WEBPACK_IMPORTED_MODULE_0__["INT_TYPE"];
    if (type == "array_register") {
      this.socketType = _types_js__WEBPACK_IMPORTED_MODULE_0__["INT_ARRAY_TYPE"];
    } else if (type == "float_register") {
      this.socketType = _types_js__WEBPACK_IMPORTED_MODULE_0__["FLOAT_TYPE"];
    }
  }
  getCompileTarget() {
    return this;
  }
  compile(sequenceTracks) {
    var sequences = [];
    for (var tr of sequenceTracks) {
      var trResult = tr.compile();
      if (trResult) {
        sequences.push(trResult);
      }
    }
    return {
      "sequences": sequences,
    };
  }
}


/***/ }),

/***/ "./src/model/types.js":
/*!****************************!*\
  !*** ./src/model/types.js ***!
  \****************************/
/*! exports provided: AUDIO_TYPE, FREQUENCY_TYPE, PANNING_TYPE, CLOCK_TYPE, TRIGGER_TYPE, INT_TYPE, FLOAT_TYPE, INT_ARRAY_TYPE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUDIO_TYPE", function() { return AUDIO_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FREQUENCY_TYPE", function() { return FREQUENCY_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PANNING_TYPE", function() { return PANNING_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CLOCK_TYPE", function() { return CLOCK_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TRIGGER_TYPE", function() { return TRIGGER_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INT_TYPE", function() { return INT_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FLOAT_TYPE", function() { return FLOAT_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INT_ARRAY_TYPE", function() { return INT_ARRAY_TYPE; });
const AUDIO_TYPE = 1;
const FREQUENCY_TYPE = 2;
const PANNING_TYPE = 3;
const CLOCK_TYPE = 4;
const TRIGGER_TYPE = 5;
const INT_TYPE = 6;
const FLOAT_TYPE = 7;
const INT_ARRAY_TYPE = 8;


/***/ }),

/***/ "./src/sequence_editor/index.js":
/*!**************************************!*\
  !*** ./src/sequence_editor/index.js ***!
  \**************************************/
/*! exports provided: BaseSequenceEditor, SequenceEditor, RegisterSequenceEditor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseSequenceEditor", function() { return BaseSequenceEditor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SequenceEditor", function() { return SequenceEditor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterSequenceEditor", function() { return RegisterSequenceEditor; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/ */ "./src/components/index.js");
/* harmony import */ var _sequence_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sequence.js */ "./src/sequence_editor/sequence.js");
/* harmony import */ var _module_units___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./module_units/ */ "./src/sequence_editor/module_units/index.js");





class BaseSequenceEditor extends _components___WEBPACK_IMPORTED_MODULE_0__["Editor"] {
  constructor(app, sequence, sequenceTarget, handleClose) {
    super(app, sequence, handleClose);
    this.app = app;
    if (!sequence) {
      sequence = new _sequence_js__WEBPACK_IMPORTED_MODULE_1__["Sequence"](sequenceTarget, [], []);
      var modules = [
        new _components___WEBPACK_IMPORTED_MODULE_0__["Module"](sequence, 30, 50, new _module_units___WEBPACK_IMPORTED_MODULE_2__["SequenceInput"]('input')), 
      ];
      sequence.modules = modules;
    }
    this.target = sequence;
  }
  addButtonDefinitions(buttonDefs) {
    var x = 0;
    var prev = null;
    var padding = 0;
    var groupPadding = 15;
    for (var def of buttonDefs) {
      var b = new _components___WEBPACK_IMPORTED_MODULE_0__["Button"](x, this.app.theme.padding, def.onclick.bind(this), def.label);
      b.colour = this.app.theme.colours[def.colour] || this.app.theme.colours.ModuleGenerator;
      this.buttons.push(b);
      if (prev && prev.colour != def.colour) {
        x += groupPadding;
        b.x += groupPadding;
      }
      x += b.w + padding;
      prev = def;
    }

  }
}
class SequenceEditor extends BaseSequenceEditor {
  constructor(app, sequence, channelNr, handleClose) {
    super(app, sequence, channelNr, handleClose);
    var buttonDefs = [
        {label: "𝅝", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"](4))},
        {label: "𝅗𝅥", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"](2))},
        {label: "♩", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"](1))},
        {label: "♪", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"](0.5))},
        {label: "𝅘𝅥𝅯", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"](0.25))},
        {label: "𝅘𝅥𝅰", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"](0.125))},
        {label: "PULS", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"]())},
        {label: "EUCL", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Euclidian"]())},
        {label: "OFFSET", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Offset"]())},

        {label: "NOTE", colour: 'ModuleOutput', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["PlayNote"](channelNr))},
        {label: "NOTES", colour: 'ModuleOutput', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["PlayNotes"](channelNr))},
        {label: "PAN", colour: 'ModuleOutput', onclick: () => this.handleAddGenerator("sine")},
        {label: "REV", colour: 'ModuleOutput', onclick: () => this.handleAddGenerator("sine")},
        {label: "LPF", colour: 'ModuleOutput', onclick: () => this.handleAddGenerator("sine")},
        {label: "HPF", colour: 'ModuleOutput', onclick: () => this.handleAddGenerator("sine")},

        {label: "SWEEP", colour: 'ModuleInt', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Range"]("sweep"))},
        {label: "CYCLE", colour: 'ModuleInt', onclick: () => this.handleAddGenerator("sine")},
        {label: "RANGE", colour: 'ModuleInt', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Range"]("range"))},
        {label: "FADE", colour: 'ModuleInt', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Range"]("fade in"))},
        {label: "RAND", colour: 'ModuleInt', onclick: () => this.handleAddGenerator("sine")},
        {label: "REG", colour: 'ModuleInt', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Register"]())},
        {label: "TRANS", colour: 'ModuleInt', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Transpose"]())},

        {label: "INDEX", colour: 'ModuleIntArray', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["IntArrayRegisterIndex"]())},
        {label: "REG", colour: 'ModuleIntArray', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["IntArrayRegister"]())},
        {label: "TRANS", colour: 'ModuleIntArray', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["TransposeIntArray"]())},
        {label: "CHORD", colour: 'ModuleIntArray', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["CycleChords"]())},
    ]
    this.addButtonDefinitions(buttonDefs);
  }
}

class RegisterSequenceEditor extends BaseSequenceEditor {
  constructor(app, sequence, register, handleClose) {
    super(app, sequence, register, handleClose);
    var buttonDefs = [
        {label: "𝅝", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"](4))},
        {label: "𝅗𝅥", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"](2))},
        {label: "♩", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"](1))},
        {label: "♪", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"](0.5))},
        {label: "𝅘𝅥𝅯", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"](0.25))},
        {label: "𝅘𝅥𝅰", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"](0.125))},
        {label: "PULS", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Pulse"]())},
        {label: "EUCL", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Euclidian"]())},
        {label: "OFFSET", colour: 'ModulePulse', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Offset"]())},

        {label: "SWEEP", colour: 'ModuleInt', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Range"]("sweep"))},
        {label: "CYCLE", colour: 'ModuleInt', onclick: () => this.handleAddGenerator("sine")},
        {label: "RANGE", colour: 'ModuleInt', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Range"]("range"))},
        {label: "FADE", colour: 'ModuleInt', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Range"]("fade in"))},
        {label: "RAND", colour: 'ModuleInt', onclick: () => this.handleAddGenerator("sine")},
        {label: "REG", colour: 'ModuleInt', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Register"]())},
        {label: "TRANS", colour: 'ModuleInt', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["Transpose"]())},

        {label: "INDEX", colour: 'ModuleIntArray', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["IntArrayRegisterIndex"]())},
        {label: "REG", colour: 'ModuleIntArray', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["IntArrayRegister"]())},
        {label: "TRANS", colour: 'ModuleIntArray', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["TransposeIntArray"]())},
        {label: "CHORD", colour: 'ModuleIntArray', onclick: () => this.handleAddUnit(() => new _module_units___WEBPACK_IMPORTED_MODULE_2__["CycleChords"]())},
    ]
    this.addButtonDefinitions(buttonDefs);
    if (sequence.modules.length == 1) {
      sequence.modules.push(new _components___WEBPACK_IMPORTED_MODULE_0__["Module"](sequence, 400, 400, new _module_units___WEBPACK_IMPORTED_MODULE_2__["RegisterOutput"](register.type, register.socketType, register.register)));
    }
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/cycle.js":
/*!***************************************************!*\
  !*** ./src/sequence_editor/module_units/cycle.js ***!
  \***************************************************/
/*! exports provided: Cycle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Cycle", function() { return Cycle; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class Cycle extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor() {
    super("cycle");
    this.sockets = {
      "OUT": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "OUT", _model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]),
    }
    this.cycle = [];
    this.dials = {
    }
    this.background = 'ModuleIntArray';
  }

  compile(connections) {
    var g = {"cycle": this.cycle};
    return g;
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/cycle_chords.js":
/*!**********************************************************!*\
  !*** ./src/sequence_editor/module_units/cycle_chords.js ***!
  \**********************************************************/
/*! exports provided: CycleChords */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CycleChords", function() { return CycleChords; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class CycleChords extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor() {
    super("cycle chords");
    this.sockets = {
      "OUT": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "OUT", _model___WEBPACK_IMPORTED_MODULE_1__["INT_ARRAY_TYPE"]),
    }
    this.chords = [];
    this.dials = {
      "count": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 59, "COUNT", 0.0, 10.0, 1.0),
    }
    this.background = 'ModuleIntArray';
  }

  compile(connections) {
    var g = {"cycle_chords": {
        "count": parseFloat(this.dials.count.value.toFixed(0)),
        "chords": this.chords,
      }
    };
    return g;
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/euclidian.js":
/*!*******************************************************!*\
  !*** ./src/sequence_editor/module_units/euclidian.js ***!
  \*******************************************************/
/*! exports provided: Euclidian */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Euclidian", function() { return Euclidian; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class Euclidian extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor() {
    super("euclidian");
    this.sockets = {
      "CLOCK": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "CLOCK", _model___WEBPACK_IMPORTED_MODULE_1__["CLOCK_TYPE"]),
      "TRIG": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "TRIG", _model___WEBPACK_IMPORTED_MODULE_1__["TRIGGER_TYPE"]),
    }
    this.dials = {
      "pulses": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 59, "PULSES", 0.0, 10.0, 1.0),
      "over": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](79, 59, "OVER", 0.0, 10.0, 1.0),
      "duration": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](129, 59, "DUR", 0.0, 10.0, 1.0),
    }
    this.background = 'ModulePulse';
  }

  compile(connections) {
    var g = {"euclidian": {
        "pulses": parseFloat(this.dials.pulses.value.toFixed(0)),
        "over": parseFloat(this.dials.over.value.toFixed(0)),
        "duration": this.dials.over.value,
        "sequence": null,
      }
    };
    return ((g) => {
      return (seq) => {
        g.euclidian.sequence = seq;
        return g;
      }
   })(g);
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/factory.js":
/*!*****************************************************!*\
  !*** ./src/sequence_editor/module_units/factory.js ***!
  \*****************************************************/
/*! exports provided: Factory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Factory", function() { return Factory; });
/* harmony import */ var _range_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./range.js */ "./src/sequence_editor/module_units/range.js");
/* harmony import */ var _register_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./register.js */ "./src/sequence_editor/module_units/register.js");
/* harmony import */ var _register_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./register_index.js */ "./src/sequence_editor/module_units/register_index.js");
/* harmony import */ var _cycle_chords_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cycle_chords.js */ "./src/sequence_editor/module_units/cycle_chords.js");
/* harmony import */ var _cycle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cycle.js */ "./src/sequence_editor/module_units/cycle.js");
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./random.js */ "./src/sequence_editor/module_units/random.js");







class Factory {

  sequenceFromDefinition(sequenceDef) {

  }

  automationFromDefinition(automationDef) {
    var rangers = ["range", "fade_in", "sweep"];
    for (var ranger of rangers) {
      if (automationDef[ranger] !== undefined) {
        var def = automationDef[ranger];
        var a = new _range_js__WEBPACK_IMPORTED_MODULE_0__["Range"](ranger);
        a.dials.from.value = def.from || 0;
        a.dials.to.value = def.to || 127;
        a.dials.step.value = def.step || 1;
        return a;
      }
    }
    if (automationDef["register"] !== undefined) {
      var a = new _register_js__WEBPACK_IMPORTED_MODULE_1__["Register"]();
      a.dials.register.value = automationDef["register"] || 0;
      return a;
    } else if (automationDef["random"]) {
      var a = new _random_js__WEBPACK_IMPORTED_MODULE_5__["Random"]();
      a.dials.min.value = automationDef.random.min || 0;
      a.dials.max.value = automationDef.random.max || 128;
      return a;
    } else if (automationDef["cycle"] !== undefined) {
      var a = new _cycle_js__WEBPACK_IMPORTED_MODULE_4__["Cycle"]();
      a.cycle = automationDef.cycle;
      return a;
    }
    console.log("Unknown definition in factory:", automationDef);
  }
  intArrayAutomationFromDefinition(automationDef) {
    if (automationDef["register"] !== undefined) {
      var a = new _register_js__WEBPACK_IMPORTED_MODULE_1__["IntArrayRegister"]();
      a.dials.register.value = automationDef["register"] || 0;
      return a;
    } else if (automationDef["index"]) {
      var a = new _register_index_js__WEBPACK_IMPORTED_MODULE_2__["IntArrayRegisterIndex"]();
      a.dials.index.value = automationDef["index"]["value"] || 0;
      return a;
    } else if (automationDef["cycle_chords"]) {
      var a = new _cycle_chords_js__WEBPACK_IMPORTED_MODULE_3__["CycleChords"]();
      a.dials.count.value = automationDef["cycle_chords"]["count"];
      a.chords = automationDef["cycle_chords"]["chords"];
      return a;
    }
    console.log("Unknown int array definition in factory:", automationDef);
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/index.js":
/*!***************************************************!*\
  !*** ./src/sequence_editor/module_units/index.js ***!
  \***************************************************/
/*! exports provided: Pulse, PlayNote, PlayNotes, SequenceInput, Transpose, TransposeIntArray, Euclidian, Range, Register, IntArrayRegister, Factory, IntArrayRegisterIndex, Offset, RegisterOutput, CycleChords, Random, Cycle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pulse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pulse.js */ "./src/sequence_editor/module_units/pulse.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Pulse", function() { return _pulse_js__WEBPACK_IMPORTED_MODULE_0__["Pulse"]; });

/* harmony import */ var _play_note_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./play_note.js */ "./src/sequence_editor/module_units/play_note.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PlayNote", function() { return _play_note_js__WEBPACK_IMPORTED_MODULE_1__["PlayNote"]; });

/* harmony import */ var _play_notes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./play_notes.js */ "./src/sequence_editor/module_units/play_notes.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PlayNotes", function() { return _play_notes_js__WEBPACK_IMPORTED_MODULE_2__["PlayNotes"]; });

/* harmony import */ var _sequence_input_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sequence_input.js */ "./src/sequence_editor/module_units/sequence_input.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SequenceInput", function() { return _sequence_input_js__WEBPACK_IMPORTED_MODULE_3__["SequenceInput"]; });

/* harmony import */ var _transpose_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./transpose.js */ "./src/sequence_editor/module_units/transpose.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Transpose", function() { return _transpose_js__WEBPACK_IMPORTED_MODULE_4__["Transpose"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TransposeIntArray", function() { return _transpose_js__WEBPACK_IMPORTED_MODULE_4__["TransposeIntArray"]; });

/* harmony import */ var _euclidian_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./euclidian.js */ "./src/sequence_editor/module_units/euclidian.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Euclidian", function() { return _euclidian_js__WEBPACK_IMPORTED_MODULE_5__["Euclidian"]; });

/* harmony import */ var _range_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./range.js */ "./src/sequence_editor/module_units/range.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Range", function() { return _range_js__WEBPACK_IMPORTED_MODULE_6__["Range"]; });

/* harmony import */ var _register_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./register.js */ "./src/sequence_editor/module_units/register.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Register", function() { return _register_js__WEBPACK_IMPORTED_MODULE_7__["Register"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IntArrayRegister", function() { return _register_js__WEBPACK_IMPORTED_MODULE_7__["IntArrayRegister"]; });

/* harmony import */ var _factory_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./factory.js */ "./src/sequence_editor/module_units/factory.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Factory", function() { return _factory_js__WEBPACK_IMPORTED_MODULE_8__["Factory"]; });

/* harmony import */ var _register_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./register_index.js */ "./src/sequence_editor/module_units/register_index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IntArrayRegisterIndex", function() { return _register_index_js__WEBPACK_IMPORTED_MODULE_9__["IntArrayRegisterIndex"]; });

/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./offset.js */ "./src/sequence_editor/module_units/offset.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Offset", function() { return _offset_js__WEBPACK_IMPORTED_MODULE_10__["Offset"]; });

/* harmony import */ var _register_output_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./register_output.js */ "./src/sequence_editor/module_units/register_output.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RegisterOutput", function() { return _register_output_js__WEBPACK_IMPORTED_MODULE_11__["RegisterOutput"]; });

/* harmony import */ var _cycle_chords_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./cycle_chords.js */ "./src/sequence_editor/module_units/cycle_chords.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CycleChords", function() { return _cycle_chords_js__WEBPACK_IMPORTED_MODULE_12__["CycleChords"]; });

/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./random.js */ "./src/sequence_editor/module_units/random.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Random", function() { return _random_js__WEBPACK_IMPORTED_MODULE_13__["Random"]; });

/* harmony import */ var _cycle_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./cycle.js */ "./src/sequence_editor/module_units/cycle.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Cycle", function() { return _cycle_js__WEBPACK_IMPORTED_MODULE_14__["Cycle"]; });


















/***/ }),

/***/ "./src/sequence_editor/module_units/offset.js":
/*!****************************************************!*\
  !*** ./src/sequence_editor/module_units/offset.js ***!
  \****************************************************/
/*! exports provided: Offset */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Offset", function() { return Offset; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class Offset extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor() {
    super("offset");
    this.sockets = {
      "CLOCK": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "CLOCK", _model___WEBPACK_IMPORTED_MODULE_1__["CLOCK_TYPE"]),
      "OUT": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "OUT", _model___WEBPACK_IMPORTED_MODULE_1__["CLOCK_TYPE"]),
    }
    this.dials = {
      "offset": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 59, "OFFSET", 0.0, 128.0, 1.0),
    }
    this.background = 'ModulePulse';
  }

  compile(connections) {
    var g = {"offset": {
        "offset": this.dials.offset.value,
      }
    };
    return ((g) => {
      return (seq) => {
        g.euclidian.sequence = seq;
        return g;
      }
   })(g);
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/play_note.js":
/*!*******************************************************!*\
  !*** ./src/sequence_editor/module_units/play_note.js ***!
  \*******************************************************/
/*! exports provided: PlayNote */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PlayNote", function() { return PlayNote; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class PlayNote extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(channelNr) {
    super("play_note");
    this.channelNr = channelNr;
    this.sockets = {
      "TRIG": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "TRIG", _model___WEBPACK_IMPORTED_MODULE_1__["TRIGGER_TYPE"]),
      "NOTE": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](79, this.h - 29, "NOTE", _model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]),
      "VEL": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](129, this.h - 29, "VEL", _model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]),
    }
    this.dials = {
      "note": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 59, "NOTE", 0.0, 128.0, 1.0),
      "velocity": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](79, 59, "VEL", 0.0, 128.0, 90.0),
      "duration": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](129, 59, "DUR", 0.0, 10.0, 1.0),
    }
    this.background = 'ModuleOutput';
  }

  compile(connections) {
    var g = {"play_note": {
      "duration": this.dials["duration"].value,
      "channel": this.channelNr,
    }};
    var on = connections["NOTE"];
    if (on.length === 0) {
      g["play_note"]["note"] = parseFloat(this.dials["note"].value.toFixed(0));
    } else {
      g["play_note"]["auto_note"] = on[0];
    }
    var on = connections["VEL"];
    if (on.length === 0) {
      g["play_note"]["velocity"] = parseFloat(this.dials["velocity"].value.toFixed(0));
    } else {
      g["play_note"]["auto_velocity"] = on[0];
    }

    var result = []
    var on = connections["TRIG"];
    for (var o of on) {
      result.push(o(g));
    }
    return result;
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/play_notes.js":
/*!********************************************************!*\
  !*** ./src/sequence_editor/module_units/play_notes.js ***!
  \********************************************************/
/*! exports provided: PlayNotes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PlayNotes", function() { return PlayNotes; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class PlayNotes extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(channelNr) {
    super("play_notes");
    this.channelNr = channelNr;
    this.sockets = {
      "TRIG": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "TRIG", _model___WEBPACK_IMPORTED_MODULE_1__["TRIGGER_TYPE"]),
      "NOTES": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](79, this.h - 29, "NOTES", _model___WEBPACK_IMPORTED_MODULE_1__["INT_ARRAY_TYPE"]),
      "VEL": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](129, this.h - 29, "VEL", _model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]),
    }
    this.dials = {
      "velocity": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](79, 59, "VEL", 0.0, 128.0, 90.0),
      "duration": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](129, 59, "DUR", 0.0, 10.0, 1.0),
    }
    this.background = 'ModuleOutput';
  }

  compile(connections) {
    var g = {"play_notes": {
      "duration": this.dials["duration"].value,
      "channel": this.channelNr,
    }};
    var on = connections["NOTES"];
    if (on.length === 0) {
      return null;
    } else {
      g["play_notes"]["auto_notes"] = on[0];
    }
    var on = connections["VEL"];
    if (on.length === 0) {
      g["play_notes"]["velocity"] = parseFloat(this.dials["velocity"].value.toFixed(0));
    } else {
      g["play_notes"]["auto_velocity"] = on[0];
    }

    var result = []
    var on = connections["TRIG"];
    for (var o of on) {
      result.push(o(g));
    }
    return result;
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/pulse.js":
/*!***************************************************!*\
  !*** ./src/sequence_editor/module_units/pulse.js ***!
  \***************************************************/
/*! exports provided: Pulse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pulse", function() { return Pulse; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class Pulse extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(every) {
    super("pulse");
    this.sockets = {
      "CLOCK": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "CLOCK", _model___WEBPACK_IMPORTED_MODULE_1__["CLOCK_TYPE"]),
      "TRIG": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "TRIG", _model___WEBPACK_IMPORTED_MODULE_1__["TRIGGER_TYPE"]),
    }
    this.dials = {
      "every": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 59, "EVERY", 0.0, 10.0, 1.0),
    }
    this.dials.every.value = every || 1;
    this.background = 'ModulePulse';
  }

  compile(connections) {
    var g = {"repeat": {
        "every": this.dials["every"].value,
      }
    };
    return ((g) => {
      return (seq) => {
        g.repeat.sequence = seq;
        return g;
      }
   })(g);
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/random.js":
/*!****************************************************!*\
  !*** ./src/sequence_editor/module_units/random.js ***!
  \****************************************************/
/*! exports provided: Random */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Random", function() { return Random; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class Random extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor() {
    super("random");
    this.sockets = {
      "OUT": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "OUT", _model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]),
    }
    this.cycle = [];
    this.dials = {
      "min": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 59, "COUNT", 0.0, 128.0, 1.0),
      "max": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 59, "COUNT", 0.0, 128.0, 128.0),
    }
    this.background = 'ModuleIntArray';
  }

  compile(connections) {
    var g = {"random": {
      "min": parseFloat(this.dials.min.value.toFixed(0)),
      "max": parseFloat(this.dials.max.value.toFixed(0)),
    }};
    return g;
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/range.js":
/*!***************************************************!*\
  !*** ./src/sequence_editor/module_units/range.js ***!
  \***************************************************/
/*! exports provided: Range */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Range", function() { return Range; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class Range extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(type) {
    super(type);
    this.sockets = {
      "OUT": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "OUT", _model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]),
    }
    this.dials = {
      "from": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 59, "FROM", 0.0, 127.0, 0.0),
      "to": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](79, 59, "TO", 0.0, 127.0, 127.0),
      "step": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](129, 59, "STEP", 0.0, 128.0, 1.0),
    }
    this.background = 'ModuleInt';
  }

  compile(connections) {
    var g = {};
    g[this.type] = {
      "from": this.dials.from.value,
      "to": this.dials.to.value,
      "step": this.dials.step.value,
    };
    return g;
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/register.js":
/*!******************************************************!*\
  !*** ./src/sequence_editor/module_units/register.js ***!
  \******************************************************/
/*! exports provided: Register, IntArrayRegister */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Register", function() { return Register; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntArrayRegister", function() { return IntArrayRegister; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class BaseRegister extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(socketType) {
    super("register");
    this.sockets = {
      "OUT": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "OUT", socketType),
    }
    this.dials = {
      "register": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 59, "VALUE", 0, 16, 0.0),
    }
    if (socketType == _model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]) {
      this.background = 'ModuleInt';
    } else {
      this.background = 'ModuleIntArray';
    }
  }

  compile(connections) {
    var g = {};
    g[this.type] = parseFloat(this.dials.register.value.toFixed(0));
    return g;
  }
}
class Register extends BaseRegister {
  constructor() {
    super(_model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]);
  }
}
class IntArrayRegister extends BaseRegister {
  constructor() {
    super(_model___WEBPACK_IMPORTED_MODULE_1__["INT_ARRAY_TYPE"]);
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/register_index.js":
/*!************************************************************!*\
  !*** ./src/sequence_editor/module_units/register_index.js ***!
  \************************************************************/
/*! exports provided: IntArrayRegisterIndex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntArrayRegisterIndex", function() { return IntArrayRegisterIndex; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class BaseRegisterIndex extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(socketType) {
    super("index");
    this.sockets = {
      "IN": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "IN", socketType),
      "INDEX": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](79, this.h - 29, "INDEX", _model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]),
      "OUT": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "OUT", socketType),
    }
    this.dials = {
      "index": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](79, 59, "INDEX", 0, 16, 0.0),
    }
    if (socketType == _model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]) {
      this.background = 'ModuleInt';
    } else {
      this.background = 'ModuleIntArray';
    }
  }

  compile(connections) {
    var g = {"index": {
        "value": parseFloat(this.dials.index.value.toFixed(0)),
      }
    };
    var autoValue = connections["INDEX"];
    if (autoValue) {
      if (autoValue.length === 1) {
        if (autoValue[0]) {
          g.index.auto_value = autoValue[0];
        } 
      }
    }
    var on = connections["IN"];
    if (!on) {
      return null;
    }
    if (on.length === 1) {
      if (!on[0]) {
        return null;
      }
      for (var key of Object.keys(on[0])) {
        g["index"][key] = on[0][key];
      }
    } else {
      console.log("inputs to index != 1");
      return null;
    }
    return g;
  }
}

class IntArrayRegisterIndex extends BaseRegisterIndex {
  constructor() {
    super(_model___WEBPACK_IMPORTED_MODULE_1__["INT_ARRAY_TYPE"]);
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/register_output.js":
/*!*************************************************************!*\
  !*** ./src/sequence_editor/module_units/register_output.js ***!
  \*************************************************************/
/*! exports provided: RegisterOutput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterOutput", function() { return RegisterOutput; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");




class RegisterOutput extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(type, socketType, register) {
    super(type);
    this.sockets = {
      "TRIG": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "TRIG", _model___WEBPACK_IMPORTED_MODULE_1__["TRIGGER_TYPE"]),
      "VALUE": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](79, this.h - 29, "VALUE", socketType || _model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]),
    }
    this.register = register;
    this.dials = {}
    this.background = 'ModuleOutput';
  }
  compile(connections) {
    var g = {};
    g[this.type] = {
      "register": this.register,
    }

    var val = connections["VALUE"];
    if (val.length == 0) {
      return [];
    } else if (val.length == 1) {
      var v = "auto_value";
      if (this.type == "array_register") {
        v = "auto_values";
      }
      g[this.type][v] = val[0];
    } else {
      console.log("more than one input to register set");
      return []
    }

    var result = [];
    var on = connections["TRIG"];
    for (var o of on) {
      result.push(o(g))
    }
    return result;
  }
}



/***/ }),

/***/ "./src/sequence_editor/module_units/sequence_input.js":
/*!************************************************************!*\
  !*** ./src/sequence_editor/module_units/sequence_input.js ***!
  \************************************************************/
/*! exports provided: SequenceInput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SequenceInput", function() { return SequenceInput; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class SequenceInput extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(type) {
    super(type);
    this.sockets = {
      "CLOCK": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "CLOCK", _model___WEBPACK_IMPORTED_MODULE_1__["CLOCK_TYPE"]),
    }
    this.background = 'ModuleOutput';
  }
}


/***/ }),

/***/ "./src/sequence_editor/module_units/transpose.js":
/*!*******************************************************!*\
  !*** ./src/sequence_editor/module_units/transpose.js ***!
  \*******************************************************/
/*! exports provided: Transpose, TransposeIntArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transpose", function() { return Transpose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransposeIntArray", function() { return TransposeIntArray; });
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../model/ */ "./src/model/index.js");



class BaseTranspose extends _components___WEBPACK_IMPORTED_MODULE_0__["ModuleUnit"] {
  constructor(socketType) {
    super("transpose");
    this.sockets = {
      "IN": new _components___WEBPACK_IMPORTED_MODULE_0__["InputSocket"](29, this.h - 29, "IN", socketType),
      "OUT": new _components___WEBPACK_IMPORTED_MODULE_0__["OutputSocket"](this.w - 29, this.h - 29, "OUT", socketType),
    }
    this.dials = {
      "transpose": new _components___WEBPACK_IMPORTED_MODULE_0__["Dial"](29, 59, "VALUE", -127.0, 127.0, 0.0),
    }
    if (socketType == _model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]) {
      this.background = 'ModuleInt';
    } else {
      this.background = 'ModuleIntArray';
    }
  }

  compile(connections) {
    var g = {};
    g[this.type] = {
      "value": parseFloat(this.dials.transpose.value.toFixed(0)),
    };
    var on = connections["IN"];
    if (!on) {
      return null;
    }
    if (on.length === 1) {
      if (!on[0]) {
        return null;
      }
      for (var key of Object.keys(on[0])) {
        g[this.type][key] = on[0][key];
      }
    } else {
      console.log("inputs to transpose != 1");
      return null;
    }
    return g;
  }
}
class Transpose extends BaseTranspose {
  constructor() {
    super(_model___WEBPACK_IMPORTED_MODULE_1__["INT_TYPE"]);
  }
}

class TransposeIntArray extends BaseTranspose {
  constructor() {
    super(_model___WEBPACK_IMPORTED_MODULE_1__["INT_ARRAY_TYPE"]);
  }
}


/***/ }),

/***/ "./src/sequence_editor/sequence.js":
/*!*****************************************!*\
  !*** ./src/sequence_editor/sequence.js ***!
  \*****************************************/
/*! exports provided: Sequence */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sequence", function() { return Sequence; });
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/ */ "./src/model/index.js");
/* harmony import */ var _module_units___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module_units/ */ "./src/sequence_editor/module_units/index.js");
/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/ */ "./src/components/index.js");





class Sequence extends _model___WEBPACK_IMPORTED_MODULE_0__["Patchable"] {
  constructor(target, modules, patches) {
    super(modules, patches);
    this.target = target || 1;
  }

  loadFromDefinition(sequenceDef) {

    this.modules = [
      new _components___WEBPACK_IMPORTED_MODULE_2__["Module"](this, 10, 40, new _module_units___WEBPACK_IMPORTED_MODULE_1__["SequenceInput"]('input')), 
    ];
    this.patches = [];

    if (!sequenceDef) {
      return;
    }
    this.loadSequence(sequenceDef, 0);
  }

  compile() {
    var queue = [];
    var seen = {};
    var dependencies = [];

    for (var i = 0; i < this.modules.length; i++) {
      var m = this.modules[i];
      if (m.unit.type == "play_note" || m.unit.type == "play_notes" || m.unit instanceof _module_units___WEBPACK_IMPORTED_MODULE_1__["RegisterOutput"]) {
        queue.push(i);
      }
    }
    while (queue.length > 0) {
      var q = queue[0];
      var queue = queue.splice(1);
      if (seen[q]) {
        continue
      }
      dependencies.push(q);
      for (var p of this.patches) {
        var modSockets = this.modules[q].unit.sockets;
        if (p.to === q && modSockets[p.toSocket] && modSockets[p.toSocket].isInput) {
          if (!seen[p.from]) {
            queue.push(p.from);
          }
        } else if (p.from === q && modSockets[p.fromSocket] && modSockets[p.fromSocket].isInput) {
          if (!seen[p.from]) {
            queue.push(p.to);
          }
        }
      }
      seen[q] = true;
    }

    var result = [];
    var sequences = {};
    for (var i = dependencies.length - 1; i >= 0; i--) {
      var ix = dependencies[i];
      var unit = this.modules[ix].unit;

      var connections = {};
      for (var socketId of Object.keys(unit.sockets)) {
        if (unit.sockets[socketId].isInput) {
          connections[socketId] = this.getConnectedSequences(sequences, ix, socketId);
        }
      }
      if (unit.type == "play_note" || unit.type == "play_notes" || unit instanceof _module_units___WEBPACK_IMPORTED_MODULE_1__["RegisterOutput"]) {
        for (var o of unit.compile(connections)) {
          result.push(o);
        }
      } else {
        var g = unit.compile(connections);
        sequences[ix] = g;
      }
    }
    if (result.length === 0) {
      return null;
    } else if (result.length === 1) {
      return result[0];
    } else {
      return {
        "combine": result,
      };
    }
  }

  parseDuration(duration) {
    if (typeof duration == 'number') {
      return duration;
    }
    var granularity = 64;
    if (duration == "Thirtysecond") {
      return 0.125;
    } else if (duration == "Sixteenth") {
      return 0.25;
    } else if (duration == "Eight") {
      return 0.5;
    } else if (duration == "Quarter") {
      return 1;
    } else if (duration == "Half") {
      return 2;
    } else if (duration == "Whole") {
      return 4;
    }
  }

  loadSequence(sequenceDef, input) {
    if (sequenceDef["before"]) { // we filter out before, because this is handled in the timeline
      return this.loadSequence(sequenceDef["before"]["sequence"], input);
    } else if (sequenceDef["after"]) { // we filter out after, because this is handled in the timeline
      return this.loadSequence(sequenceDef["after"]["sequence"], input);
    } else if (sequenceDef["play_note"]) {
      var def = sequenceDef["play_note"];
      var g = new _module_units___WEBPACK_IMPORTED_MODULE_1__["PlayNote"](this.target);
      g.dials.note.value = def.note || 1.0;
      g.dials.velocity.value = def.velocity || 1.0;
      g.dials.duration.value = this.parseDuration(def.duration) || 1.0;
      var ix = this.addModule(g);
      if (def["auto_velocity"]) {
        var vIx = this.loadAutomation(def["auto_velocity"]);
        if (vIx !== null) {
          this._addPatch(ix, vIx, "VEL", "OUT", _model___WEBPACK_IMPORTED_MODULE_0__["INT_TYPE"]);
        }
      } 
      if (def["auto_note"]) {
        var vIx = this.loadAutomation(def["auto_note"]);
        if (vIx !== null) {
          this._addPatch(ix, vIx, "NOTE", "OUT", _model___WEBPACK_IMPORTED_MODULE_0__["INT_TYPE"]);
        }
      }
      if (def["every"]) {
        var pulseIx = this.addModule(new _module_units___WEBPACK_IMPORTED_MODULE_1__["Pulse"](this.parseDuration(def["every"])));
        this._addPatch(input, pulseIx, "CLOCK", "CLOCK", _model___WEBPACK_IMPORTED_MODULE_0__["CLOCK_TYPE"]);
        this._addPatch(ix, pulseIx, "TRIG", "TRIG", _model___WEBPACK_IMPORTED_MODULE_0__["TRIGGER_TYPE"]);
      }
      return ix;
    } else if (sequenceDef["combine"]) {
      var seqs = [];
      for (var iDef of sequenceDef["combine"]) {
        var ix = this.loadSequence(iDef, input);
        if (ix) {
          seqs.push(ix);
        }
      }
      return seqs;
    } else if (sequenceDef["play_notes"]) {
      var def = sequenceDef["play_notes"];
      var g = new _module_units___WEBPACK_IMPORTED_MODULE_1__["PlayNotes"](this.target);
      var ix = this.addModule(g);

      if (def["auto_velocity"]) {
        var vIx = this.loadAutomation(def["auto_velocity"]);
        if (vIx !== null) {
          this._addPatch(ix, vIx, "VEL", "OUT", _model___WEBPACK_IMPORTED_MODULE_0__["INT_TYPE"]);
        }
      } 
      if (def["auto_notes"]) {
        var vIx = this.loadIntArrayAutomation(def["auto_notes"]);
        if (vIx !== null) {
          this._addPatch(ix, vIx, "NOTES", "OUT", _model___WEBPACK_IMPORTED_MODULE_0__["INT_ARRAY_TYPE"]);
        }
      }
      if (def["every"]) {
        var pulseIx = this.addModule(new _module_units___WEBPACK_IMPORTED_MODULE_1__["Pulse"](this.parseDuration(def["every"])));
        this._addPatch(input, pulseIx, "CLOCK", "CLOCK", _model___WEBPACK_IMPORTED_MODULE_0__["CLOCK_TYPE"]);
        this._addPatch(ix, pulseIx, "TRIG", "TRIG", _model___WEBPACK_IMPORTED_MODULE_0__["TRIGGER_TYPE"]);
      }
      return ix;
    } else if (sequenceDef["repeat"]) {
      var def = sequenceDef["repeat"];
      var g = new _module_units___WEBPACK_IMPORTED_MODULE_1__["Pulse"](this.parseDuration(def.every));
      var ix = this.addModule(g);
      var aIx = this.loadSequence(def.sequence);
      if (aIx != null) {
        this._addPatch(ix, aIx, "TRIG", "TRIG", _model___WEBPACK_IMPORTED_MODULE_0__["TRIGGER_TYPE"]);
      }
      this._addPatch(input, ix, "CLOCK", "CLOCK", _model___WEBPACK_IMPORTED_MODULE_0__["CLOCK_TYPE"]);
      return ix;
    } else if (sequenceDef["offset"]) {
      // TODO fix?
      console.log("WATCH OUT FOR offset", sequenceDef["offset"]);
      var def = sequenceDef["offset"];
      var g = new _module_units___WEBPACK_IMPORTED_MODULE_1__["Offset"]();
      g.dials.offset.value = def.offset || 0;
      var ix = this.addModule(g);
      var aIx = this.loadSequence(def.sequence);
      if (aIx != null) {
        this._addPatch(ix, aIx, "OUT", "CLOCK", _model___WEBPACK_IMPORTED_MODULE_0__["CLOCK_TYPE"]);
      }
      this._addPatch(input, ix, "CLOCK", "CLOCK", _model___WEBPACK_IMPORTED_MODULE_0__["CLOCK_TYPE"]);
      return ix;
    } else if (sequenceDef["euclidian"]) {
      var def = sequenceDef["euclidian"];
      var g = new _module_units___WEBPACK_IMPORTED_MODULE_1__["Euclidian"]();
      g.dials.pulses.value = def.pulses || 1;
      g.dials.over.value = def.over || 1;
      var ix = this.addModule(g);
      var aIx = this.loadSequence(def.sequence);
      this._addPatch(ix, aIx, "TRIG", "TRIG", _model___WEBPACK_IMPORTED_MODULE_0__["TRIGGER_TYPE"]);
      this._addPatch(input, ix, "CLOCK", "CLOCK", _model___WEBPACK_IMPORTED_MODULE_0__["CLOCK_TYPE"]);
      return ix;
    } else if (sequenceDef["array_register"]) {
      var def = sequenceDef.array_register;
      var g = new _module_units___WEBPACK_IMPORTED_MODULE_1__["RegisterOutput"]("array_register", _model___WEBPACK_IMPORTED_MODULE_0__["INT_ARRAY_TYPE"], def.register);
      var ix = this.addModule(g);
      if (def["auto_values"]) {
        var aIx = this.loadIntArrayAutomation(def.auto_values);
        if (aIx != null) {
          this._addPatch(ix, aIx, "VALUE", "OUT", _model___WEBPACK_IMPORTED_MODULE_0__["INT_ARRAY_TYPE"]);
        }
      }
      return ix;
    } else if (sequenceDef["register"]) {
      var def = sequenceDef.register;
      var g = new _module_units___WEBPACK_IMPORTED_MODULE_1__["RegisterOutput"]("register", _model___WEBPACK_IMPORTED_MODULE_0__["INT_TYPE"], def.register);
      g.dials.value.value = def.value || 0;
      var ix = this.addModule(g);
      if (def["auto_value"]) {
        var aIx = this.loadAutomation(def.auto_value);
        if (aIx != null) {
          this._addPatch(ix, aIx, "VALUE", "OUT", _model___WEBPACK_IMPORTED_MODULE_0__["INT_TYPE"]);
        }
      }
      return ix;
    } else if (sequenceDef["panning"]) {
      console.log("Unsupported sequence def", sequenceDef);
      return null;
    } else {
      console.log("Unsupported sequence def", sequenceDef);
      return null;
    }
  }

  loadAutomation(automationDef) {
    //console.log("Loading automation", automationDef);
    if (automationDef["back_and_forth"]) {
      console.log("Unsupported automation def", automationDef);
      return null;
    } else if (automationDef["fade_in"] !== undefined
            || automationDef["range"] !== undefined
            || automationDef["sweep"] !== undefined
            || automationDef["cycle"] !== undefined
            || automationDef["random"] !== undefined
            || automationDef["register"] !== undefined) {
      var a = new _module_units___WEBPACK_IMPORTED_MODULE_1__["Factory"]().automationFromDefinition(automationDef);
      return this.addModule(a);
    } else if (automationDef["transpose"]) {
      var a = new _module_units___WEBPACK_IMPORTED_MODULE_1__["Transpose"]();
      a.dials.transpose.value = automationDef["transpose"].value;
      var ix = this.addModule(a);
      var aIx = this.loadAutomation(automationDef["transpose"]);
      if (aIx != null) {
        this._addPatch(ix, aIx, "IN", "OUT", _model___WEBPACK_IMPORTED_MODULE_0__["INT_TYPE"]);
      }
      return ix;
    } else {
      console.log("Unsupported automation def", automationDef);
      return null;
    }
  }

  loadIntArrayAutomation(automationDef) {
    if (automationDef["transpose"]) {
      var a = new _module_units___WEBPACK_IMPORTED_MODULE_1__["TransposeIntArray"]();
      a.dials.transpose.value = automationDef["transpose"].value;
      var ix = this.addModule(a);
      var aIx = this.loadIntArrayAutomation(automationDef["transpose"]);
      if (aIx != null) {
        this._addPatch(ix, aIx, "IN", "OUT", _model___WEBPACK_IMPORTED_MODULE_0__["INT_ARRAY_TYPE"]);
      }
      return ix;
    } else if (automationDef["register"] !== undefined) {
      var a = new _module_units___WEBPACK_IMPORTED_MODULE_1__["Factory"]().intArrayAutomationFromDefinition(automationDef);
      return this.addModule(a);
    } else if (automationDef["index"] !== undefined) {
      var a = new _module_units___WEBPACK_IMPORTED_MODULE_1__["Factory"]().intArrayAutomationFromDefinition(automationDef);
      var ix = this.addModule(a);
      var aIx = this.loadIntArrayAutomation(automationDef["index"]);
      if (aIx != null) {
        this._addPatch(ix, aIx, "IN", "OUT", _model___WEBPACK_IMPORTED_MODULE_0__["INT_ARRAY_TYPE"]);
      }
      if (automationDef["index"]["auto_value"]) {
        aIx = this.loadAutomation(automationDef["index"]["auto_value"]);
        if (!aIx != null) {
          this._addPatch(ix, aIx, "INDEX", "OUT", _model___WEBPACK_IMPORTED_MODULE_0__["INT_TYPE"]);
        }
      }
      return ix;
    } else if (automationDef["cycle_chords"] !== undefined) {
      var a = new _module_units___WEBPACK_IMPORTED_MODULE_1__["Factory"]().intArrayAutomationFromDefinition(automationDef);
      return this.addModule(a);
    } else {
      console.log("Unsupported integer array automation def", automationDef);
      return null;
    }
  }

  getConnectedSequences(sequences, ix, input) {
    var gs = [];
    for (var p of this.patches) {
      if (p.doesPatchConnectTo(ix, input)) {
        gs.push(sequences[p.connectsTo(ix, input).module])
      }
    }
    return gs;
  }
}


/***/ }),

/***/ "./src/theme.js":
/*!**********************!*\
  !*** ./src/theme.js ***!
  \**********************/
/*! exports provided: Theme */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Theme", function() { return Theme; });
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model/ */ "./src/model/index.js");


class Theme {
  constructor() {
    this.padding = 0;
    var socketColours = {};
    var patchColours = {}
    socketColours[_model___WEBPACK_IMPORTED_MODULE_0__["AUDIO_TYPE"]] = 'rgb(140, 255, 255)';
    socketColours[_model___WEBPACK_IMPORTED_MODULE_0__["FREQUENCY_TYPE"]] = 'rgb(255, 255, 140)';
    socketColours[_model___WEBPACK_IMPORTED_MODULE_0__["PANNING_TYPE"]] = 'rgb(255, 140, 255)';
    socketColours[_model___WEBPACK_IMPORTED_MODULE_0__["CLOCK_TYPE"]] = 'rgb(100, 100, 255)';
    socketColours[_model___WEBPACK_IMPORTED_MODULE_0__["TRIGGER_TYPE"]] = 'rgb(50, 50, 50)';
    socketColours[_model___WEBPACK_IMPORTED_MODULE_0__["INT_TYPE"]] = 'rgb(255, 255, 40)';
    socketColours[_model___WEBPACK_IMPORTED_MODULE_0__["INT_ARRAY_TYPE"]] = 'rgb(255, 40, 40)';
    for (var key of Object.keys(socketColours)) {
      patchColours[key] = RGB_Linear_Shade(0.1, socketColours[key]);
    }
    this.colours = {
      OutlineColour: '#333',
      Background: '#444',
      Foreground: '#eee',
      InstrumentEditorBackground: '#eee',

      SocketBackground: '#9ff',
      SocketInside: '#999',
      SocketOutline: '#777',

      Patch: '#7ff',

      ModuleOutline: '#777',
      ModuleText: '#444',
      ModuleGenerator: '#fff',
      ModuleFilter: '#ffd',
      ModuleDerived: '#ddf',
      ModuleOutput: '#dfd',
      ModuleInt: '#ff9',
      ModuleFloat: '#f9f',
      ModuleIntArray: '#f99',
      ModulePulse: '#ddf',

      Button: '#ccc',
      ButtonText: '#333',

      Dial: '#ccc',
      DialLine: '#444',

      Sockets: socketColours,
      Patches: patchColours,
    };
  }
}

const RGB_Linear_Shade=(p,c)=>{
    var i=parseInt,r=Math.round,[a,b,c,d]=c.split(","),P=p<0,t=P?0:255*p,P=P?1+p:1-p;
    return"rgb"+(d?"a(":"(")+r(i(a[3]=="a"?a.slice(5):a.slice(4))*P+t)+","+r(i(b)*P+t)+","+r(i(c)*P+t)+(d?","+d:")");
}


/***/ }),

/***/ "./src/timeline_editor/channel_sidebar.js":
/*!************************************************!*\
  !*** ./src/timeline_editor/channel_sidebar.js ***!
  \************************************************/
/*! exports provided: ChannelSideBar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChannelSideBar", function() { return ChannelSideBar; });
class ChannelSideBar {
  constructor(channel, app, padding, panelWidth, height) {
    this.channel = channel;
    this.app = app;
    this.padding = padding;
    this.panelWidth = panelWidth;
    this.height = height;
  }

  draw(app, colorOffset) {
    app.ctx.fillStyle = 'rgb(0, ' + (200 - colorOffset) + ', 0)';
    app.ctx.strokeStyle = 'rgb(40, 40, 40, 1.0)';
    app.ctx.fillRect(this.padding, this.padding, this.panelWidth, this.height);
    app.ctx.strokeRect(this.padding, this.padding, this.panelWidth, this.height);

    app.ctx.fillStyle = 'rgb(255, 255, 255)';
    app.ctx.font = '10px sans-serif';
    app.ctx.fillText(this.channel.name, this.padding + 3, this.padding + 11);
  }

  handleClick() {
    this.app.openInstrumentEditor(this.channel.instrument);
  }

  handleMouseDown(app, x, y) {
    var path = new Path2D();
    path.rect(0, 0, this.panelWidth, this.height + this.padding * 2);
    if (app.ctx.isPointInPath(path, x, y)) {
      return this;
    }
    return false;
  }
}


/***/ }),

/***/ "./src/timeline_editor/index.js":
/*!**************************************!*\
  !*** ./src/timeline_editor/index.js ***!
  \**************************************/
/*! exports provided: ChannelTrack, RegisterTrack, TimelineEditor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimelineEditor", function() { return TimelineEditor; });
/* harmony import */ var _track_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./track.js */ "./src/timeline_editor/track.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ChannelTrack", function() { return _track_js__WEBPACK_IMPORTED_MODULE_0__["ChannelTrack"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RegisterTrack", function() { return _track_js__WEBPACK_IMPORTED_MODULE_0__["RegisterTrack"]; });

/* harmony import */ var _components___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/ */ "./src/components/index.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/ */ "./src/model/index.js");





class TimelineEditor {
  constructor(tracks, app) {
    this.tracks = tracks;
    this.app = app;
    var buttonDefs = [
        {label: "CHAN", colour: 'ModulePulse', onclick: this.addChannelTrack},
        {label: "REG", colour: 'ModuleInt', onclick: this.addRegisterTrack},
        {label: "FLT", colour: 'ModuleFloat', onclick: this.addFloatRegisterTrack},
        {label: "ARR", colour: 'ModuleIntArray', onclick: this.addIntArrayRegisterTrack},
    ];
    this.buttons = [];
    this.addButtonDefinitions(buttonDefs);
  }
  addChannelTrack() {
    var nextChannel = 0;
    for (var tr of this.tracks) {
      if (tr instanceof _track_js__WEBPACK_IMPORTED_MODULE_0__["ChannelTrack"]) {
        if (tr.unit.channelNr >= nextChannel) {
          nextChannel = tr.unit.channelNr + 1;
        }
      }
    }
    var ch = new _model___WEBPACK_IMPORTED_MODULE_2__["Channel"](nextChannel);
    var track = new _track_js__WEBPACK_IMPORTED_MODULE_0__["ChannelTrack"](ch, this.app);
    this.app.tracks.push(track);
    this.app.draw()
  }
  addRegisterTrack() {
    this._addRegisterTrack("register");
  }
  addFloatRegisterTrack() {
    this._addRegisterTrack("float_register");
  }
  addIntArrayRegisterTrack() {
    this._addRegisterTrack("array_register");
  }
  _addRegisterTrack(type) {
    var nextRegister = 0;
    for (var tr of this.tracks) {
      if (tr instanceof _track_js__WEBPACK_IMPORTED_MODULE_0__["RegisterTrack"]) {
        if (tr.unit.type == type && tr.unit.register >= nextRegister) {
          nextRegister = tr.unit.register + 1;
        }
      }
    }
    var ch = new _model___WEBPACK_IMPORTED_MODULE_2__["Register"](nextRegister, type);
    var track = new _track_js__WEBPACK_IMPORTED_MODULE_0__["RegisterTrack"](ch, this.app);
    this.app.tracks.push(track);
    this.app.draw()
  }
  addButtonDefinitions(buttonDefs) {
    var x = 0;
    var prev = null;
    var padding = 0;
    var groupPadding = 10;
    for (var def of buttonDefs) {
      var b = new _components___WEBPACK_IMPORTED_MODULE_1__["Button"](x, this.app.theme.padding, def.onclick.bind(this), def.label);
      b.colour = this.app.theme.colours[def.colour] || this.app.theme.colours.ModuleGenerator;
      this.buttons.push(b);
      if (prev && prev.colour != def.colour) {
        x += groupPadding;
        b.x += groupPadding;
      }
      x += b.w + padding;
      prev = def;
    }

  }
  handleMouseDown(app, x, y) {
    var i = 0;
    for (var b of this.buttons) {
      var v = b.handleMouseDown(app, x, y);
      if (v) {
        return v;
      }
    }
    for (var e of this.tracks) {
      var v = e.handleMouseDown(app, x, y - (25 + i * (e.height + e.padding * 2)));
      if (v) {
        return v;
      }
      i++;
    }
  }
  draw(app) {
    app.ctx.save();
    var i = 0;

    // Draw the buttons 
    for (var b of this.buttons) {
      b.draw(app);
    }

    // Draw the tracks
    for (var e of this.tracks) {
      app.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset translate
      app.ctx.translate(0, 25 + i * (e.height + e.padding * 2));
      e.draw(app);
      i++;
    }
    app.ctx.restore();
  }
}


/***/ }),

/***/ "./src/timeline_editor/register_sidebar.js":
/*!*************************************************!*\
  !*** ./src/timeline_editor/register_sidebar.js ***!
  \*************************************************/
/*! exports provided: RegisterSideBar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterSideBar", function() { return RegisterSideBar; });
class RegisterSideBar {
  constructor(register, app, padding, panelWidth, height) {
    this.register = register;
    this.app = app;
    this.padding = padding;
    this.panelWidth = panelWidth;
    this.height = height;
  }

  draw(app, colorOffset) {
    app.ctx.fillStyle = 'rgb(0, ' + (200 - colorOffset) + ', 0)';
    app.ctx.strokeStyle = 'rgb(40, 40, 40, 1.0)';
    app.ctx.fillRect(this.padding, this.padding, this.panelWidth, this.height);
    app.ctx.strokeRect(this.padding, this.padding, this.panelWidth, this.height);

    app.ctx.fillStyle = 'rgb(255, 255, 255)';
    app.ctx.font = '10px sans-serif';
    app.ctx.fillText(this.register.type + " " + this.register.register, this.padding + 3, this.padding + 11);
  }
  handleMouseDown(app, x, y) {
    return false;
  }
}


/***/ }),

/***/ "./src/timeline_editor/sequence_track.js":
/*!***********************************************!*\
  !*** ./src/timeline_editor/sequence_track.js ***!
  \***********************************************/
/*! exports provided: Range, SequenceTrack */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Range", function() { return Range; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SequenceTrack", function() { return SequenceTrack; });
/* harmony import */ var _sequence_editor_sequence_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sequence_editor/sequence.js */ "./src/sequence_editor/sequence.js");


class Range {
  constructor(start, stop) {
    this.start = start;
    this.stop = stop;
  }
}

class SequenceTrack {
  constructor(target, sequence_def) {
    this.sequence_def = null;
    this.sequence = new _sequence_editor_sequence_js__WEBPACK_IMPORTED_MODULE_0__["Sequence"](target)
    this.sequence.loadFromDefinition(sequence_def);
    this.ranges = [];
  }
  addRange(start, stop) {
    this.ranges.push(new Range(start ? start : 0, stop ? stop : 1000000));
  }
  compile() {
    if (this.sequence) {
      return this.sequence.compile();
    }
    return null;
  }
  draw(app, x, y, w, h) {
    var showBars = 64;
    var pointsInRange = showBars * 4;
    var scaling = w / pointsInRange;
    var barWidth = 4 * scaling;
    for (var r of this.ranges) {
      var colorOffset = 10;
      var width = Math.min((r.stop - r.start) * scaling, w - (r.start * scaling))
      app.ctx.fillStyle = 'rgb(35, 75, ' + (200 - colorOffset) + ', 0.3)';
      app.ctx.strokeStyle = 'rgb(5, 5, ' + (200 - colorOffset) + ', 0.6)';
      app.ctx.fillRect(x + r.start * scaling, y, width, h);
      app.ctx.strokeRect(x + r.start * scaling, y, width, h);
    }
    app.ctx.strokeStyle = 'rgb(70, 70, 70, 0.8)';
    for (var i = 0; i < showBars; i++) {
      app.ctx.strokeRect(x + i * barWidth, y, barWidth, h);
    }
  }
}


/***/ }),

/***/ "./src/timeline_editor/sequence_tracks.js":
/*!************************************************!*\
  !*** ./src/timeline_editor/sequence_tracks.js ***!
  \************************************************/
/*! exports provided: BaseSequenceTracks, ChannelSequenceTracks, RegisterSequenceTracks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseSequenceTracks", function() { return BaseSequenceTracks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChannelSequenceTracks", function() { return ChannelSequenceTracks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterSequenceTracks", function() { return RegisterSequenceTracks; });
/* harmony import */ var _sequence_track_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sequence_track.js */ "./src/timeline_editor/sequence_track.js");
/* harmony import */ var _model___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../model/ */ "./src/model/index.js");



class BaseSequenceTracks {

  constructor(unit, app, padding, panelWidth, height) {
    this.unit = unit;
    this.app = app;
    this.padding = padding;
    this.panelWidth = panelWidth;
    this.height = height;
    this.sequenceTracks = [new _sequence_track_js__WEBPACK_IMPORTED_MODULE_0__["SequenceTrack"]()];
  }

  handleClick() {
    if (this.unit instanceof _model___WEBPACK_IMPORTED_MODULE_1__["Channel"]) {
      this.app.openSequenceEditor(this.sequenceTracks[0].sequence, this.unit.getCompileTarget());
    } else if (this.unit instanceof _model___WEBPACK_IMPORTED_MODULE_1__["Register"]) {
      this.app.openRegisterSequenceEditor(this.sequenceTracks[0].sequence, this.unit);

    }
  }

  draw(app, colorOffset) {
    var height = this.height;
    var padding = this.padding;
    var panelWidth = this.panelWidth;
    var trackWidth = app.canvas.width - panelWidth - padding * 2;

    app.ctx.fillStyle = 'rgb(255, ' + (200 - colorOffset) + ', 0)';
    app.ctx.strokeStyle = 'rgb(40, 40, 40, 1.0)';
    app.ctx.fillRect(padding + panelWidth, padding, trackWidth, height);
    app.ctx.strokeRect(padding + panelWidth, padding, trackWidth, height);

    var trackHeight = height / this.sequenceTracks.length;
    for (var i = 0; i < this.sequenceTracks.length - 1; i++) {
      app.ctx.strokeRect(padding + panelWidth, padding + i * trackHeight, trackWidth, trackHeight);
    }
    for (var i = 0; i < this.sequenceTracks.length; i++) {
      var s = this.sequenceTracks[i];
      s.draw(app, padding + panelWidth, padding + i * trackHeight, trackWidth, trackHeight);
    }

    var showBars = 4;
    var pointsInRange = showBars * 4;
    var scaling = trackWidth / pointsInRange;
    var barWidth = 4 * scaling;
    app.ctx.fillStyle = 'rgb(40, 40, 40)';
    app.ctx.font = '10px mono';
    for (var i = 0; i < showBars; i++) {
      app.ctx.fillText(i + 1, padding + panelWidth + 3 + i * barWidth, padding + height - 3);
    }
  }
  handleMouseDown(app, x, y) {
    var path = new Path2D();
    var width = app.canvas.width - this.padding * 2;
    path.rect(this.panelWidth, 0, width, this.height + this.padding * 2);
    if (app.ctx.isPointInPath(path, x, y)) {
      return this;
    }
    return false;
  }
  compile() {
    return this.unit.compile(this.sequenceTracks);
  }

  initialiseSequenceTracks(sequences) {
    this.sequenceTracks = [];
    for (var s of sequences) {
      var segment = {};
      if (s.after) {
        segment.after = s.after.after;
        if (s.after.sequence.before) {
          segment.before = s.after.sequence.before.before;
        }
      } else if (s.before) {
        segment.before = s.before.before;
        if (s.before.sequence.after) {
          segment.after = s.before.sequence.after.after;
        }
      }
      var track = new _sequence_track_js__WEBPACK_IMPORTED_MODULE_0__["SequenceTrack"](this.unit.getCompileTarget(), s);
      track.addRange(segment.after, segment.before);
      this.sequenceTracks.push(track);
    }
  }
}

class ChannelSequenceTracks extends BaseSequenceTracks {
  constructor(channel, app, padding, panelWidth, height) {
    super(channel, app, padding, panelWidth, height);
  }
}
class RegisterSequenceTracks extends BaseSequenceTracks {
  constructor(register, app, padding, panelWidth, height) {
    super(register, app, padding, panelWidth, height);
  }
}


/***/ }),

/***/ "./src/timeline_editor/track.js":
/*!**************************************!*\
  !*** ./src/timeline_editor/track.js ***!
  \**************************************/
/*! exports provided: BaseTrack, ChannelTrack, RegisterTrack */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseTrack", function() { return BaseTrack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChannelTrack", function() { return ChannelTrack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterTrack", function() { return RegisterTrack; });
/* harmony import */ var _channel_sidebar_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./channel_sidebar.js */ "./src/timeline_editor/channel_sidebar.js");
/* harmony import */ var _register_sidebar_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./register_sidebar.js */ "./src/timeline_editor/register_sidebar.js");
/* harmony import */ var _sequence_tracks_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sequence_tracks.js */ "./src/timeline_editor/sequence_tracks.js");




class BaseTrack {
  constructor(unit) {
    this.unit = unit;
    this.padding = 0;
    this.height = 75;
    this.panelWidth = 90;

    this.sideBar = null;
    this.sequenceTracks = null;
  }

  draw(app) {
    var colorOffset = '#ddd'; 
    this.sideBar.draw(app, colorOffset);
    this.sequenceTracks.draw(app, colorOffset);
  }

  handleMouseDown(app, x, y) {
    if (this.sideBar.handleMouseDown(app, x, y)) {
      return this.sideBar;
    } else if (this.sequenceTracks.handleMouseDown(app, x, y)) {
      return this.sequenceTracks;
    } 
    return false;
  }
  initialiseSequenceTracks(defs) {
    this.sequenceTracks.initialiseSequenceTracks(defs);
  }
  compile() {
    return this.sequenceTracks.compile();
  }
}
class ChannelTrack extends BaseTrack {
  constructor(channel, app) {
    super(channel);
    this.sideBar = new _channel_sidebar_js__WEBPACK_IMPORTED_MODULE_0__["ChannelSideBar"](channel, app, this.padding, this.panelWidth, this.height);
    this.sequenceTracks = new _sequence_tracks_js__WEBPACK_IMPORTED_MODULE_2__["ChannelSequenceTracks"](channel, app, this.padding, this.panelWidth, this.height);
  }
}
class RegisterTrack extends BaseTrack {
  constructor(register, app) {
    super(register);
    this.sideBar = new _register_sidebar_js__WEBPACK_IMPORTED_MODULE_1__["RegisterSideBar"](register, app, this.padding, this.panelWidth, this.height);
    this.sequenceTracks = new _sequence_tracks_js__WEBPACK_IMPORTED_MODULE_2__["RegisterSequenceTracks"](register, app, this.padding, this.panelWidth, this.height);
  }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwaS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9idXR0b24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvZGlhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9lZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL21vZHVsZV91bml0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3BhdGNoLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NvY2tldC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5zdHJ1bWVudF9lZGl0b3IvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luc3RydW1lbnRfZWRpdG9yL2luc3RydW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luc3RydW1lbnRfZWRpdG9yL21vZHVsZV91bml0cy9jaGFubmVsX2lucHV0LmpzIiwid2VicGFjazovLy8uL3NyYy9pbnN0cnVtZW50X2VkaXRvci9tb2R1bGVfdW5pdHMvY2hhbm5lbF9vdXRwdXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luc3RydW1lbnRfZWRpdG9yL21vZHVsZV91bml0cy9mYWN0b3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9pbnN0cnVtZW50X2VkaXRvci9tb2R1bGVfdW5pdHMvZmlsdGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9pbnN0cnVtZW50X2VkaXRvci9tb2R1bGVfdW5pdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luc3RydW1lbnRfZWRpdG9yL21vZHVsZV91bml0cy9wYW5uaW5nLmpzIiwid2VicGFjazovLy8uL3NyYy9pbnN0cnVtZW50X2VkaXRvci9tb2R1bGVfdW5pdHMvc2FtcGxlX2dlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5zdHJ1bWVudF9lZGl0b3IvbW9kdWxlX3VuaXRzL3RyYW5zcG9zZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL3BhdGNoYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kZWwvcmVnaXN0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL3R5cGVzLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXF1ZW5jZV9lZGl0b3IvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcXVlbmNlX2VkaXRvci9tb2R1bGVfdW5pdHMvY3ljbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcXVlbmNlX2VkaXRvci9tb2R1bGVfdW5pdHMvY3ljbGVfY2hvcmRzLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXF1ZW5jZV9lZGl0b3IvbW9kdWxlX3VuaXRzL2V1Y2xpZGlhbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VxdWVuY2VfZWRpdG9yL21vZHVsZV91bml0cy9mYWN0b3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9zZXF1ZW5jZV9lZGl0b3IvbW9kdWxlX3VuaXRzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9zZXF1ZW5jZV9lZGl0b3IvbW9kdWxlX3VuaXRzL29mZnNldC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VxdWVuY2VfZWRpdG9yL21vZHVsZV91bml0cy9wbGF5X25vdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcXVlbmNlX2VkaXRvci9tb2R1bGVfdW5pdHMvcGxheV9ub3Rlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VxdWVuY2VfZWRpdG9yL21vZHVsZV91bml0cy9wdWxzZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VxdWVuY2VfZWRpdG9yL21vZHVsZV91bml0cy9yYW5kb20uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcXVlbmNlX2VkaXRvci9tb2R1bGVfdW5pdHMvcmFuZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcXVlbmNlX2VkaXRvci9tb2R1bGVfdW5pdHMvcmVnaXN0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcXVlbmNlX2VkaXRvci9tb2R1bGVfdW5pdHMvcmVnaXN0ZXJfaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcXVlbmNlX2VkaXRvci9tb2R1bGVfdW5pdHMvcmVnaXN0ZXJfb3V0cHV0LmpzIiwid2VicGFjazovLy8uL3NyYy9zZXF1ZW5jZV9lZGl0b3IvbW9kdWxlX3VuaXRzL3NlcXVlbmNlX2lucHV0LmpzIiwid2VicGFjazovLy8uL3NyYy9zZXF1ZW5jZV9lZGl0b3IvbW9kdWxlX3VuaXRzL3RyYW5zcG9zZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VxdWVuY2VfZWRpdG9yL3NlcXVlbmNlLmpzIiwid2VicGFjazovLy8uL3NyYy90aGVtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdGltZWxpbmVfZWRpdG9yL2NoYW5uZWxfc2lkZWJhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdGltZWxpbmVfZWRpdG9yL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy90aW1lbGluZV9lZGl0b3IvcmVnaXN0ZXJfc2lkZWJhci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdGltZWxpbmVfZWRpdG9yL3NlcXVlbmNlX3RyYWNrLmpzIiwid2VicGFjazovLy8uL3NyYy90aW1lbGluZV9lZGl0b3Ivc2VxdWVuY2VfdHJhY2tzLmpzIiwid2VicGFjazovLy8uL3NyYy90aW1lbGluZV9lZGl0b3IvdHJhY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPOztBQUVQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQiwyQkFBMkI7QUFDckQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcERPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQOzs7Ozs7Ozs7Ozs7O0FDMUNBO0FBQUE7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDMURBO0FBQUE7QUFBQTtBQUFBO0FBQWtEO0FBQ2I7O0FBRTlCO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsc0RBQVc7QUFDckIsVUFBVSxpREFBTTtBQUNoQixVQUFVLGlEQUFNO0FBQ2hCLFVBQVUsaURBQU07QUFDaEIsVUFBVSxpREFBTTtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxpREFBTTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNqSkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBaUM7QUFDK0I7QUFDZDtBQUNmO0FBQ0U7QUFDUztBQUNUOzs7Ozs7Ozs7Ozs7O0FDTnJDO0FBQUE7QUFBQTtBQUFBO0FBQXFDO0FBQ0o7O0FBRTFCO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsaURBQU07QUFDM0I7QUFDQSxLQUFLLHVCQUF1Qiw2Q0FBSTtBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsaURBQU07QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3REQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNyREE7QUFBQTtBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDNUNBO0FBQUE7QUFBQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzlFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtB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QUFzQjtBQUNwRDtBQUNBIiwiZmlsZSI6ImJsZWVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi5qc1wiKTtcbiIsIlxuY29uc3QgVGVzdE1lc3NhZ2UgPSBcInRlc3RcIjtcbmNvbnN0IFN0YXR1c01lc3NhZ2UgPSBcInN0YXR1c1wiO1xuY29uc3QgQ2hhbm5lbERlZk1lc3NhZ2UgPSBcImNoYW5uZWxfZGVmXCI7XG5jb25zdCBTZXF1ZW5jZXJEZWZNZXNzYWdlID0gXCJzZXF1ZW5jZXJfZGVmXCI7XG5jb25zdCBTZXRTZXF1ZW5jZXJEZWZNZXNzYWdlID0gXCJzZXRfc2VxdWVuY2VyX2RlZlwiO1xuXG5leHBvcnQgY2xhc3MgQVBJIHtcblxuICBjb25zdHJ1Y3RvcihhcHApIHtcbiAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICB0aGlzLnNvY2tldCA9IG51bGw7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB2YXIgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vbG9jYWxob3N0OjEwMDAwL3dzXCIpO1xuICAgIHNvY2tldC5vbm9wZW4gPSAoKGUpID0+IHtcbiAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgdGhpcy5zZW5kRGF0YShDaGFubmVsRGVmTWVzc2FnZSwgXCJ0ZXN0XCIpO1xuICAgIH0pLmJpbmQodGhpcylcbiAgICBzb2NrZXQub25tZXNzYWdlID0gdGhpcy5oYW5kbGVNZXNzYWdlUmVjZWl2ZWQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZU1lc3NhZ2VSZWNlaXZlZChtZXNzYWdlKSB7XG4gICAgY29uc29sZS5sb2cobWVzc2FnZSlcbiAgICB2YXIgbXNnID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuICAgIGlmIChtc2cudHlwZSA9PT0gQ2hhbm5lbERlZk1lc3NhZ2UpIHtcbiAgICAgIHRoaXMuYXBwLmluaXRpYWxpc2VDaGFubmVscyhtc2cuZGF0YSk7XG4gICAgfSBlbHNlIGlmIChtc2cudHlwZSA9PT0gU2VxdWVuY2VyRGVmTWVzc2FnZSkge1xuICAgICAgdGhpcy5hcHAuaW5pdGlhbGlzZVNlcXVlbmNlVHJhY2tzKG1zZy5kYXRhKTtcbiAgICB9XG4gIH1cbiAgcmVxdWVzdFNlcXVlbmNlckRlZigpIHtcbiAgICB0aGlzLnNlbmREYXRhKFNlcXVlbmNlckRlZk1lc3NhZ2UsIG51bGwpO1xuICB9XG4gIHNldFNlcXVlbmNlckRlZihkZWYpIHtcbiAgICB0aGlzLnNlbmREYXRhKFNldFNlcXVlbmNlckRlZk1lc3NhZ2UsIEpTT04uc3RyaW5naWZ5KGRlZikpO1xuICB9XG5cbiAgc2VuZERhdGEodHlwZSwgZGF0YSkge1xuICAgIHJldHVybiB0aGlzLnNlbmRKU09OKHtcInR5cGVcIjogdHlwZSwgXCJkYXRhXCI6IGRhdGF9KTtcbiAgfVxuXG4gIHNlbmRKU09OKG9iaikge1xuICAgIHJldHVybiB0aGlzLnNlbmRNZXNzYWdlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICB9XG5cbiAgc2VuZE1lc3NhZ2UobWVzc2FnZSkge1xuICAgIGlmICh0aGlzLnNvY2tldCkge1xuICAgICAgdGhpcy5zb2NrZXQuc2VuZChtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxufVxuIiwiXG5leHBvcnQgY2xhc3MgQnV0dG9uIHtcbiAgY29uc3RydWN0b3IoeCwgeSwgb25DbGljaywgbGFiZWwpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy53ID0gMjU7XG4gICAgdGhpcy5oID0gMjU7XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IG9uQ2xpY2s7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMuY29sb3VyID0gbnVsbDtcbiAgICBpZiAodGhpcy5sYWJlbCkge1xuICAgICAgdGhpcy53ID0gMzU7XG4gICAgfVxuICB9XG4gIGRyYXcoYXBwKSB7XG4gICAgdmFyIHcgPSB0aGlzLnc7XG4gICAgdmFyIGggPSB0aGlzLmg7XG4gICAgYXBwLmN0eC5zYXZlKCk7XG4gICAgYXBwLmN0eC5maWxsU3R5bGUgPSBhcHAudGhlbWUuY29sb3Vycy5CdXR0b247XG4gICAgaWYgKHRoaXMuY29sb3VyKSB7XG4gICAgICBhcHAuY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3VyO1xuICAgIH1cbiAgICBhcHAuY3R4LnN0cm9rZVN0eWxlID0gYXBwLnRoZW1lLmNvbG91cnMuT3V0bGluZUNvbG91cjtcbiAgICBhcHAuY3R4LmxpbmVXaWR0aCA9IDE7XG4gICAgYXBwLmN0eC5maWxsUmVjdCh0aGlzLngsIHRoaXMueSwgdywgaCk7XG4gICAgYXBwLmN0eC5zdHJva2VSZWN0KHRoaXMueCwgdGhpcy55LCB3LCBoKTtcbiAgICBpZiAodGhpcy5sYWJlbCkge1xuICAgICAgYXBwLmN0eC5mb250ID0gJzEwcHggbW9ubyc7XG4gICAgICBhcHAuY3R4LmZpbGxTdHlsZSA9IGFwcC50aGVtZS5jb2xvdXJzLkJ1dHRvblRleHQ7XG4gICAgICBhcHAuY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgICBhcHAuY3R4LmZpbGxUZXh0KHRoaXMubGFiZWwsIHRoaXMueCArIHcgLyAyLCB0aGlzLnkgKyAxNSk7XG4gICAgfVxuICAgIGFwcC5jdHgucmVzdG9yZSgpO1xuICB9XG4gIGhhbmRsZU1vdXNlRG93bihhcHAsIHgsIHkpIHtcbiAgICBpZiAoeCA+PSB0aGlzLnggJiYgeCA8PSB0aGlzLnggKyB0aGlzLncgJiYgeSA+PSB0aGlzLnkgJiYgeSA8PSB0aGlzLnkgKyB0aGlzLmgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2xvc2VCdXR0b24gZXh0ZW5kcyBCdXR0b24ge1xufVxuIiwiZXhwb3J0IGNsYXNzIERpYWwge1xuICBjb25zdHJ1Y3Rvcih4LCB5LCBsYWJlbCwgbWluLCBtYXgsIGN1cnJlbnQpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMucmFkaXVzID0gMTU7XG4gICAgdGhpcy5taW4gPSBtaW47XG4gICAgdGhpcy5tYXggPSBtYXg7XG4gICAgdGhpcy52YWx1ZSA9IGN1cnJlbnQ7XG4gIH1cbiAgZHJhdyhhcHApIHtcblxuICAgIC8vIERyYXcgZGlhbFxuICAgIGFwcC5jdHguZmlsbFN0eWxlID0gYXBwLnRoZW1lLmNvbG91cnMuRGlhbDtcbiAgICBhcHAuY3R4LmJlZ2luUGF0aCgpO1xuICAgIGFwcC5jdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xuICAgIGFwcC5jdHguZmlsbCgpO1xuICAgIGFwcC5jdHguY2xvc2VQYXRoKCk7XG5cbiAgICB2YXIgcmFuZ2UgPSB0aGlzLm1heCAtIHRoaXMubWluO1xuICAgIHZhciB0YXUgPSAyICogTWF0aC5QSVxuICAgIHZhciB2YWx1ZSA9IHRhdSAtICh0YXUgKiAodGhpcy52YWx1ZSAtIHRoaXMubWluKSAvIHJhbmdlKVxuICAgIGFwcC5jdHguYmVnaW5QYXRoKCk7XG4gICAgdmFyIGR4ID0gTWF0aC5zaW4odmFsdWUpICogdGhpcy5yYWRpdXM7XG4gICAgdmFyIGR5ID0gTWF0aC5jb3ModmFsdWUpICogdGhpcy5yYWRpdXM7XG4gICAgYXBwLmN0eC5zdHJva2VTdHlsZSA9IGFwcC50aGVtZS5jb2xvdXJzLkRpYWxMaW5lO1xuICAgIGFwcC5jdHgubGluZVdpZHRoID0gMjtcbiAgICBhcHAuY3R4Lm1vdmVUbyh0aGlzLngsIHRoaXMueSk7XG4gICAgYXBwLmN0eC5saW5lVG8odGhpcy54ICsgZHgsIHRoaXMueSArIGR5KTtcbiAgICBhcHAuY3R4LnN0cm9rZSgpO1xuICAgIGFwcC5jdHgubGluZVdpZHRoID0gMTtcblxuICAgIC8vIERyYXcgbGFiZWxcbiAgICBhcHAuY3R4LmZpbGxTdHlsZSA9IGFwcC50aGVtZS5jb2xvdXJzLk1vZHVsZVRleHQ7XG4gICAgYXBwLmN0eC5mb250ID0gJzEwcHggbW9ubyc7XG4gICAgdmFyIGNlbnRlclggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnkgLSB0aGlzLnJhZGl1cyAtIDM7XG4gICAgYXBwLmN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuICAgIGFwcC5jdHguZmlsbFRleHQodGhpcy5sYWJlbCwgY2VudGVyWCwgeSk7XG5cbiAgICAvLyBEcmF3IHZhbHVlXG4gICAgYXBwLmN0eC5maWxsVGV4dCh0aGlzLnZhbHVlLnRvRml4ZWQoMiksIGNlbnRlclgsIHRoaXMueSArIHRoaXMucmFkaXVzICsgMTIpO1xuICB9XG4gIGhhbmRsZU1vdXNlRG93bihhcHAsIHgsIHkpIHtcbiAgICBpZiAoeCA+PSB0aGlzLnggLSB0aGlzLnJhZGl1cyAmJiB4IDw9IHRoaXMueCArIHRoaXMucmFkaXVzICYmIHkgPj0gdGhpcy55IC0gdGhpcy5yYWRpdXMgJiYgeSA8PSB0aGlzLnJhZGl1cyArIHRoaXMueSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XG4gIGhhbmRsZURyYWcoYXBwLCBkeCwgZHksIHgsIHkpIHtcbiAgICBkeCA9IHggLSB0aGlzLng7XG4gICAgZHkgPSB5IC0gdGhpcy55O1xuICAgIHZhciBzaW4gPSBkeSAvIE1hdGguc3FydChkeSAqIGR5ICsgZHggKiBkeClcbiAgICB2YXIgc2NhbGVkQ29zID0gMS4wIC0gKHNpbiArIDEpIC8gMjtcbiAgICB2YXIgcmFuZ2UgPSB0aGlzLm1heCAtIHRoaXMubWluO1xuICAgIHRoaXMudmFsdWUgPSByYW5nZSAqIHNjYWxlZENvcyArIHRoaXMubWluO1xuICAgIGFwcC51cGxvYWRTZXF1ZW5jZXJEZWYoKTtcbiAgICBhcHAuZHJhdygpO1xuICB9XG59XG5cbiIsImltcG9ydCB7IENsb3NlQnV0dG9uLCBCdXR0b24gfSBmcm9tICcuL2J1dHRvbi5qcyc7XG5pbXBvcnQgeyBNb2R1bGUgfSBmcm9tICcuL21vZHVsZS5qcyc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcihhcHAsIHRhcmdldCwgaGFuZGxlQ2xvc2UpIHtcbiAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICB0aGlzLnBhZGRpbmcgPSBhcHAudGhlbWUucGFkZGluZztcbiAgICB0aGlzLnNjYWxlID0gMS4wXG4gICAgdGhpcy5zaG93Q29tcGlsZSA9IHRydWU7XG4gICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy5idXR0b25zID0gW1xuICAgICAgbmV3IENsb3NlQnV0dG9uKDEwLCAxMCwgaGFuZGxlQ2xvc2UsIFwiWFwiKSxcbiAgICAgIG5ldyBCdXR0b24oMTAsIDEwLCB0aGlzLmhhbmRsZVNob3dDb21waWxlLmJpbmQodGhpcyksIFwiSlNPTlwiKSxcbiAgICAgIG5ldyBCdXR0b24oMTAsIDEwLCB0aGlzLmhhbmRsZVpvb21Jbi5iaW5kKHRoaXMpLCBcIitcIiksXG4gICAgICBuZXcgQnV0dG9uKDEwLCAxMCwgdGhpcy5oYW5kbGVab29tT3V0LmJpbmQodGhpcyksIFwiLVwiKSxcbiAgICAgIG5ldyBCdXR0b24oMTAsIDEwLCB0aGlzLmhhbmRsZVVwbG9hZC5iaW5kKHRoaXMpLCBcIj4+PlwiKSxcbiAgICBdO1xuICB9XG4gIGhhbmRsZUFkZFVuaXQoY29uc3RydWN0b3IpIHtcbiAgICB2YXIgZyA9IGNvbnN0cnVjdG9yKClcbiAgICB0aGlzLnRhcmdldC5tb2R1bGVzLnB1c2gobmV3IE1vZHVsZSh0aGlzLnRhcmdldCwgTWF0aC5yYW5kb20oKSAqIDcwMCwgTWF0aC5yYW5kb20oKSAqIDYwMCwgZykpO1xuICAgIHRoaXMuYXBwLmRyYXcoKTtcbiAgfVxuICBoYW5kbGVab29tSW4oKSB7XG4gICAgdGhpcy5zY2FsZSArPSAuMVxuICAgIHRoaXMuYXBwLmRyYXcoKTtcbiAgfVxuICBoYW5kbGVab29tT3V0KCkge1xuICAgIHRoaXMuc2NhbGUgLT0gLjE7XG4gICAgdGhpcy5hcHAuZHJhdygpO1xuICB9XG4gIGhhbmRsZURyYWcoYXBwLCBkeCwgZHksIHgsIHkpIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZC5oYW5kbGVEcmFnKGFwcCwgZHgsIGR5LCB4LCB5KTtcbiAgICB9XG4gIH1cbiAgaGFuZGxlRHJvcChhcHAsIHgsIHkpIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZC5oYW5kbGVEcm9wKGFwcCwgeCAtIHRoaXMucGFkZGluZywgeSAtIHRoaXMucGFkZGluZyk7XG4gICAgfVxuICB9XG4gIGhhbmRsZVNob3dDb21waWxlKCkge1xuICAgIHRoaXMuc2hvd0NvbXBpbGUgPSAhdGhpcy5zaG93Q29tcGlsZTtcbiAgICB0aGlzLmFwcC5kcmF3KCk7XG4gIH1cbiAgaGFuZGxlVXBsb2FkKCkge1xuICAgIHRoaXMuYXBwLnVwbG9hZFNlcXVlbmNlckRlZigpO1xuICB9XG4gIGhhbmRsZU1vdXNlRG93bihhcHAsIHgsIHkpIHtcbiAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcbiAgICBmb3IgKHZhciBiIG9mIHRoaXMuYnV0dG9ucykge1xuICAgICAgdmFyIHYgPSBiLmhhbmRsZU1vdXNlRG93bihhcHAsIHgsIHkpO1xuICAgICAgaWYgKHYpIHtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIG0gb2YgdGhpcy50YXJnZXQubW9kdWxlcykge1xuICAgICAgdmFyIHYgPSBtLmhhbmRsZU1vdXNlRG93bihhcHAsIHggLSB0aGlzLnBhZGRpbmcsIHkgLSB0aGlzLnBhZGRpbmcpO1xuICAgICAgaWYgKHYpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHY7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBkcmF3KGFwcCkge1xuICAgIHZhciB3ID0gYXBwLmNhbnZhcy53aWR0aCAtIDIgKiB0aGlzLnBhZGRpbmc7XG4gICAgdmFyIGggPSBhcHAuY2FudmFzLmhlaWdodCAtIDIgKiB0aGlzLnBhZGRpbmc7XG4gICAgdGhpcy5idXR0b25zWzBdLnggPSB3IC0gdGhpcy5idXR0b25zWzBdLncgKyB0aGlzLnBhZGRpbmc7XG4gICAgdGhpcy5idXR0b25zWzBdLnkgPSB0aGlzLnBhZGRpbmc7XG4gICAgdGhpcy5idXR0b25zWzFdLnggPSB3IC0gdGhpcy5idXR0b25zWzFdLncgKyB0aGlzLnBhZGRpbmc7XG4gICAgdGhpcy5idXR0b25zWzFdLnkgPSB0aGlzLnBhZGRpbmcgKyAyNTtcbiAgICB0aGlzLmJ1dHRvbnNbMl0ueCA9IHcgLSB0aGlzLmJ1dHRvbnNbMl0udyArIHRoaXMucGFkZGluZztcbiAgICB0aGlzLmJ1dHRvbnNbMl0ueSA9IHRoaXMucGFkZGluZyArIDUwO1xuICAgIHRoaXMuYnV0dG9uc1szXS54ID0gdyAtIHRoaXMuYnV0dG9uc1szXS53ICsgdGhpcy5wYWRkaW5nO1xuICAgIHRoaXMuYnV0dG9uc1szXS55ID0gdGhpcy5wYWRkaW5nICsgNzU7XG4gICAgdGhpcy5idXR0b25zWzRdLnggPSB3IC0gdGhpcy5idXR0b25zWzRdLncgKyB0aGlzLnBhZGRpbmc7XG4gICAgdGhpcy5idXR0b25zWzRdLnkgPSB0aGlzLnBhZGRpbmcgKyAxMDA7XG4gICAgYXBwLmN0eC5zYXZlKCk7XG4gICAgYXBwLmN0eC5saW5lV2lkdGggPSAxO1xuICAgIFxuICAgIC8vIERyYXcgdGhlIGJhY2tncm91bmRcbiAgICBhcHAuY3R4LmZpbGxTdHlsZSA9IGFwcC50aGVtZS5jb2xvdXJzLkluc3RydW1lbnRFZGl0b3JCYWNrZ3JvdW5kO1xuICAgIGFwcC5jdHguc3Ryb2tlU3R5bGUgPSBhcHAudGhlbWUuY29sb3Vycy5PdXRsaW5lQ29sb3VyO1xuICAgIGFwcC5jdHguZmlsbFJlY3QodGhpcy5wYWRkaW5nLCB0aGlzLnBhZGRpbmcsIHcsIGgpO1xuXG4gICAgLy8gRHJhdyB0aGUgYnV0dG9ucyBcbiAgICBmb3IgKHZhciBiIG9mIHRoaXMuYnV0dG9ucykge1xuICAgICAgYi5kcmF3KGFwcCk7XG4gICAgfVxuXG4gICAgLy8gRHJhdyB0aGUgY29tcGlsZWQgZ2VuZXJhdG9yIEpTT05cbiAgICBpZiAodGhpcy5zaG93Q29tcGlsZSkge1xuICAgICAgdmFyIHR4dCA9IEpTT04uc3RyaW5naWZ5KHRoaXMudGFyZ2V0LmNvbXBpbGUoKSwgbnVsbCwgMik7XG4gICAgICB2YXIgbGluZU5yID0gMDtcbiAgICAgIGFwcC5jdHguZmlsbFN0eWxlID0gYXBwLnRoZW1lLmNvbG91cnMuTW9kdWxlVGV4dDtcbiAgICAgIGFwcC5jdHgudGV4dEFsaWduID0gXCJzdGFydFwiO1xuICAgICAgZm9yICh2YXIgbGluZSBvZiB0eHQuc3BsaXQoXCJcXG5cIikpIHtcbiAgICAgICAgYXBwLmN0eC5maWxsVGV4dChsaW5lLCB3IC0gMzAwLCA5MCArIGxpbmVOciAqIDEyKTtcbiAgICAgICAgbGluZU5yKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRHJhdyB0aGUgbW9kdWxlc1xuICAgIGZvciAodmFyIG0gb2YgdGhpcy50YXJnZXQubW9kdWxlcykge1xuICAgICAgYXBwLmN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7IC8vIHJlc2V0IHRyYW5zbGF0ZVxuICAgICAgYXBwLmN0eC5zY2FsZSh0aGlzLnNjYWxlLCB0aGlzLnNjYWxlKTtcbiAgICAgIGFwcC5jdHgudHJhbnNsYXRlKHRoaXMucGFkZGluZywgdGhpcy5wYWRkaW5nKTtcbiAgICAgIG0uZHJhdyhhcHApO1xuICAgIH1cbiAgICBhcHAuY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTsgLy8gcmVzZXQgdHJhbnNsYXRlXG4gICAgYXBwLmN0eC5zY2FsZSh0aGlzLnNjYWxlLCB0aGlzLnNjYWxlKTtcblxuXG4gICAgYXBwLmN0eC5maWxsU3R5bGUgPSBhcHAudGhlbWUuY29sb3Vycy5QYXRjaDtcbiAgICBhcHAuY3R4LnN0cm9rZVN0eWxlID0gYXBwLnRoZW1lLmNvbG91cnMuUGF0Y2g7XG5cbiAgICAvLyBEcmF3IHRoZSBwYXRjaGVzXG4gICAgZm9yICh2YXIgcCBvZiB0aGlzLnRhcmdldC5wYXRjaGVzKSB7XG4gICAgICB2YXIgZnJvbU1vZCA9IHRoaXMudGFyZ2V0Lm1vZHVsZXNbcC5mcm9tXTtcbiAgICAgIHZhciB0b01vZCA9IHRoaXMudGFyZ2V0Lm1vZHVsZXNbcC50b107XG4gICAgICB2YXIgZnJvbVNvY2tldCA9IHAuZ2V0RnJvbVNvY2tldChmcm9tTW9kKTtcbiAgICAgIHZhciB0b1NvY2tldCA9IHAuZ2V0VG9Tb2NrZXQodG9Nb2QpO1xuICAgICAgdmFyIGZyb21YID0gdGhpcy5wYWRkaW5nICsgZnJvbU1vZC54ICsgZnJvbVNvY2tldC54O1xuICAgICAgdmFyIGZyb21ZID0gdGhpcy5wYWRkaW5nICsgZnJvbU1vZC55ICsgZnJvbVNvY2tldC55O1xuICAgICAgdmFyIHRvWCA9IHRoaXMucGFkZGluZyArIHRvTW9kLnggKyB0b1NvY2tldC54O1xuICAgICAgdmFyIHRvWSA9IHRoaXMucGFkZGluZyArIHRvTW9kLnkgKyB0b1NvY2tldC55O1xuICAgICAgdmFyIHBvaW50T2Zmc2V0ID0gNzA7XG5cbiAgICAgIGFwcC5jdHguc3Ryb2tlU3R5bGUgPSBwLmdldENvbG9yKGFwcC50aGVtZSk7XG4gICAgICBhcHAuY3R4LmxpbmVXaWR0aCA9IDQ7XG4gICAgICBhcHAuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgYXBwLmN0eC5tb3ZlVG8oZnJvbVgsIGZyb21ZKTtcbiAgICAgIGFwcC5jdHguYmV6aWVyQ3VydmVUbyhcbiAgICAgICAgZnJvbVgsIFxuICAgICAgICBmcm9tWSArIHBvaW50T2Zmc2V0LCBcbiAgICAgICAgdG9YLCBcbiAgICAgICAgdG9ZICsgcG9pbnRPZmZzZXQsIFxuICAgICAgICB0b1gsIFxuICAgICAgICB0b1kpO1xuICAgICAgYXBwLmN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBhcHAuY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiZXhwb3J0IHsgRGlhbCB9IGZyb20gJy4vZGlhbC5qcyc7XG5leHBvcnQgeyBTb2NrZXQsIElucHV0U29ja2V0LCBPdXRwdXRTb2NrZXQgfSBmcm9tICcuL3NvY2tldC5qcyc7XG5leHBvcnQgeyBCdXR0b24sIENsb3NlQnV0dG9uIH0gZnJvbSAnLi9idXR0b24uanMnO1xuZXhwb3J0IHsgUGF0Y2ggfSBmcm9tICcuL3BhdGNoLmpzJztcbmV4cG9ydCB7IE1vZHVsZSB9IGZyb20gJy4vbW9kdWxlLmpzJztcbmV4cG9ydCB7IE1vZHVsZVVuaXQgfSBmcm9tICcuL21vZHVsZV91bml0LmpzJztcbmV4cG9ydCB7IEVkaXRvciB9IGZyb20gJy4vZWRpdG9yLmpzJztcbiIsImltcG9ydCB7IFNvY2tldCB9IGZyb20gJy4vc29ja2V0LmpzJztcbmltcG9ydCB7IERpYWwgfSBmcm9tICcuL2RpYWwuanMnO1xuXG5leHBvcnQgY2xhc3MgTW9kdWxlIHtcbiAgY29uc3RydWN0b3IodGFyZ2V0LCB4LCB5LCB1bml0KSB7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMudW5pdCA9IHVuaXQ7XG4gICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XG4gIH1cbiAgZHJhdyhhcHApIHtcbiAgICBhcHAuY3R4LnRyYW5zbGF0ZSh0aGlzLngsIHRoaXMueSk7XG4gICAgdGhpcy51bml0LmRyYXcoYXBwKTtcbiAgfVxuICBoYW5kbGVNb3VzZURvd24oYXBwLCB4LCB5KSB7XG4gICAgdGhpcy5zZWxlY3RlZCA9IG51bGw7XG4gICAgdmFyIHYgPSB0aGlzLnVuaXQuaGFuZGxlTW91c2VEb3duKGFwcCwgeCAtIHRoaXMueCwgeSAtIHRoaXMueSk7XG4gICAgaWYgKCF2KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWQgPSB2O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGhhbmRsZURyYWcoYXBwLCBkeCwgZHksIHgsIHkpIHtcbiAgICB2YXIgdiA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgaWYgKHYgaW5zdGFuY2VvZiBTb2NrZXQpIHtcbiAgICAgIHYuaGFuZGxlRHJhZyhhcHAsIGR4LCBkeSwgeCwgeSk7XG4gICAgfSBlbHNlIGlmICh2IGluc3RhbmNlb2YgRGlhbCkge1xuICAgICAgdi5oYW5kbGVEcmFnKGFwcCwgZHgsIGR5LCB4IC0gdGhpcy54LCB5IC0gdGhpcy55KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54ICs9IGR4O1xuICAgICAgdGhpcy55ICs9IGR5O1xuICAgIH1cbiAgfVxuICBoYW5kbGVEcm9wKGFwcCwgeCwgeSkge1xuICAgIHZhciB2ID0gdGhpcy5zZWxlY3RlZDtcbiAgICBpZiAodiBpbnN0YW5jZW9mIFNvY2tldCkge1xuICAgICAgZm9yICh2YXIgbW9kdWxlIG9mIHRoaXMudGFyZ2V0Lm1vZHVsZXMpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IG9mIE9iamVjdC5rZXlzKG1vZHVsZS51bml0LnNvY2tldHMpKSB7XG4gICAgICAgICAgdmFyIHMgPSBtb2R1bGUudW5pdC5zb2NrZXRzW2tleV07XG4gICAgICAgICAgdmFyIHN4ID0geCAtIG1vZHVsZS54O1xuICAgICAgICAgIHZhciBzeSA9IHkgLSBtb2R1bGUueTtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gcy5oYW5kbGVNb3VzZURvd24oYXBwLCBzeCwgc3kpO1xuICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LmFkZFBhdGNoKHRoaXMsIG1vZHVsZSwgdi5sYWJlbCwgcmVzdWx0LmxhYmVsKTtcbiAgICAgICAgICAgIGFwcC5kcmF3KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgTW9kdWxlVW5pdCB7XG4gIGNvbnN0cnVjdG9yKHR5cGUpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMudyA9IDE1MDtcbiAgICB0aGlzLmggPSAxNTA7XG4gICAgdGhpcy5zb2NrZXRzID0ge307XG4gICAgdGhpcy5kaWFscyA9IHt9O1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IFwiXCI7XG4gIH1cbiAgZHJhdyhhcHApIHtcbiAgICB2YXIgdyA9IHRoaXMudztcbiAgICB2YXIgaCA9IHRoaXMuaDtcbiAgICBhcHAuY3R4LmZpbGxTdHlsZSA9IGFwcC50aGVtZS5jb2xvdXJzW3RoaXMuYmFja2dyb3VuZF07XG4gICAgYXBwLmN0eC5zdHJva2VTdHlsZSA9IGFwcC50aGVtZS5jb2xvdXJzLk1vZHVsZU91dGxpbmU7XG4gICAgYXBwLmN0eC5maWxsUmVjdCgwLCAwLCB3LCBoKTtcbiAgICBhcHAuY3R4LnN0cm9rZVJlY3QoMCwgMCwgdywgaCk7XG4gICAgYXBwLmN0eC5maWxsU3R5bGUgPSBhcHAudGhlbWUuY29sb3Vycy5Nb2R1bGVUZXh0O1xuICAgIGFwcC5jdHguZm9udCA9ICcxNHB4IG1vbm8nO1xuICAgIGFwcC5jdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICBhcHAuY3R4LmZpbGxUZXh0KHRoaXMudHlwZSwgdyAvIDIsIDE0KTtcbiAgICBmb3IgKHZhciBvIG9mIE9iamVjdC5rZXlzKHRoaXMuc29ja2V0cykpIHtcbiAgICAgIHRoaXMuc29ja2V0c1tvXS5kcmF3KGFwcCk7XG4gICAgfVxuICAgIGZvciAodmFyIG8gb2YgT2JqZWN0LmtleXModGhpcy5kaWFscykpIHtcbiAgICAgIHRoaXMuZGlhbHNbb10uZHJhdyhhcHApO1xuICAgIH1cbiAgfVxuICBoYW5kbGVNb3VzZURvd24oYXBwLCB4LCB5KSB7XG4gICAgZm9yICh2YXIgbyBvZiBPYmplY3Qua2V5cyh0aGlzLnNvY2tldHMpKSB7XG4gICAgICB2YXIgdiA9IHRoaXMuc29ja2V0c1tvXS5oYW5kbGVNb3VzZURvd24oYXBwLCB4LCB5KTtcbiAgICAgIGlmICh2KSB7XG4gICAgICAgIHJldHVybiB2O1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBvIG9mIE9iamVjdC5rZXlzKHRoaXMuZGlhbHMpKSB7XG4gICAgICB2YXIgdiA9IHRoaXMuZGlhbHNbb10uaGFuZGxlTW91c2VEb3duKGFwcCwgeCwgeSk7XG4gICAgICBpZiAodikge1xuICAgICAgICByZXR1cm4gdjtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHBhdGggPSBuZXcgUGF0aDJEKCk7XG4gICAgcGF0aC5yZWN0KDAsIDAsIHRoaXMudywgdGhpcy5oKTtcbiAgICBpZiAoYXBwLmN0eC5pc1BvaW50SW5QYXRoKHBhdGgsIHgsIHkpKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cblxuICAvLyBjb25uZWN0aW9ucyBpcyBhIHt9IG1hcHBpbmcgdGhpcyB1bml0J3MgaW5wdXQgc29ja2V0IElEcyBcbiAgLy8gdG8gYSBsaXN0IG9mIGNvbm5lY3RlZCB1bml0cy5cbiAgLy9cbiAgY29tcGlsZShjb25uZWN0aW9ucykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbiIsImV4cG9ydCBjbGFzcyBQYXRjaCB7XG4gIGNvbnN0cnVjdG9yKGZyb21Nb2R1bGUsIHRvTW9kdWxlLCBmcm9tU29ja2V0LCB0b1NvY2tldCwgdHlwZSkge1xuICAgIHRoaXMuZnJvbSA9IGZyb21Nb2R1bGU7XG4gICAgdGhpcy50byA9IHRvTW9kdWxlO1xuICAgIHRoaXMuZnJvbVNvY2tldCA9IGZyb21Tb2NrZXQ7XG4gICAgdGhpcy50b1NvY2tldCA9IHRvU29ja2V0O1xuICAgIGlmICghdHlwZSkge1xuICAgICAgdGhyb3cgJ01pc3NpbmcgdHlwZSBpbiBQYXRjaCc7XG4gICAgfVxuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gIH1cbiAgZ2V0RnJvbVNvY2tldChtb2QpIHtcbiAgICByZXR1cm4gbW9kLnVuaXQuc29ja2V0c1t0aGlzLmZyb21Tb2NrZXRdO1xuICB9XG4gIGdldFRvU29ja2V0KG1vZCkge1xuICAgIHJldHVybiBtb2QudW5pdC5zb2NrZXRzW3RoaXMudG9Tb2NrZXRdO1xuICB9XG4gIGlzSXNvbW9ycGhpYyhwKSB7XG4gICAgcmV0dXJuICh0aGlzLmZyb20gPT0gcC5mcm9tIFxuICAgICAgICAmJiB0aGlzLnRvID09IHAudG8gXG4gICAgICAgICYmIHRoaXMuZnJvbVNvY2tldCA9PSBwLmZyb21Tb2NrZXQgXG4gICAgICAgICYmIHRoaXMudG9Tb2NrZXQgPT0gcC50b1NvY2tldCkgXG4gICAgICB8fCBcbiAgICAgICh0aGlzLnRvID09IHAuZnJvbVxuICAgICAgICAmJiB0aGlzLmZyb20gPT0gcC50byBcbiAgICAgICAgJiYgdGhpcy5mcm9tU29ja2V0ID09IHAudG9Tb2NrZXQgXG4gICAgICAgICYmIHRoaXMudG9Tb2NrZXQgPT0gcC5mcm9tU29ja2V0KTtcbiAgfVxuICBkb2VzUGF0Y2hDb25uZWN0VG8obW9kdWxlLCBzb2NrZXQpIHtcbiAgICByZXR1cm4gKHRoaXMuZnJvbSA9PSBtb2R1bGUgJiYgdGhpcy5mcm9tU29ja2V0ID09IHNvY2tldCkgfHxcbiAgICAgICh0aGlzLnRvID09IG1vZHVsZSAmJiB0aGlzLnRvU29ja2V0ID09IHNvY2tldClcbiAgfVxuICBjb25uZWN0c1RvKG1vZHVsZSwgc29ja2V0KSB7XG4gICAgaWYgKHRoaXMuZnJvbSA9PSBtb2R1bGUgJiYgdGhpcy5mcm9tU29ja2V0ID09IHNvY2tldCkge1xuICAgICAgcmV0dXJuIHttb2R1bGU6IHRoaXMudG8sIHNvY2tldDogdGhpcy50b1NvY2tldH1cbiAgICB9XG4gICAgcmV0dXJuIHttb2R1bGU6IHRoaXMuZnJvbSwgc29ja2V0OiB0aGlzLmZyb21Tb2NrZXR9XG4gIH1cbiAgZ2V0Q29sb3IodGhlbWUpIHtcbiAgICBpZiAodGhlbWUuY29sb3Vycy5QYXRjaGVzW3RoaXMudHlwZV0pIHtcbiAgICAgIHJldHVybiB0aGVtZS5jb2xvdXJzLlBhdGNoZXNbdGhpcy50eXBlXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoZW1lLmNvbG91cnMuUGF0Y2g7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGNsYXNzIFNvY2tldCB7XG4gIGNvbnN0cnVjdG9yKHgsIHksIGxhYmVsLCB0eXBlLCBpc0lucHV0KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLnJhZGl1cyA9IDg7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLmlzSW5wdXQgPSBpc0lucHV0O1xuICAgIGlmICghdHlwZSkge1xuICAgICAgdGhyb3cgJ01pc3NpbmcgU29ja2V0IHR5cGUgZm9yIFNvY2tldCB3aXRoIGxhYmVsOiAnICsgbGFiZWw7XG4gICAgfVxuICAgIGlmIChpc0lucHV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93ICdNaXNzaW5nIFNvY2tldCBpc0lucHV0IGZvciBTb2NrZXQgd2l0aCBsYWJlbDogJyArIGxhYmVsO1xuICAgIH1cbiAgfVxuICBkcmF3KGFwcCkge1xuICAgIC8vIERyYXcgT2N0YWdvblxuICAgIHZhciBvY3RhX3Nob3J0ID0gMC4yOTI4OTMyMTg4MTM0NTI0NzU1OTkxNTU2Mzc4OTUxNTs7XG4gICAgdmFyIG9jdGFfbG9uZyA9IDEgLSBvY3RhX3Nob3J0O1xuICAgIHZhciBvY3RhZ29uID0ge1xuICAgICAgc2l6ZTogMiAqIHRoaXMucmFkaXVzICsgNCxcbiAgICB9XG4gICAgdmFyIHggPSB0aGlzLnggLSB0aGlzLnJhZGl1cyAtIDI7XG4gICAgdmFyIHkgPSB0aGlzLnkgLSB0aGlzLnJhZGl1cyAtIDI7XG4gICAgYXBwLmN0eC5iZWdpblBhdGgoKTtcbiAgICBhcHAuY3R4LmZpbGxTdHlsZSA9IGFwcC50aGVtZS5jb2xvdXJzLlNvY2tldEJhY2tncm91bmQ7XG4gICAgaWYgKGFwcC50aGVtZS5jb2xvdXJzLlNvY2tldHNbdGhpcy50eXBlXSkgeyBcbiAgICAgIGFwcC5jdHguZmlsbFN0eWxlID0gYXBwLnRoZW1lLmNvbG91cnMuU29ja2V0c1t0aGlzLnR5cGVdO1xuICAgIH1cbiAgICBhcHAuY3R4LnN0cm9rZVN0eWxlID0gYXBwLnRoZW1lLmNvbG91cnMuU29ja2V0T3V0bGluZTtcbiAgICBhcHAuY3R4Lm1vdmVUbyh4ICsgb2N0YWdvbi5zaXplICogb2N0YV9zaG9ydCwgeSk7XG4gICAgYXBwLmN0eC5saW5lVG8oeCwgeSArIG9jdGFnb24uc2l6ZSAqIG9jdGFfc2hvcnQpO1xuICAgIGFwcC5jdHgubGluZVRvKHgsIHkgKyBvY3RhZ29uLnNpemUgKiBvY3RhX2xvbmcpO1xuICAgIGFwcC5jdHgubGluZVRvKHggKyBvY3RhZ29uLnNpemUgKiBvY3RhX3Nob3J0LCB5ICsgb2N0YWdvbi5zaXplKTtcbiAgICBhcHAuY3R4LmxpbmVUbyh4ICsgb2N0YWdvbi5zaXplICogb2N0YV9sb25nLCB5ICsgb2N0YWdvbi5zaXplKTtcbiAgICBhcHAuY3R4LmxpbmVUbyh4ICsgb2N0YWdvbi5zaXplLCB5ICsgIG9jdGFnb24uc2l6ZSAqIG9jdGFfbG9uZyk7XG4gICAgYXBwLmN0eC5saW5lVG8oeCArIG9jdGFnb24uc2l6ZSwgeSArIG9jdGFnb24uc2l6ZSAqIG9jdGFfc2hvcnQpO1xuICAgIGFwcC5jdHgubGluZVRvKHggKyBvY3RhZ29uLnNpemUgKiBvY3RhX2xvbmcsIHkpO1xuICAgIGFwcC5jdHgubGluZVRvKHggKyBvY3RhZ29uLnNpemUgKiBvY3RhX3Nob3J0LCB5KTtcbiAgICBhcHAuY3R4LmZpbGwoKTtcbiAgICBhcHAuY3R4LnN0cm9rZSgpO1xuXG4gICAgLy8gRHJhdyBob2xlXG4gICAgYXBwLmN0eC5zdHJva2VTdHlsZSA9IGFwcC50aGVtZS5jb2xvdXJzLlNvY2tldEluc2lkZTtcbiAgICBhcHAuY3R4LmZpbGxTdHlsZSA9IGFwcC50aGVtZS5jb2xvdXJzLlNvY2tldEluc2lkZTtcbiAgICBhcHAuY3R4LmJlZ2luUGF0aCgpO1xuICAgIGFwcC5jdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cyAtIDIsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICBhcHAuY3R4LmZpbGwoKTtcblxuICAgIC8vIERyYXcgbGFiZWxcbiAgICBhcHAuY3R4LmZpbGxTdHlsZSA9IGFwcC50aGVtZS5jb2xvdXJzLk1vZHVsZVRleHQ7XG4gICAgYXBwLmN0eC5mb250ID0gJzEwcHggbW9ubyc7XG4gICAgdmFyIGNlbnRlclggPSB0aGlzLng7XG4gICAgYXBwLmN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuICAgIGFwcC5jdHguZmlsbFRleHQodGhpcy5sYWJlbCwgY2VudGVyWCwgeSAtIDMpO1xuICB9XG4gIGhhbmRsZU1vdXNlRG93bihhcHAsIHgsIHkpIHtcbiAgICBpZiAoeCA+PSB0aGlzLnggLSB0aGlzLnJhZGl1cyAmJiB4IDw9IHRoaXMueCArIHRoaXMucmFkaXVzICsgNCAmJiB5ID49IHRoaXMueSAtIHRoaXMucmFkaXVzICYmIHkgPD0gdGhpcy55ICsgdGhpcy5yYWRpdXMgKyA0KSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cbiAgaGFuZGxlRHJhZyhhcHAsIGR4LCBkeSwgeCwgeSkge1xuICAgIGlmICh0aGlzLm9uRHJhZykge1xuICAgICAgdGhpcy5vbkRyYWcoYXBwLCB0aGlzLCBkeCwgZHksIHgsIHkpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5wdXRTb2NrZXQgZXh0ZW5kcyBTb2NrZXQge1xuICBjb25zdHJ1Y3Rvcih4LCB5LCBsYWJlbCwgdHlwZSkge1xuICAgIHN1cGVyKHgsIHksIGxhYmVsLCB0eXBlLCB0cnVlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgT3V0cHV0U29ja2V0IGV4dGVuZHMgU29ja2V0IHtcbiAgY29uc3RydWN0b3IoeCwgeSwgbGFiZWwsIHR5cGUpIHtcbiAgICBzdXBlcih4LCB5LCBsYWJlbCwgdHlwZSwgZmFsc2UpO1xuICB9XG59XG4iLCJleHBvcnQgeyBJbnN0cnVtZW50IH0gZnJvbSAnLi9pbnN0cnVtZW50LmpzJztcbmltcG9ydCB7IEluc3RydW1lbnQgfSBmcm9tICcuL2luc3RydW1lbnQuanMnO1xuaW1wb3J0IHsgQ2hhbm5lbElucHV0LCBDaGFubmVsT3V0cHV0LCBTYW1wbGVHZW5lcmF0b3IsIEZpbHRlciwgVHJhbnNwb3NlLCBQYW5uaW5nfSBmcm9tICcuL21vZHVsZV91bml0cyc7XG5pbXBvcnQgeyBCdXR0b24sIEVkaXRvciwgTW9kdWxlIH0gZnJvbSAnLi4vY29tcG9uZW50cy8nO1xuXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudEVkaXRvciBleHRlbmRzIEVkaXRvciB7XG4gIGNvbnN0cnVjdG9yKGFwcCwgaW5zdHJ1bWVudCwgaGFuZGxlQ2xvc2UpIHtcbiAgICBzdXBlcihhcHAsIGluc3RydW1lbnQsIGhhbmRsZUNsb3NlKTtcbiAgICBpZiAoIWluc3RydW1lbnQpIHtcbiAgICAgIGluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudChbXSwgW10pO1xuICAgICAgdmFyIG1vZHVsZXMgPSBbXG4gICAgICAgIG5ldyBNb2R1bGUoaW5zdHJ1bWVudCwgMzAsIDMwLCBuZXcgQ2hhbm5lbElucHV0KCdpbnB1dCcpKSwgXG4gICAgICAgIG5ldyBNb2R1bGUoaW5zdHJ1bWVudCwgODAwLCAzMCwgbmV3IENoYW5uZWxPdXRwdXQoJ291dHB1dCcpKSxcbiAgICAgIF07XG4gICAgICBpbnN0cnVtZW50Lm1vZHVsZXMgPSBtb2R1bGVzO1xuICAgIH1cbiAgICB0aGlzLnRhcmdldCA9IGluc3RydW1lbnQ7XG4gICAgdmFyIGJ1dHRvbkRlZnMgPSBbXG4gICAgICAgIHtsYWJlbDogXCJTSU5cIiwgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRHZW5lcmF0b3IoXCJzaW5lXCIpfSxcbiAgICAgICAge2xhYmVsOiBcIlNRVVwiLCBvbmNsaWNrOiAoKSA9PiB0aGlzLmhhbmRsZUFkZEdlbmVyYXRvcihcInNxdWFyZVwiKX0sXG4gICAgICAgIHtsYWJlbDogXCJTQVdcIiwgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRHZW5lcmF0b3IoXCJzYXdcIil9LFxuICAgICAgICB7bGFiZWw6IFwiVFJJXCIsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkR2VuZXJhdG9yKFwidHJpYW5nbGVcIil9LFxuICAgICAgICB7bGFiZWw6IFwiUFdNXCIsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkR2VuZXJhdG9yKFwicHVsc2VcIil9LFxuICAgICAgICB7bGFiZWw6IFwiV0FWXCIsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkR2VuZXJhdG9yKFwid2F2XCIpfSxcbiAgICAgICAge2xhYmVsOiBcIk5PSVwiLCBvbmNsaWNrOiAoKSA9PiB0aGlzLmhhbmRsZUFkZEdlbmVyYXRvcihcIndoaXRlX25vaXNlXCIpfSxcbiAgICAgICAge2xhYmVsOiBcIkdSQVwiLCBvbmNsaWNrOiAoKSA9PiB0aGlzLmhhbmRsZUFkZEdlbmVyYXRvcihcImdyYWluXCIpfSxcbiAgICAgICAge2xhYmVsOiBcIlZPQ1wiLCBvbmNsaWNrOiAoKSA9PiB0aGlzLmhhbmRsZUFkZEdlbmVyYXRvcihcInZvY29kZXJcIil9LFxuICAgIF07XG4gICAgdmFyIGZpbHRlckRlZnMgPSBbXG4gICAgICB7bGFiZWw6IFwiTFBGXCIsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkRmlsdGVyKFwibG93IHBhc3MgZmlsdGVyXCIpfSxcbiAgICAgIHtsYWJlbDogXCJIUEZcIiwgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRGaWx0ZXIoXCJoaWdoIHBhc3MgZmlsdGVyXCIpfSxcbiAgICAgIHtsYWJlbDogXCJETFlcIiwgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRGaWx0ZXIoXCJkZWxheVwiKX0sXG4gICAgICB7bGFiZWw6IFwiRkxBXCIsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkRmlsdGVyKFwiZmxhbmdlclwiKX0sXG4gICAgICB7bGFiZWw6IFwiRElTXCIsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkRmlsdGVyKFwiZGlzdG9ydGlvblwiKX0sXG4gICAgICB7bGFiZWw6IFwiT1ZSXCIsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkRmlsdGVyKFwib3ZlcmRyaXZlXCIpfSxcbiAgICAgIHtsYWJlbDogXCJUUkVcIiwgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRGaWx0ZXIoXCJ0cmVtZWxvXCIpfSxcbiAgICBdO1xuICAgIHZhciBkZXJpdmVkRGVmcyA9IFtcbiAgICAgIHtsYWJlbDogXCJUUkFcIiwgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBUcmFuc3Bvc2UoXCJ0cmFuc3Bvc2VcIikpfSxcbiAgICAgIHtsYWJlbDogXCJQQU5cIiwgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBQYW5uaW5nKFwicGFubmluZ1wiKSl9LFxuICAgIF07XG4gICAgdmFyIHggPSAxMDtcbiAgICBmb3IgKHZhciBkZWYgb2YgYnV0dG9uRGVmcykge1xuICAgICAgdmFyIGIgPSBuZXcgQnV0dG9uKHgsIDAsIGRlZi5vbmNsaWNrLmJpbmQodGhpcyksIGRlZi5sYWJlbCk7XG4gICAgICBiLmNvbG91ciA9IGFwcC50aGVtZS5jb2xvdXJzLk1vZHVsZUdlbmVyYXRvcjtcbiAgICAgIHRoaXMuYnV0dG9ucy5wdXNoKGIpO1xuICAgICAgeCArPSBiLncgKyAzO1xuICAgIH1cbiAgICBmb3IgKHZhciBkZWYgb2YgZmlsdGVyRGVmcykge1xuICAgICAgdmFyIGIgPSBuZXcgQnV0dG9uKHgsIDAsIGRlZi5vbmNsaWNrLmJpbmQodGhpcyksIGRlZi5sYWJlbCk7XG4gICAgICBiLmNvbG91ciA9IGFwcC50aGVtZS5jb2xvdXJzLk1vZHVsZUZpbHRlcjtcbiAgICAgIHRoaXMuYnV0dG9ucy5wdXNoKGIpO1xuICAgICAgeCArPSBiLncgKyAzO1xuICAgIH1cbiAgICBmb3IgKHZhciBkZWYgb2YgZGVyaXZlZERlZnMpIHtcbiAgICAgIHZhciBiID0gbmV3IEJ1dHRvbih4LCAwLCBkZWYub25jbGljay5iaW5kKHRoaXMpLCBkZWYubGFiZWwpO1xuICAgICAgYi5jb2xvdXIgPSBhcHAudGhlbWUuY29sb3Vycy5Nb2R1bGVEZXJpdmVkO1xuICAgICAgdGhpcy5idXR0b25zLnB1c2goYik7XG4gICAgICB4ICs9IGIudyArIDM7XG4gICAgfVxuICB9XG4gIGhhbmRsZUFkZEZpbHRlcih0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgRmlsdGVyKHR5cGUpKTtcbiAgfVxuICBoYW5kbGVBZGRHZW5lcmF0b3IodHlwZSkge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZUFkZFVuaXQoKCkgPT4gbmV3IFNhbXBsZUdlbmVyYXRvcih0eXBlKSk7XG4gIH1cbn1cblxuIiwiaW1wb3J0IHsgQ2hhbm5lbElucHV0LCBDaGFubmVsT3V0cHV0LCBGaWx0ZXIsIFNhbXBsZUdlbmVyYXRvciwgVHJhbnNwb3NlLCBQYW5uaW5nLCBGYWN0b3J5IH0gZnJvbSAnLi9tb2R1bGVfdW5pdHMnO1xuaW1wb3J0IHsgUGF0Y2gsIE1vZHVsZSB9IGZyb20gJy4uL2NvbXBvbmVudHMvJztcbmltcG9ydCB7IFBhdGNoYWJsZSwgQVVESU9fVFlQRSwgRlJFUVVFTkNZX1RZUEUsIFBBTk5JTkdfVFlQRSB9IGZyb20gJy4uL21vZGVsLyc7XG5cbmV4cG9ydCBjbGFzcyBJbnN0cnVtZW50IGV4dGVuZHMgUGF0Y2hhYmxlIHtcbiAgY29uc3RydWN0b3IobW9kdWxlcywgcGF0Y2hlcykge1xuICAgIHN1cGVyKG1vZHVsZXMsIHBhdGNoZXMpO1xuICAgIHRoaXMubmFtZSA9IG51bGw7XG4gICAgdGhpcy5pbnN0cnVtZW50QmFua0luZGV4ID0gbnVsbDtcbiAgICB0aGlzLm1vZHVsZXMgPSBbXTtcbiAgICB0aGlzLnBhdGNoZXMgPSBbXTtcbiAgfVxuICBsb2FkRnJvbURlZmluaXRpb24oaW5zdHJEZWYpIHtcbiAgICB0aGlzLm1vZHVsZXMgPSBbXG4gICAgICBuZXcgTW9kdWxlKHRoaXMsIDEwLCA0MCwgbmV3IENoYW5uZWxJbnB1dCgnaW5wdXQnKSksIFxuICAgICAgbmV3IE1vZHVsZSh0aGlzLCA3MDAsIDQwLCBuZXcgQ2hhbm5lbE91dHB1dCgnb3V0cHV0JykpLFxuICAgIF07XG4gICAgdGhpcy5wYXRjaGVzID0gW107XG4gICAgaWYgKGluc3RyRGVmLm5hbWUpIHtcbiAgICAgIHRoaXMubmFtZSA9IGluc3RyRGVmLm5hbWU7XG4gICAgfVxuICAgIGlmIChpbnN0ckRlZi5pbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmluc3RydW1lbnRCYW5rSW5kZXggPSBpbnN0ckRlZi5pbmRleDtcbiAgICB9XG4gICAgdmFyIGl4ID0gdGhpcy5sb2FkR2VuZXJhdG9yKGluc3RyRGVmLCAwLCAxKTtcbiAgICB0aGlzLnBhdGNoSW5wdXQoaXgpO1xuICB9XG4gIHBhdGNoSW5wdXQoaXgpIHtcbiAgICBpZiAoaXgpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGl4KSkge1xuICAgICAgICBmb3IgKHZhciBpIG9mIGl4KSB7XG4gICAgICAgICAgdGhpcy5wYXRjaElucHV0KGkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBzID0gdGhpcy5tb2R1bGVzW2l4XS51bml0LnNvY2tldHM7XG4gICAgICB2YXIgY2FuZGlkYXRlID0gbnVsbDtcbiAgICAgIGlmIChzKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBvZiBPYmplY3Qua2V5cyhzKSkge1xuICAgICAgICAgIGlmIChzW2tleV0udHlwZSA9PT0gRlJFUVVFTkNZX1RZUEUpIHtcbiAgICAgICAgICAgIGNhbmRpZGF0ZSA9IGtleTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hZGRQYXRjaChpeCwgMCwgXCJGUkVRXCIsIGNhbmRpZGF0ZSwgRlJFUVVFTkNZX1RZUEUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBsb2FkR2VuZXJhdG9yKGluc3RyRGVmLCBpbnB1dCwgb3V0cHV0KSB7XG4gICAgaWYgKGluc3RyRGVmW1wiY29tYmluZWRcIl0pIHtcbiAgICAgIHZhciBncyA9IFtdO1xuICAgICAgZm9yICh2YXIgaURlZiBvZiBpbnN0ckRlZltcImNvbWJpbmVkXCJdKSB7XG4gICAgICAgIHZhciBpeCA9IHRoaXMubG9hZEdlbmVyYXRvcihpRGVmLCBpbnB1dCwgb3V0cHV0KTtcbiAgICAgICAgaWYgKGl4KSB7XG4gICAgICAgICAgZ3MucHVzaChpeCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBncztcbiAgICB9IGVsc2UgaWYgKGluc3RyRGVmW1wicGFubmluZ1wiXSkge1xuICAgICAgdmFyIGcgPSBuZXcgUGFubmluZyhcInBhbm5pbmdcIik7XG4gICAgICB2YXIgdEl4ID0gdGhpcy5hZGRNb2R1bGUoZyk7XG4gICAgICB2YXIgaXggPSB0aGlzLmxvYWRHZW5lcmF0b3IoaW5zdHJEZWZbXCJwYW5uaW5nXCJdLCBpbnB1dCwgb3V0cHV0KTtcbiAgICAgIHRoaXMuX2FkZFBhdGNoKHRJeCwgaXgsIFwiUEFOXCIsIFwiUEFOXCIsIFBBTk5JTkdfVFlQRSk7XG4gICAgICB0aGlzLl9hZGRQYXRjaChpbnB1dCwgdEl4LCBcIkZSRVFcIiwgXCJGUkVRXCIsIEZSRVFVRU5DWV9UWVBFKTtcbiAgICAgIHJldHVybiBpeDtcbiAgICB9IGVsc2UgaWYgKGluc3RyRGVmW1widHJhbnNwb3NlXCJdKSB7XG4gICAgICB2YXIgZyA9IG5ldyBUcmFuc3Bvc2UoXCJ0cmFuc3Bvc2VcIik7XG4gICAgICBnLmRpYWxzW1wic2VtaXRvbmVzXCJdLnZhbHVlID0gaW5zdHJEZWZbXCJ0cmFuc3Bvc2VcIl1bXCJzZW1pdG9uZXNcIl0gfHwgMDtcbiAgICAgIHZhciB0SXggPSB0aGlzLmFkZE1vZHVsZShnKTtcbiAgICAgIHZhciBpeCA9IHRoaXMubG9hZEdlbmVyYXRvcihpbnN0ckRlZltcInRyYW5zcG9zZVwiXSwgdEl4LCBvdXRwdXQpO1xuICAgICAgdGhpcy5fYWRkUGF0Y2godEl4LCBpeCwgXCJGUkVRXCIsIFwiRlJFUVwiLCBGUkVRVUVOQ1lfVFlQRSk7XG4gICAgICB0aGlzLl9hZGRQYXRjaChpbnB1dCwgdEl4LCBcIkZSRVFcIiwgXCJGUkVRIElOXCIsIEZSRVFVRU5DWV9UWVBFKTtcbiAgICAgIHJldHVybiBpeDtcbiAgICB9IGVsc2UgaWYgKGluc3RyRGVmW1wic2luZVwiXSBcbiAgICAgIHx8IGluc3RyRGVmW1widHJpYW5nbGVcIl0gXG4gICAgICB8fCBpbnN0ckRlZltcInNxdWFyZVwiXSBcbiAgICAgIHx8IGluc3RyRGVmW1wic2F3dG9vdGhcIl0gXG4gICAgICB8fCBpbnN0ckRlZltcIndoaXRlX25vaXNlXCJdXG4gICAgICB8fCBpbnN0ckRlZltcInB1bHNlXCJdXG4gICAgICB8fCBpbnN0ckRlZltcIndhdlwiXSkge1xuICAgICAgdmFyIGcgPSBuZXcgRmFjdG9yeSgpLmdlbmVyYXRvckZyb21EZWZpbml0aW9uKGluc3RyRGVmKTtcbiAgICAgIHZhciBpeCA9IHRoaXMuYWRkTW9kdWxlKGcpO1xuICAgICAgdGhpcy5fYWRkUGF0Y2goaXgsIG91dHB1dCwgXCJPVVRcIiwgXCJJTlwiLCBBVURJT19UWVBFKTtcbiAgICAgIHJldHVybiBpeDtcbiAgICB9IGVsc2UgaWYgKGluc3RyRGVmW1widm9jb2RlclwiXSkge1xuICAgICAgdmFyIHNvdXJjZSA9IG5ldyBGYWN0b3J5KCkuZ2VuZXJhdG9yRnJvbURlZmluaXRpb24oaW5zdHJEZWZbXCJ2b2NvZGVyXCJdW1wic291cmNlXCJdKVxuICAgICAgdmFyIHZvY29kZXIgPSBuZXcgRmFjdG9yeSgpLmdlbmVyYXRvckZyb21EZWZpbml0aW9uKGluc3RyRGVmW1widm9jb2RlclwiXVtcInZvY29kZXJcIl0pXG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIGlmIChpbnN0ckRlZltcImZpbHRlclwiXSkge1xuICAgICAgdmFyIGcgPSBuZXcgRmFjdG9yeSgpLmZpbHRlckZyb21EZWZpbml0aW9uKGluc3RyRGVmW1wiZmlsdGVyXCJdKVxuICAgICAgdmFyIHRJeCA9IHRoaXMuYWRkTW9kdWxlKGcpO1xuICAgICAgdmFyIGl4ID0gdGhpcy5sb2FkR2VuZXJhdG9yKGluc3RyRGVmW1wiZmlsdGVyXCJdLCBpbnB1dCwgdEl4KTtcbiAgICAgIHRoaXMuX2FkZFBhdGNoKHRJeCwgb3V0cHV0LCBcIk9VVFwiLCBcIklOXCIsIEFVRElPX1RZUEUpO1xuICAgICAgcmV0dXJuIGl4O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhpbnN0ckRlZik7XG4gICAgICB0aHJvdyAnVW5rbm93biBpbnN0cnVtZW50IGRlZic7XG4gICAgfVxuICB9XG4gIGxvYWQoaW5zdHJEZWYpIHtcbiAgICB2YXIgbW9kdWxlcyA9IFtdO1xuICAgIGZvciAodmFyIG0gb2YgaW5zdHJEZWYubW9kdWxlcykge1xuICAgICAgdmFyIGcgPSBudWxsO1xuICAgICAgaWYgKG0udHlwZSA9PSBcImlucHV0XCIpIHtcbiAgICAgICAgZyA9IG5ldyBDaGFubmVsSW5wdXQobS50eXBlKTtcbiAgICAgIH0gZWxzZSBpZiAobS50eXBlID09IFwib3V0cHV0XCIpIHtcbiAgICAgICAgZyA9IG5ldyBDaGFubmVsT3V0cHV0KG0udHlwZSk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PSBcImxvdyBwYXNzIGZpbHRlclwiKSB7XG4gICAgICAgIGcgPSBuZXcgRmlsdGVyKG0udHlwZSk7XG4gICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PSBcInNpbmVcIiB8fCBtLnR5cGUgPT0gXCJ0cmlhbmdsZVwiKSB7XG4gICAgICAgIGcgPSBuZXcgU2FtcGxlR2VuZXJhdG9yKG0udHlwZSk7XG4gICAgICB9XG4gICAgICBpZiAoZykge1xuICAgICAgICB2YXIgbW9kID0gbmV3IE1vZHVsZSh0aGlzLCBtLngsIG0ueSwgZyk7XG4gICAgICAgIG1vZHVsZXMucHVzaChtb2QpO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgcGF0Y2hlcyA9IFtdO1xuICAgIGZvciAodmFyIHAgb2YgaW5zdHJEZWYucGF0Y2hlcykge1xuICAgICAgdGhpcy5fYWRkUGF0Y2gocC5mcm9tX21vZHVsZSwgcC50b19tb2R1bGUsIHAuZnJvbV9zb2NrZXQsIHAudG9fc29ja2V0KTtcbiAgICB9XG4gICAgdGhpcy5tb2R1bGVzID0gbW9kdWxlcztcbiAgICB0aGlzLnBhdGNoZXMgPSBwYXRjaGVzO1xuICB9XG5cbiAgY29tcGlsZSgpIHtcbiAgICB2YXIgb3V0cHV0ID0gbnVsbDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubW9kdWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG0gPSB0aGlzLm1vZHVsZXNbaV07XG4gICAgICBpZiAobS51bml0LnR5cGUgPT0gXCJvdXRwdXRcIikge1xuICAgICAgICBvdXRwdXQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIW91dHB1dCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHF1ZXVlID0gW291dHB1dF07XG4gICAgdmFyIHNlZW4gPSB7fTtcbiAgICB2YXIgZGVwZW5kZW5jaWVzID0gW107XG4gICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBxID0gcXVldWVbMF07XG4gICAgICB2YXIgcXVldWUgPSBxdWV1ZS5zcGxpY2UoMSk7XG4gICAgICBpZiAoc2VlbltxXSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgZGVwZW5kZW5jaWVzLnB1c2gocSk7XG4gICAgICBmb3IgKHZhciBwIG9mIHRoaXMucGF0Y2hlcykge1xuICAgICAgICBpZiAoIXRoaXMubW9kdWxlc1txXSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmlnIHRyb3VibGVzOiB0cnlpbmcgdG8gcmVhY2ggbm9uIGV4aXN0ZW50IG1vZHVsZTpcIiwgaXgpO1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1vZFNvY2tldHMgPSB0aGlzLm1vZHVsZXNbcV0udW5pdC5zb2NrZXRzO1xuICAgICAgICBpZiAocC50byA9PT0gcSAmJiBtb2RTb2NrZXRzW3AudG9Tb2NrZXRdICYmIG1vZFNvY2tldHNbcC50b1NvY2tldF0uaXNJbnB1dCkge1xuICAgICAgICAgIGlmICghc2VlbltwLmZyb21dKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKHAuZnJvbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHAuZnJvbSA9PT0gcSAmJiBtb2RTb2NrZXRzW3AuZnJvbVNvY2tldF0gJiYgbW9kU29ja2V0c1twLmZyb21Tb2NrZXRdLmlzSW5wdXQpIHtcbiAgICAgICAgICBpZiAoIXNlZW5bcC50b10pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2gocC50byk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZWVuW3FdID0gdHJ1ZTtcbiAgICB9XG4gICAgdmFyIGdlbmVyYXRvcnMgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gZGVwZW5kZW5jaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgaXggPSBkZXBlbmRlbmNpZXNbaV07XG4gICAgICBpZiAoIXRoaXMubW9kdWxlc1tpeF0pIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJCaWcgdHJvdWJsZXM6IHRyeWluZyB0byByZWFjaCBub24gZXhpc3RlbnQgbW9kdWxlOlwiLCBpeCk7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICB2YXIgdW5pdCA9IHRoaXMubW9kdWxlc1tpeF0udW5pdDtcbiAgICAgIHZhciBnID0gbnVsbDtcbiAgICAgIGlmICh1bml0LnR5cGUgPT0gXCJpbnB1dFwiKSB7XG4gICAgICAgIGcgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICh1bml0LnR5cGUgPT0gXCJ3YXZcIikge1xuICAgICAgICBnID0gdW5pdC5jb21waWxlKCk7XG4gICAgICB9IGVsc2UgaWYgKHVuaXQudHlwZSA9PSBcInRyaWFuZ2xlXCIgXG4gICAgICAgIHx8IHVuaXQudHlwZSA9PSBcInNpbmVcIiBcbiAgICAgICAgfHwgdW5pdC50eXBlID09IFwic2F3XCIgXG4gICAgICAgIHx8IHVuaXQudHlwZSA9PSBcInNxdWFyZVwiIFxuICAgICAgICB8fCB1bml0LnR5cGUgPT0gXCJ3aGl0ZV9ub2lzZVwiKSB7XG4gICAgICAgIGcgPSB7fTtcbiAgICAgICAgZ1t1bml0LnR5cGVdID0ge1xuICAgICAgICAgIFwiZ2FpblwiOiB1bml0LmRpYWxzW1wiZ2FpblwiXS52YWx1ZSxcbiAgICAgICAgICBcInBhbm5pbmdcIjogdW5pdC5kaWFsc1tcInBhbm5pbmdcIl0udmFsdWUsXG4gICAgICAgICAgXCJhdHRhY2tcIjogdW5pdC5kaWFsc1tcImF0dGFja1wiXS52YWx1ZSxcbiAgICAgICAgICBcImRlY2F5XCI6IHVuaXQuZGlhbHNbXCJkZWNheVwiXS52YWx1ZSxcbiAgICAgICAgICBcInN1c3RhaW5cIjogdW5pdC5kaWFsc1tcInN1c3RhaW5cIl0udmFsdWUsXG4gICAgICAgICAgXCJyZWxlYXNlXCI6IHVuaXQuZGlhbHNbXCJyZWxlYXNlXCJdLnZhbHVlLFxuICAgICAgICB9O1xuICAgICAgICB2YXIgcGl0Y2hGb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBwIG9mIHRoaXMucGF0Y2hlcykge1xuICAgICAgICAgIGlmIChwLmRvZXNQYXRjaENvbm5lY3RUbyhpeCwgXCJGUkVRXCIpKSB7XG4gICAgICAgICAgICBwaXRjaEZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBwZyA9IGdlbmVyYXRvcnNbcC5jb25uZWN0c1RvKGl4LCBcIkZSRVFcIikubW9kdWxlXTtcbiAgICAgICAgICAgIGlmIChwZykge1xuICAgICAgICAgICAgICBnW3VuaXQudHlwZV1bXCJhdXRvX3BpdGNoXCJdID0gcGc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghcGl0Y2hGb3VuZCkge1xuICAgICAgICAgIGdbdW5pdC50eXBlXVtcInBpdGNoXCJdID0gdW5pdC5kaWFsc1tcInBpdGNoXCJdLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHVuaXQudHlwZSA9PSBcImxvdyBwYXNzIGZpbHRlclwiKSB7XG4gICAgICAgIGcgPSB7fTtcbiAgICAgICAgZ1tcImZpbHRlclwiXSA9IHtcImxwZlwiOiB7XCJjdXRvZmZcIjogdW5pdC5kaWFsc1tcImN1dG9mZlwiXS52YWx1ZX19XG4gICAgICAgIHZhciBvbiA9IHRoaXMuY29tcGlsZUdlbmVyYXRvcnMoZ2VuZXJhdG9ycywgaXgsIFwiSU5cIik7XG4gICAgICAgIE9iamVjdC5rZXlzKG9uKS5tYXAoKGspID0+IHtcbiAgICAgICAgICBnW1wiZmlsdGVyXCJdW2tdID0gb25ba107XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh1bml0LnR5cGUgPT0gXCJoaWdoIHBhc3MgZmlsdGVyXCIpIHtcbiAgICAgICAgZyA9IHt9O1xuICAgICAgICBnW1wiZmlsdGVyXCJdID0ge1wiaHBmXCI6IHtcImN1dG9mZlwiOiB1bml0LmRpYWxzW1wiY3V0b2ZmXCJdLnZhbHVlfX1cbiAgICAgICAgdmFyIG9uID0gdGhpcy5jb21waWxlR2VuZXJhdG9ycyhnZW5lcmF0b3JzLCBpeCwgXCJJTlwiKTtcbiAgICAgICAgT2JqZWN0LmtleXMob24pLm1hcCgoaykgPT4ge1xuICAgICAgICAgIGdbXCJmaWx0ZXJcIl1ba10gPSBvbltrXTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHVuaXQudHlwZSA9PSBcInRyYW5zcG9zZVwiKSB7XG4gICAgICAgIGcgPSB7XCJ0cmFuc3Bvc2VcIjoge1xuICAgICAgICAgIFwic2VtaXRvbmVzXCI6IHVuaXQuZGlhbHNbXCJzZW1pdG9uZXNcIl0udmFsdWUsXG4gICAgICAgIH19XG4gICAgICAgIHZhciBvbiA9IHRoaXMuY29tcGlsZUdlbmVyYXRvcnMoZ2VuZXJhdG9ycywgaXgsIFwiRlJFUSBJTlwiKTtcbiAgICAgICAgaWYgKG9uKSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMob24pLm1hcCgoaykgPT4ge1xuICAgICAgICAgICAgZ1tcInRyYW5zcG9zZVwiXVtrXSA9IG9uW2tdO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHVuaXQudHlwZSA9PSBcInBhbm5pbmdcIikge1xuICAgICAgICBnID0ge1wicGFubmluZ1wiOiB7fX1cbiAgICAgICAgdmFyIG9uID0gdGhpcy5jb21waWxlR2VuZXJhdG9ycyhnZW5lcmF0b3JzLCBpeCwgXCJGUkVRIElOXCIpO1xuICAgICAgICBpZiAob24pIHtcbiAgICAgICAgICBPYmplY3Qua2V5cyhvbikubWFwKChrKSA9PiB7XG4gICAgICAgICAgICBnW1wicGFubmluZ1wiXVtrXSA9IG9uW2tdO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHVuaXQudHlwZSA9PSBcIm91dHB1dFwiKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmNvbXBpbGVHZW5lcmF0b3JzKGdlbmVyYXRvcnMsIGl4LCBcIklOXCIpO1xuICAgICAgICBpZiAodGhpcy5uYW1lKSB7XG4gICAgICAgICAgcmVzdWx0Lm5hbWUgPSB0aGlzLm5hbWVcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pbnN0cnVtZW50QmFua0luZGV4KSB7XG4gICAgICAgICAgcmVzdWx0LmluZGV4ID0gdGhpcy5pbnN0cnVtZW50QmFua0luZGV4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICBnZW5lcmF0b3JzW2l4XSA9IGc7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29tcGlsZUdlbmVyYXRvcnMoZ2VuZXJhdG9ycywgaXgsIGlucHV0KSB7XG4gICAgdmFyIGdzID0gW107XG4gICAgZm9yICh2YXIgcCBvZiB0aGlzLnBhdGNoZXMpIHtcbiAgICAgIGlmIChwLmRvZXNQYXRjaENvbm5lY3RUbyhpeCwgaW5wdXQpKSB7XG4gICAgICAgIGdzLnB1c2goZ2VuZXJhdG9yc1twLmNvbm5lY3RzVG8oaXgsIGlucHV0KS5tb2R1bGVdKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKGdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGdzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1wiY29tYmluZWRcIjogZ3N9XG4gICAgfVxuICB9XG59XG5cbiIsImltcG9ydCB7IE1vZHVsZVVuaXQsIE91dHB1dFNvY2tldCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvJztcbmltcG9ydCB7IEZSRVFVRU5DWV9UWVBFIH0gZnJvbSAnLi4vLi4vbW9kZWwvJztcblxuZXhwb3J0IGNsYXNzIENoYW5uZWxJbnB1dCBleHRlbmRzIE1vZHVsZVVuaXQge1xuICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgdGhpcy5zb2NrZXRzID0ge1xuICAgICAgXCJGUkVRXCI6IG5ldyBPdXRwdXRTb2NrZXQodGhpcy53IC0gMjksIHRoaXMuaCAtIDI5LCBcIkZSRVFcIiwgRlJFUVVFTkNZX1RZUEUpLFxuICAgIH1cbiAgICB0aGlzLmJhY2tncm91bmQgPSAnTW9kdWxlT3V0cHV0JztcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kdWxlVW5pdCwgSW5wdXRTb2NrZXQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzLyc7XG5pbXBvcnQgeyBBVURJT19UWVBFIH0gZnJvbSAnLi4vLi4vbW9kZWwvJztcblxuXG5leHBvcnQgY2xhc3MgQ2hhbm5lbE91dHB1dCBleHRlbmRzIE1vZHVsZVVuaXQge1xuICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgdGhpcy5zb2NrZXRzID0ge1xuICAgICAgXCJJTlwiOiBuZXcgSW5wdXRTb2NrZXQoMjksIHRoaXMuaCAtIDI5LCBcIklOXCIsIEFVRElPX1RZUEUpLFxuICAgIH1cbiAgICB0aGlzLmJhY2tncm91bmQgPSAnTW9kdWxlT3V0cHV0JztcbiAgfVxufVxuXG4iLCJcbmltcG9ydCB7IFNhbXBsZUdlbmVyYXRvciwgV2F2R2VuZXJhdG9yIH0gZnJvbSAnLi9zYW1wbGVfZ2VuZXJhdG9yLmpzJztcbmltcG9ydCB7IEZpbHRlciB9IGZyb20gJy4vZmlsdGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIEZhY3Rvcnkge1xuXG4gIGdlbmVyYXRvckZyb21EZWZpbml0aW9uKGluc3RyRGVmKSB7XG5cbiAgICBpZiAoaW5zdHJEZWZbXCJzaW5lXCJdIFxuICAgICAgfHwgaW5zdHJEZWZbXCJ0cmlhbmdsZVwiXSBcbiAgICAgIHx8IGluc3RyRGVmW1wic3F1YXJlXCJdIFxuICAgICAgfHwgaW5zdHJEZWZbXCJzYXd0b290aFwiXSBcbiAgICAgIHx8IGluc3RyRGVmW1wid2hpdGVfbm9pc2VcIl0pIHtcbiAgICAgIHZhciB0eXAgPSBcInRyaWFuZ2xlXCI7XG4gICAgICB2YXIgaW5zdHIgPSBudWxsO1xuICAgICAgaWYgKGluc3RyRGVmW1widHJpYW5nbGVcIl0pIHtcbiAgICAgICAgaW5zdHIgPSBpbnN0ckRlZltcInRyaWFuZ2xlXCJdO1xuICAgICAgfSBlbHNlIGlmIChpbnN0ckRlZltcInNpbmVcIl0pIHtcbiAgICAgICAgaW5zdHIgPSBpbnN0ckRlZltcInNpbmVcIl07XG4gICAgICAgIHR5cCA9IFwic2luZVwiO1xuICAgICAgfSBlbHNlIGlmIChpbnN0ckRlZltcInNxdWFyZVwiXSkge1xuICAgICAgICBpbnN0ciA9IGluc3RyRGVmW1wic3F1YXJlXCJdO1xuICAgICAgICB0eXAgPSBcInNxdWFyZVwiO1xuICAgICAgfSBlbHNlIGlmIChpbnN0ckRlZltcInNhd3Rvb3RoXCJdKSB7XG4gICAgICAgIGluc3RyID0gaW5zdHJEZWZbXCJzYXd0b290aFwiXTtcbiAgICAgICAgdHlwID0gXCJzYXdcIjtcbiAgICAgIH0gZWxzZSBpZiAoaW5zdHJEZWZbXCJ3aGl0ZV9ub2lzZVwiXSkge1xuICAgICAgICBpbnN0ciA9IGluc3RyRGVmW1wid2hpdGVfbm9pc2VcIl07XG4gICAgICAgIHR5cCA9IFwid2hpdGVfbm9pc2VcIjtcbiAgICAgIH1cbiAgICAgIHZhciBnID0gbmV3IFNhbXBsZUdlbmVyYXRvcih0eXApXG4gICAgICBnLmRpYWxzW1wiYXR0YWNrXCJdLnZhbHVlID0gaW5zdHJbXCJhdHRhY2tcIl0gfHwgMC4wO1xuICAgICAgZy5kaWFsc1tcImRlY2F5XCJdLnZhbHVlID0gaW5zdHJbXCJkZWNheVwiXSB8fCAwLjA7XG4gICAgICBnLmRpYWxzW1wic3VzdGFpblwiXS52YWx1ZSA9IGluc3RyW1wic3VzdGFpblwiXSB8fCAwLjA7XG4gICAgICBnLmRpYWxzW1wicmVsZWFzZVwiXS52YWx1ZSA9IGluc3RyW1wicmVsZWFzZVwiXSB8fCAwLjA7XG4gICAgICBnLmRpYWxzW1wiZ2FpblwiXS52YWx1ZSA9IGluc3RyW1wiZ2FpblwiXSB8fCAxLjA7XG4gICAgICByZXR1cm4gZztcbiAgICB9IGVsc2UgaWYgKGluc3RyRGVmW1wid2F2XCJdKSB7XG4gICAgICB2YXIgZyA9IG5ldyBXYXZHZW5lcmF0b3IoKTtcbiAgICAgIHZhciBpbnN0ciA9IGluc3RyRGVmW1wid2F2XCJdO1xuICAgICAgZy5maWxlID0gaW5zdHJbXCJmaWxlXCJdIHx8IFwiXCI7XG4gICAgICBnLmlzX3BpdGNoZWQgPSBpbnN0cltcInBpdGNoZWRcIl0gfHwgZmFsc2U7XG4gICAgICBnLmJhc2VfcGl0Y2ggPSBpbnN0cltcImJhc2VfcGl0Y2hcIl0gfHwgNDQwLjA7XG4gICAgICBnLmRpYWxzW1wiYXR0YWNrXCJdLnZhbHVlID0gaW5zdHJbXCJhdHRhY2tcIl0gfHwgMC4wO1xuICAgICAgZy5kaWFsc1tcImRlY2F5XCJdLnZhbHVlID0gaW5zdHJbXCJkZWNheVwiXSB8fCAwLjA7XG4gICAgICBnLmRpYWxzW1wic3VzdGFpblwiXS52YWx1ZSA9IGluc3RyW1wic3VzdGFpblwiXSB8fCAwLjA7XG4gICAgICBnLmRpYWxzW1wicmVsZWFzZVwiXS52YWx1ZSA9IGluc3RyW1wicmVsZWFzZVwiXSB8fCAwLjA7XG4gICAgICBnLmRpYWxzW1wiZ2FpblwiXS52YWx1ZSA9IGluc3RyW1wiZ2FpblwiXSB8fCAxLjA7XG4gICAgICByZXR1cm4gZztcbiAgICB9IGVsc2UgaWYgKGluc3RyRGVmW1wicHVsc2VcIl0pIHtcbiAgICAgIHZhciBnID0gbmV3IFNhbXBsZUdlbmVyYXRvcihcInB1bHNlXCIpO1xuICAgICAgdmFyIGluc3RyID0gaW5zdHJEZWZbXCJwdWxzZVwiXTtcbiAgICAgIGcuZGlhbHNbXCJhdHRhY2tcIl0udmFsdWUgPSBpbnN0cltcImF0dGFja1wiXSB8fCAwLjA7XG4gICAgICBnLmRpYWxzW1wiZGVjYXlcIl0udmFsdWUgPSBpbnN0cltcImRlY2F5XCJdIHx8IDAuMDtcbiAgICAgIGcuZGlhbHNbXCJzdXN0YWluXCJdLnZhbHVlID0gaW5zdHJbXCJzdXN0YWluXCJdIHx8IDAuMDtcbiAgICAgIGcuZGlhbHNbXCJyZWxlYXNlXCJdLnZhbHVlID0gaW5zdHJbXCJyZWxlYXNlXCJdIHx8IDAuMDtcbiAgICAgIGcuZGlhbHNbXCJnYWluXCJdLnZhbHVlID0gaW5zdHJbXCJnYWluXCJdIHx8IDEuMDtcbiAgICAgIHJldHVybiBnO1xuICAgIH1cbiAgfVxuXG4gIGZpbHRlckZyb21EZWZpbml0aW9uKGZpbHRlckRlZikge1xuICAgIGlmIChmaWx0ZXJEZWZbXCJscGZcIl0pIHtcbiAgICAgIHZhciBnID0gbmV3IEZpbHRlcihcImxvdyBwYXNzIGZpbHRlclwiKVxuICAgICAgZy5kaWFsc1tcImN1dG9mZlwiXS52YWx1ZSA9IGZpbHRlckRlZltcImxwZlwiXVtcImN1dG9mZlwiXSB8fCA1MDAwO1xuICAgICAgcmV0dXJuIGc7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXJEZWZbXCJkaXN0b3J0aW9uXCJdKSB7XG4gICAgICB2YXIgZyA9IG5ldyBGaWx0ZXIoXCJkaXN0b3J0aW9uXCIpXG4gICAgICByZXR1cm4gZztcbiAgICB9IGVsc2UgaWYgKGZpbHRlckRlZltcIm92ZXJkcml2ZVwiXSkge1xuICAgICAgdmFyIGcgPSBuZXcgRmlsdGVyKFwib3ZlcmRyaXZlXCIpXG4gICAgICByZXR1cm4gZztcbiAgICB9IGVsc2UgaWYgKGZpbHRlckRlZltcImZsYW5nZXJcIl0pIHtcbiAgICAgIHZhciBnID0gbmV3IEZpbHRlcihcImZsYW5nZXJcIilcbiAgICAgIHJldHVybiBnO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyRGVmW1wiYXZlcmFnZVwiXSkge1xuICAgICAgdmFyIGcgPSBuZXcgRmlsdGVyKFwiYXZlcmFnZVwiKVxuICAgICAgcmV0dXJuIGc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKGZpbHRlckRlZik7XG4gICAgICB0aHJvdyAnVW5rbm93biBmaWx0ZXIgZGVmJztcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZHVsZVVuaXQsIElucHV0U29ja2V0LCBPdXRwdXRTb2NrZXQsIERpYWwgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzLyc7XG5pbXBvcnQgeyBBVURJT19UWVBFIH0gZnJvbSAnLi4vLi4vbW9kZWwvJztcblxuZXhwb3J0IGNsYXNzIEZpbHRlciBleHRlbmRzIE1vZHVsZVVuaXQge1xuICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgdGhpcy5zb2NrZXRzID0ge1xuICAgICAgXCJJTlwiOiBuZXcgSW5wdXRTb2NrZXQoMjksIHRoaXMuaCAtIDI5LCBcIklOXCIsIEFVRElPX1RZUEUpLFxuICAgICAgXCJPVVRcIjogbmV3IE91dHB1dFNvY2tldCh0aGlzLncgLSAyOSwgdGhpcy5oIC0gMjksIFwiT1VUXCIsIEFVRElPX1RZUEUpLFxuICAgIH1cbiAgICB0aGlzLmJhY2tncm91bmQgPSAnTW9kdWxlRmlsdGVyJztcbiAgICB0aGlzLmRpYWxzID0geyB9XG5cbiAgICBpZiAodHlwZSA9PT0gXCJsb3cgcGFzcyBmaWx0ZXJcIiB8fCB0eXBlID09PSBcImhpZ2ggcGFzcyBmaWx0ZXJcIikge1xuICAgICAgdGhpcy53ID0gMTUwO1xuICAgICAgdGhpcy5kaWFsc1tcImN1dG9mZlwiXSA9IG5ldyBEaWFsKDI5LCA1OSwgXCJDVVRPRkZcIiwgMS4wLCAyMjAwMC4wLCA1MDAwLjApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJkZWxheVwiKSB7XG4gICAgICB0aGlzLncgPSAxNzA7XG4gICAgICB0aGlzLmRpYWxzW1widGltZVwiXSA9IG5ldyBEaWFsKDI5LCA1OSwgXCJUSU1FXCIsIDAuMDAwMDEsIDQuMCwgMS4wKTtcbiAgICAgIHRoaXMuZGlhbHNbXCJmYWN0b3JcIl0gPSBuZXcgRGlhbCg3OSwgNTksIFwiRkFDVE9SXCIsIDAuMCwgMi4wLCAxLjApO1xuICAgICAgdGhpcy5kaWFsc1tcImZlZWRiYWNrXCJdID0gbmV3IERpYWwoMTI5LCA1OSwgXCJGRUVEQkFDS1wiLCAwLjAsIDIuMCwgMC4wKTtcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCB7IENoYW5uZWxJbnB1dCB9IGZyb20gJy4vY2hhbm5lbF9pbnB1dC5qcyc7XG5leHBvcnQgeyBDaGFubmVsT3V0cHV0IH0gZnJvbSAnLi9jaGFubmVsX291dHB1dC5qcyc7XG5leHBvcnQgeyBGaWx0ZXIgfSBmcm9tICcuL2ZpbHRlci5qcyc7XG5leHBvcnQgeyBTYW1wbGVHZW5lcmF0b3IgfSBmcm9tICcuL3NhbXBsZV9nZW5lcmF0b3IuanMnO1xuZXhwb3J0IHsgVHJhbnNwb3NlIH0gZnJvbSAnLi90cmFuc3Bvc2UuanMnO1xuZXhwb3J0IHsgUGFubmluZyB9IGZyb20gJy4vcGFubmluZy5qcyc7XG5leHBvcnQgeyBGYWN0b3J5IH0gZnJvbSAnLi9mYWN0b3J5LmpzJztcbiIsImltcG9ydCB7IElucHV0U29ja2V0LCBPdXRwdXRTb2NrZXQsIERpYWwsIE1vZHVsZVVuaXQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzLyc7XG5pbXBvcnQgeyBGUkVRVUVOQ1lfVFlQRSwgUEFOTklOR19UWVBFIH0gZnJvbSAnLi4vLi4vbW9kZWwvJztcblxuZXhwb3J0IGNsYXNzIFBhbm5pbmcgZXh0ZW5kcyBNb2R1bGVVbml0IHtcbiAgY29uc3RydWN0b3IodHlwZSkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIHRoaXMuYmFja2dyb3VuZCA9ICdNb2R1bGVEZXJpdmVkJztcbiAgICB0aGlzLncgPSAxMjA7XG4gICAgdGhpcy5oID0gMTUwO1xuICAgIHRoaXMuc29ja2V0cyA9IHtcbiAgICAgIFwiRlJFUVwiOiBuZXcgSW5wdXRTb2NrZXQoMjksIHRoaXMuaCAtIDI5LCBcIkZSRVFcIiwgRlJFUVVFTkNZX1RZUEUpLFxuICAgICAgXCJQQU5cIjogbmV3IE91dHB1dFNvY2tldCh0aGlzLncgLSAyOSwgdGhpcy5oIC0gMjksIFwiUEFOXCIsIFBBTk5JTkdfVFlQRSksXG4gICAgfVxuICAgIHRoaXMuZGlhbHMgPSB7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBJbnB1dFNvY2tldCwgT3V0cHV0U29ja2V0LCBEaWFsLCBNb2R1bGVVbml0IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy8nO1xuaW1wb3J0IHsgRlJFUVVFTkNZX1RZUEUsIEFVRElPX1RZUEUsIFBBTk5JTkdfVFlQRSB9IGZyb20gJy4uLy4uL21vZGVsLyc7XG5cbmV4cG9ydCBjbGFzcyBTYW1wbGVHZW5lcmF0b3IgZXh0ZW5kcyBNb2R1bGVVbml0IHtcbiAgY29uc3RydWN0b3IodHlwZSkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIHRoaXMuYmFja2dyb3VuZCA9ICdNb2R1bGVHZW5lcmF0b3InO1xuICAgIHRoaXMudyA9IDIyMDtcbiAgICB0aGlzLmggPSAyNTA7XG4gICAgdGhpcy5zb2NrZXRzID0ge1xuICAgICAgXCJGUkVRXCI6IG5ldyBJbnB1dFNvY2tldCgyOSwgdGhpcy5oIC0gMjksIFwiRlJFUVwiLCBGUkVRVUVOQ1lfVFlQRSksXG4gICAgICBcIlBBTlwiOiBuZXcgSW5wdXRTb2NrZXQoNzksIHRoaXMuaCAtIDI5LCBcIlBBTlwiLCBQQU5OSU5HX1RZUEUpLFxuICAgICAgXCJPVVRcIjogbmV3IE91dHB1dFNvY2tldCh0aGlzLncgLSAyOSwgdGhpcy5oIC0gMjksIFwiT1VUXCIsIEFVRElPX1RZUEUpLFxuICAgIH1cbiAgICB0aGlzLmRpYWxzID0ge1xuICAgICAgXCJwaXRjaFwiOiBuZXcgRGlhbCgyOSwgNDksIFwiRlJFUVwiLCAwLjAsIDIyMDAwLjAsIDAuMCksXG4gICAgICBcImdhaW5cIjogbmV3IERpYWwoNzksIDQ5LCBcIkdBSU5cIiwgMC4wLCA0LjAsIDEuMCksXG4gICAgICBcInBhbm5pbmdcIjogbmV3IERpYWwoMTI5LCA0OSwgXCJQQU5cIiwgMC4wLCAxLjAsIDAuNSksXG4gICAgICBcImF0dGFja1wiOiBuZXcgRGlhbCgyOSwgMTIwLCBcIkFUVEFDS1wiLCAwLjAsIDEwLjAsIDAuMSksXG4gICAgICBcImRlY2F5XCI6IG5ldyBEaWFsKDc5LCAxMjAsIFwiREVDQVlcIiwgMC4wLCAxMC4wLCAwLjEpLFxuICAgICAgXCJzdXN0YWluXCI6IG5ldyBEaWFsKDEyOSwgMTIwLCBcIlNVU1RBSU5cIiwgMC4wLCAxLjAsIDAuOCksXG4gICAgICBcInJlbGVhc2VcIjogbmV3IERpYWwoMTc5LCAxMjAsIFwiUkVMRUFTRVwiLCAwLjAsIDEwLCAwLjEpLFxuICAgIH1cbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBXYXZHZW5lcmF0b3IgZXh0ZW5kcyBNb2R1bGVVbml0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoXCJ3YXZcIik7XG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gJ01vZHVsZUdlbmVyYXRvcic7XG4gICAgdGhpcy53ID0gMjIwO1xuICAgIHRoaXMuaCA9IDI1MDtcbiAgICB0aGlzLmZpbGUgPSBcIlwiO1xuICAgIHRoaXMuaXNfcGl0Y2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuYmFzZV9waXRjaCA9IDQ0MC4wO1xuICAgIC8vIFRPRE86IGZpbGUgaW5wdXQgYW5kIGlzX3BpdGNoZWQgYm9vbGVhblxuICAgIHRoaXMuc29ja2V0cyA9IHtcbiAgICAgIFwiRlJFUVwiOiBuZXcgSW5wdXRTb2NrZXQoMjksIHRoaXMuaCAtIDI5LCBcIkZSRVFcIiwgRlJFUVVFTkNZX1RZUEUpLFxuICAgICAgXCJQQU5cIjogbmV3IElucHV0U29ja2V0KDc5LCB0aGlzLmggLSAyOSwgXCJQQU5cIiwgUEFOTklOR19UWVBFKSxcbiAgICAgIFwiT1VUXCI6IG5ldyBPdXRwdXRTb2NrZXQodGhpcy53IC0gMjksIHRoaXMuaCAtIDI5LCBcIk9VVFwiLCBBVURJT19UWVBFKSxcbiAgICB9XG4gICAgdGhpcy5kaWFscyA9IHtcbiAgICAgIFwicGl0Y2hcIjogbmV3IERpYWwoMjksIDQ5LCBcIkZSRVFcIiwgMC4wLCAyMjAwMC4wLCAwLjApLFxuICAgICAgXCJnYWluXCI6IG5ldyBEaWFsKDc5LCA0OSwgXCJHQUlOXCIsIDAuMCwgNC4wLCAxLjApLFxuICAgICAgXCJwYW5uaW5nXCI6IG5ldyBEaWFsKDEyOSwgNDksIFwiUEFOXCIsIDAuMCwgMS4wLCAwLjUpLFxuICAgICAgXCJhdHRhY2tcIjogbmV3IERpYWwoMjksIDEyMCwgXCJBVFRBQ0tcIiwgMC4wLCAxMC4wLCAwLjEpLFxuICAgICAgXCJkZWNheVwiOiBuZXcgRGlhbCg3OSwgMTIwLCBcIkRFQ0FZXCIsIDAuMCwgMTAuMCwgMC4xKSxcbiAgICAgIFwic3VzdGFpblwiOiBuZXcgRGlhbCgxMjksIDEyMCwgXCJTVVNUQUlOXCIsIDAuMCwgMS4wLCAwLjgpLFxuICAgICAgXCJyZWxlYXNlXCI6IG5ldyBEaWFsKDE3OSwgMTIwLCBcIlJFTEVBU0VcIiwgMC4wLCAxMCwgMC4xKSxcbiAgICB9XG4gIH1cblxuICBjb21waWxlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBcIndhdlwiOiB7XG4gICAgICAgIFwiZmlsZVwiOiB0aGlzLmZpbGUsXG4gICAgICAgIFwiZ2FpblwiOiB0aGlzLmRpYWxzW1wiZ2FpblwiXS52YWx1ZSxcbiAgICAgICAgXCJwaXRjaGVkXCI6IHRoaXMuaXNfcGl0Y2hlZCxcbiAgICAgICAgXCJiYXNlX3BpdGNoXCI6IHRoaXMuYmFzZV9waXRjaCxcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBJbnB1dFNvY2tldCwgT3V0cHV0U29ja2V0LCBEaWFsLCBNb2R1bGVVbml0IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy8nO1xuaW1wb3J0IHsgRlJFUVVFTkNZX1RZUEUgfSBmcm9tICcuLi8uLi9tb2RlbC8nO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNwb3NlIGV4dGVuZHMgTW9kdWxlVW5pdCB7XG4gIGNvbnN0cnVjdG9yKHR5cGUpIHtcbiAgICBzdXBlcih0eXBlKTtcbiAgICB0aGlzLmJhY2tncm91bmQgPSAnTW9kdWxlRGVyaXZlZCc7XG4gICAgdGhpcy53ID0gMTIwO1xuICAgIHRoaXMuaCA9IDE1MDtcbiAgICB0aGlzLnNvY2tldHMgPSB7XG4gICAgICBcIkZSRVEgSU5cIjogbmV3IElucHV0U29ja2V0KDI5LCB0aGlzLmggLSAyOSwgXCJGUkVRIElOXCIsIEZSRVFVRU5DWV9UWVBFKSxcbiAgICAgIFwiRlJFUVwiOiBuZXcgT3V0cHV0U29ja2V0KHRoaXMudyAtIDI5LCB0aGlzLmggLSAyOSwgXCJGUkVRXCIsIEZSRVFVRU5DWV9UWVBFKSxcbiAgICB9XG4gICAgdGhpcy5kaWFscyA9IHtcbiAgICAgIFwic2VtaXRvbmVzXCI6IG5ldyBEaWFsKDI5LCA0OSwgXCJTRU1JVE9ORVNcIiwgLTI0LCAyNCwgMC4wKSxcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFRoZW1lIH0gZnJvbSAnLi90aGVtZS5qcyc7XG5pbXBvcnQgeyBJbnN0cnVtZW50RWRpdG9yLCBJbnN0cnVtZW50IH0gZnJvbSAnLi9pbnN0cnVtZW50X2VkaXRvci8nO1xuaW1wb3J0IHsgVGltZWxpbmVFZGl0b3IsIENoYW5uZWxUcmFjaywgUmVnaXN0ZXJUcmFjayB9IGZyb20gJy4vdGltZWxpbmVfZWRpdG9yLyc7XG5pbXBvcnQgeyBDaGFubmVsLCBSZWdpc3RlciB9IGZyb20gJy4vbW9kZWwvJztcbmltcG9ydCB7IFNlcXVlbmNlRWRpdG9yLCBSZWdpc3RlclNlcXVlbmNlRWRpdG9yIH0gZnJvbSAnLi9zZXF1ZW5jZV9lZGl0b3IvJztcbmltcG9ydCB7IEFQSSB9IGZyb20gJy4vYXBpLyc7XG5cbmNsYXNzIFJlZ2lzdGVyRGVmaW5pdGlvbnMge1xuICBjb25zdHJ1Y3Rvcihpbml0V2l0aCkge1xuICAgIHRoaXMucmVzZXQoaW5pdFdpdGgpO1xuICB9XG4gIHJlc2V0KGluaXRXaXRoKSB7XG4gICAgdGhpcy5pbnRzID0gW107XG4gICAgdGhpcy5mbG9hdHMgPSBbXTtcbiAgICB0aGlzLmFycmF5cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzI7IGkrKykge1xuICAgICAgdGhpcy5pbnRzLnB1c2goW10pO1xuICAgICAgdGhpcy5mbG9hdHMucHVzaChbXSk7XG4gICAgICB0aGlzLmFycmF5cy5wdXNoKFtdKTtcbiAgICB9XG4gIH1cbiAgYWRkKG90aGVyUmVnaXN0ZXJEZWZpbml0aW9ucykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzI7IGkrKykge1xuICAgICAgZm9yICh2YXIgZGVmU2VxIG9mIG90aGVyUmVnaXN0ZXJEZWZpbml0aW9ucy5pbnRzW2ldKSB7XG4gICAgICAgIHRoaXMuaW50c1tpXS5wdXNoKGRlZlNlcSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBkZWZTZXEgb2Ygb3RoZXJSZWdpc3RlckRlZmluaXRpb25zLmZsb2F0c1tpXSkge1xuICAgICAgICB0aGlzLmZsb2F0c1tpXS5wdXNoKGRlZlNlcSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBkZWZTZXEgb2Ygb3RoZXJSZWdpc3RlckRlZmluaXRpb25zLmFycmF5c1tpXSkge1xuICAgICAgICB0aGlzLmFycmF5c1tpXS5wdXNoKGRlZlNlcSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEJsZWVwIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xuICAgIHRoaXMudGhlbWUgPSBuZXcgVGhlbWUoKTtcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5jYW52YXMub25tb3VzZWRvd24gPSB0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpXG4gICAgdGhpcy5jYW52YXMub25tb3VzZXVwID0gdGhpcy5oYW5kbGVNb3VzZVVwLmJpbmQodGhpcylcbiAgICB0aGlzLmNhbnZhcy5vbm1vdXNlbW92ZSA9IHRoaXMuaGFuZGxlTW91c2VNb3ZlLmJpbmQodGhpcylcbiAgICB0aGlzLnNlbGVjdGVkRWxlbSA9IG51bGw7XG4gICAgdGhpcy5zdGFydFNlbGVjdGVkUG9zID0ge307XG4gICAgdGhpcy5zZWxlY3RlZFBvcyA9IHt9O1xuICAgIHRoaXMuYXBpID0gbmV3IEFQSSh0aGlzKTtcbiAgICB0aGlzLmFwaS5zdGFydCgpO1xuICAgIHRoaXMuY2hhbm5lbHMgPSBbXTtcbiAgICB0aGlzLnJlZ2lzdGVycyA9IG5ldyBSZWdpc3RlckRlZmluaXRpb25zKCk7XG4gICAgdGhpcy50cmFja3MgPSBbXTtcbiAgICB0aGlzLm9wZW5UaW1lbGluZUVkaXRvcigpO1xuICAgIHRoaXMuZHJhdygpO1xuICB9XG5cbiAgLy8gYXBpIGNhbGxiYWNrXG4gIGluaXRpYWxpc2VDaGFubmVscyhjaGFubmVsRGVmcykge1xuICAgIHRoaXMuY2hhbm5lbHMgPSBbXTtcbiAgICB0aGlzLnRyYWNrcyA9IFtdO1xuICAgIHZhciBzZWVuUGVyY3Vzc2lvbkNoYW5uZWwgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBkZWYgb2YgY2hhbm5lbERlZnMpIHtcbiAgICAgIHZhciBjaCA9IG5ldyBDaGFubmVsKGRlZi5jaGFubmVsIHx8IDApO1xuICAgICAgY2gubG9hZEZyb21EZWZpbml0aW9uKGRlZik7XG4gICAgICB0aGlzLmNoYW5uZWxzLnB1c2goY2gpO1xuICAgICAgdGhpcy50cmFja3MucHVzaChuZXcgQ2hhbm5lbFRyYWNrKGNoLCB0aGlzKSk7XG4gICAgICBpZiAoY2guY2hhbm5lbE5yID09IDkpIHtcbiAgICAgICAgc2VlblBlcmN1c3Npb25DaGFubmVsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNoLmluc3RydW1lbnQgPSBuZXcgSW5zdHJ1bWVudCgpO1xuICAgICAgaWYgKGRlZi5nZW5lcmF0b3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIGNoYW5uZWwgZ2VuZXJhdG9yXCIsIGRlZi5nZW5lcmF0b3IpO1xuICAgICAgICBjaC5pbnN0cnVtZW50LmxvYWRGcm9tRGVmaW5pdGlvbihkZWYuZ2VuZXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKFwiTmV3IGNoYW5uZWxcIiwgZGVmKTtcbiAgICB9XG4gICAgaWYgKCFzZWVuUGVyY3Vzc2lvbkNoYW5uZWwpIHtcbiAgICAgIHZhciBjaCA9IG5ldyBDaGFubmVsKDkpO1xuICAgICAgdGhpcy5jaGFubmVscy5wdXNoKGNoKTtcbiAgICAgIHRoaXMudHJhY2tzLnB1c2gobmV3IENoYW5uZWxUcmFjayhjaCwgdGhpcykpO1xuICAgIH1cbiAgICB0aGlzLmFwaS5yZXF1ZXN0U2VxdWVuY2VyRGVmKCk7XG4gICAgdGhpcy5vcGVuVGltZWxpbmVFZGl0b3IoKTtcbiAgfVxuICBcbiAgLy8gYXBpIGNhbGxiYWNrXG4gIGluaXRpYWxpc2VTZXF1ZW5jZVRyYWNrcyhzZXF1ZW5jZXMpIHtcbiAgICB2YXIgY2hhbm5lbFNlcXVlbmNlcyA9IHt9O1xuICAgIGZvciAodmFyIGNoIG9mIHRoaXMuY2hhbm5lbHMpIHtcbiAgICAgIGNoYW5uZWxTZXF1ZW5jZXNbY2guY2hhbm5lbE5yXSA9IFtdO1xuICAgIH1cbiAgICB0aGlzLnJlZ2lzdGVycy5yZXNldCgoKSA9PiBbXSk7XG4gICAgZm9yICh2YXIgc2VxIG9mIHNlcXVlbmNlcykge1xuICAgICAgdmFyIGNoYW5uZWxzQW5kUmVnaXN0ZXJzID0gdGhpcy5zZXF1ZW5jZURlZkJ5Q2hhbm5lbEFuZFJlZ2lzdGVyKHNlcSk7XG4gICAgICB2YXIgZGVmcyA9IGNoYW5uZWxzQW5kUmVnaXN0ZXJzLmNoYW5uZWxTZXF1ZW5jZXM7XG4gICAgICBmb3IgKHZhciBjaCBvZiB0aGlzLmNoYW5uZWxzKSB7XG4gICAgICAgIGZvciAodmFyIHMgb2YgZGVmc1tjaC5jaGFubmVsTnJdKSB7XG4gICAgICAgICAgY2hhbm5lbFNlcXVlbmNlc1tjaC5jaGFubmVsTnJdLnB1c2gocyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRlZnMgPSBjaGFubmVsc0FuZFJlZ2lzdGVycy5yZWdpc3RlclNlcXVlbmNlcztcbiAgICAgIHRoaXMucmVnaXN0ZXJzLmFkZChkZWZzKTtcbiAgICB9XG4gICAgZm9yICh2YXIgdHJhY2sgb2YgdGhpcy50cmFja3MpIHtcbiAgICAgIGlmICh0cmFjayBpbnN0YW5jZW9mIENoYW5uZWxUcmFjaykge1xuICAgICAgICB0cmFjay5pbml0aWFsaXNlU2VxdWVuY2VUcmFja3MoY2hhbm5lbFNlcXVlbmNlc1t0cmFjay51bml0LmNoYW5uZWxOcl0pXG4gICAgICB9IGVsc2UgaWYgKHRyYWNrIGluc3RhbmNlb2YgUmVnaXN0ZXJUcmFjaykge1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDMyOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnJlZ2lzdGVycy5pbnRzW2ldLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHRyYWNrID0gbmV3IFJlZ2lzdGVyVHJhY2sobmV3IFJlZ2lzdGVyKGksIFwicmVnaXN0ZXJcIiksIHRoaXMpO1xuICAgICAgICB0cmFjay5pbml0aWFsaXNlU2VxdWVuY2VUcmFja3ModGhpcy5yZWdpc3RlcnMuaW50c1tpXSk7XG4gICAgICAgIHRoaXMudHJhY2tzLnB1c2godHJhY2spO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucmVnaXN0ZXJzLmZsb2F0c1tpXS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciB0cmFjayA9IG5ldyBSZWdpc3RlclRyYWNrKG5ldyBSZWdpc3RlcihpLCBcImZsb2F0X3JlZ2lzdGVyXCIpLCB0aGlzKTtcbiAgICAgICAgdHJhY2suaW5pdGlhbGlzZVNlcXVlbmNlVHJhY2tzKHRoaXMucmVnaXN0ZXJzLmZsb2F0c1tpXSk7XG4gICAgICAgIHRoaXMudHJhY2tzLnB1c2godHJhY2spO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucmVnaXN0ZXJzLmFycmF5c1tpXS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciB0cmFjayA9IG5ldyBSZWdpc3RlclRyYWNrKG5ldyBSZWdpc3RlcihpLCBcImFycmF5X3JlZ2lzdGVyXCIpLCB0aGlzKTtcbiAgICAgICAgdHJhY2suaW5pdGlhbGlzZVNlcXVlbmNlVHJhY2tzKHRoaXMucmVnaXN0ZXJzLmFycmF5c1tpXSk7XG4gICAgICAgIHRoaXMudHJhY2tzLnB1c2godHJhY2spO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm9wZW5UaW1lbGluZUVkaXRvcigpO1xuICAgIC8vdGhpcy51cGxvYWRTZXF1ZW5jZXJEZWYoKTtcbiAgfVxuXG4gIGNvbXBpbGUoKSB7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIFwiYnBtXCI6IDEyMCxcbiAgICAgIFwiZ3JhbnVsYXJpdHlcIjogNjQsXG4gICAgICBcImNoYW5uZWxzXCI6IFtdLFxuICAgICAgXCJzZXF1ZW5jZXNcIjogW10sXG4gICAgfTtcbiAgICBmb3IgKHZhciB0cmFjayBvZiB0aGlzLnRyYWNrcykge1xuICAgICAgdmFyIHRyYWNrUmVzdWx0ID0gdHJhY2suY29tcGlsZSgpO1xuICAgICAgaWYgKHRyYWNrUmVzdWx0LnRyYWNrKSB7XG4gICAgICAgIHJlc3VsdC50cmFja3MucHVzaCh0cmFja1Jlc3VsdC50cmFjayk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBzIG9mIHRyYWNrUmVzdWx0LnNlcXVlbmNlcykge1xuICAgICAgICByZXN1bHQuc2VxdWVuY2VzLnB1c2gocyk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHVwbG9hZFNlcXVlbmNlckRlZigpIHtcbiAgICB0aGlzLmFwaS5zZXRTZXF1ZW5jZXJEZWYodGhpcy5jb21waWxlKCkpO1xuICB9XG5cbiAgc2VxdWVuY2VEZWZCeUNoYW5uZWxBbmRSZWdpc3RlcihzZXEpIHtcbiAgICB2YXIgY2hhbm5lbFNlcXVlbmNlcyA9IHt9O1xuICAgIHZhciByZWdpc3RlclNlcXVlbmNlcyA9IG5ldyBSZWdpc3RlckRlZmluaXRpb25zKCk7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIGNoYW5uZWxTZXF1ZW5jZXM6IGNoYW5uZWxTZXF1ZW5jZXMsXG4gICAgICByZWdpc3RlclNlcXVlbmNlczogcmVnaXN0ZXJTZXF1ZW5jZXMsXG4gICAgfVxuICAgIGZvciAodmFyIGNoIG9mIHRoaXMuY2hhbm5lbHMpIHtcbiAgICAgIGNoYW5uZWxTZXF1ZW5jZXNbY2guY2hhbm5lbE5yXSA9IFtdO1xuICAgIH1cbiAgICB2YXIgbGVhdmVzID0gW1wicGxheV9ub3RlXCIsIFwicGxheV9ub3Rlc1wiLCBcInZvbHVtZVwiLFxuICAgICAgICAgICAgICAgICAgXCJscGZfY3V0b2ZmXCIsIFwiaHBmX2N1dG9mZlwiLCBcInBhbm5pbmdcIl07XG4gICAgZm9yICh2YXIgbGVhZiBvZiBsZWF2ZXMpIHtcbiAgICAgIGlmIChzZXFbbGVhZl0pIHtcbiAgICAgICAgdmFyIHMgPSBzZXFbbGVhZl07XG4gICAgICAgIGlmIChjaGFubmVsU2VxdWVuY2VzW3MuY2hhbm5lbF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNoYW5uZWxTZXF1ZW5jZXNbcy5jaGFubmVsXS5wdXNoKHNlcSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJNaXNzaW5nIGNoYW5uZWxcIiwgcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzZXFbXCJyZWdpc3RlclwiXSkge1xuICAgICAgaWYgKHNlcS5yZWdpc3Rlci5yZWdpc3RlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlZ2lzdGVyU2VxdWVuY2VzLmludHNbc2VxLnJlZ2lzdGVyLnJlZ2lzdGVyXS5wdXNoKHNlcSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0OztcbiAgICB9IGVsc2UgaWYgKHNlcVtcImZsb2F0X3JlZ2lzdGVyXCJdKSB7XG4gICAgICBpZiAoc2VxLmZsb2F0X3JlZ2lzdGVyLnJlZ2lzdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmVnaXN0ZXJTZXF1ZW5jZXMuZmxvYXRzW3NlcS5mbG9hdF9yZWdpc3Rlci5yZWdpc3Rlcl0ucHVzaChzZXEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDs7XG4gICAgfSBlbHNlIGlmIChzZXFbXCJhcnJheV9yZWdpc3RlclwiXSkge1xuICAgICAgaWYgKHNlcS5hcnJheV9yZWdpc3Rlci5yZWdpc3RlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlZ2lzdGVyU2VxdWVuY2VzLmFycmF5c1tzZXEuYXJyYXlfcmVnaXN0ZXIucmVnaXN0ZXJdLnB1c2goc2VxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7O1xuICAgIH1cblxuXG4gICAgdmFyIHdyYXBwZWRTZXF1ZW5jZXMgPSBbXCJyZXBlYXRcIiwgXCJhZnRlclwiLCBcImJlZm9yZVwiLCBcImV1Y2xpZGlhblwiLCBcIm9mZnNldFwiXTtcbiAgICBmb3IgKHZhciB3cmFwcGVkIG9mIHdyYXBwZWRTZXF1ZW5jZXMpIHtcbiAgICAgIGlmIChzZXFbd3JhcHBlZF0pIHtcbiAgICAgICAgaWYgKCFzZXFbd3JhcHBlZF0uc2VxdWVuY2UpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIk1pc3Npbmcgc2VxdWVuY2VcIiwgc2VxKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3ViUmVzdWx0ID0gdGhpcy5zZXF1ZW5jZURlZkJ5Q2hhbm5lbEFuZFJlZ2lzdGVyKHNlcVt3cmFwcGVkXS5zZXF1ZW5jZSlcbiAgICAgICAgdmFyIGNoID0gc3ViUmVzdWx0LmNoYW5uZWxTZXF1ZW5jZXM7XG4gICAgICAgIHZhciBtZXJnZXIgPSAoZGVmU2VxKSA9PiB7XG4gICAgICAgICAgdmFyIG1lcmdlZCA9IHt9O1xuICAgICAgICAgIGZvciAodmFyIGtleSBvZiBPYmplY3Qua2V5cyhzZXEpKSB7XG4gICAgICAgICAgICBtZXJnZWRba2V5XSA9IHNlcVtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtZXJnZWQuc2VxdWVuY2UgPSBkZWZTZXE7XG4gICAgICAgICAgcmV0dXJuIG1lcmdlZDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBjaGFubmVsTnIgb2YgT2JqZWN0LmtleXMoY2gpKSB7XG4gICAgICAgICAgdmFyIHNlcXMgPSBjaFtjaGFubmVsTnJdO1xuICAgICAgICAgIGlmIChzZXFzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IFxuICAgICAgICAgIGZvciAodmFyIGRlZlNlcSBvZiBzZXFzKSB7XG4gICAgICAgICAgICBjaGFubmVsU2VxdWVuY2VzW2NoYW5uZWxOcl0ucHVzaChtZXJnZXIoZGVmU2VxKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciByZWdpc3RlcnMgPSBzdWJSZXN1bHQucmVnaXN0ZXJTZXF1ZW5jZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzI7IGkrKykge1xuICAgICAgICAgIGZvciAodmFyIGRlZlNlcSBvZiByZWdpc3RlcnMuaW50c1tpXSkge1xuICAgICAgICAgICAgcmVnaXN0ZXJTZXF1ZW5jZXMuaW50c1tpXS5wdXNoKG1lcmdlcihkZWZTZXEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yICh2YXIgZGVmU2VxIG9mIHJlZ2lzdGVycy5mbG9hdHNbaV0pIHtcbiAgICAgICAgICAgIHJlZ2lzdGVyU2VxdWVuY2VzLmZsb2F0c1tpXS5wdXNoKG1lcmdlcihkZWZTZXEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yICh2YXIgZGVmU2VxIG9mIHJlZ2lzdGVycy5hcnJheXNbaV0pIHtcbiAgICAgICAgICAgIHJlZ2lzdGVyU2VxdWVuY2VzLmFycmF5c1tpXS5wdXNoKG1lcmdlcihkZWZTZXEpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNlcS5jb21iaW5lKSB7XG4gICAgICBmb3IgKHZhciBzZXEgb2Ygc2VxLmNvbWJpbmUpIHtcbiAgICAgICAgdmFyIHN1YlJlc3VsdCA9IHRoaXMuc2VxdWVuY2VEZWZCeUNoYW5uZWxBbmRSZWdpc3RlcihzZXEpO1xuICAgICAgICB2YXIgZGVmcyA9IHN1YlJlc3VsdC5jaGFubmVsU2VxdWVuY2VzO1xuICAgICAgICBmb3IgKHZhciBjaCBvZiB0aGlzLmNoYW5uZWxzKSB7XG4gICAgICAgICAgZm9yICh2YXIgcyBvZiBkZWZzW2NoLmNoYW5uZWxOcl0pIHtcbiAgICAgICAgICAgIGNoYW5uZWxTZXF1ZW5jZXNbY2guY2hhbm5lbE5yXS5wdXNoKHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWdpc3RlclNlcXVlbmNlcy5hZGQoc3ViUmVzdWx0LnJlZ2lzdGVyU2VxdWVuY2VzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJ1bmtub3duIGRlZlwiLCBzZXEpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgb3Blbkluc3RydW1lbnRFZGl0b3IoaW5zdHIpIHtcbiAgICB0aGlzLmFjdGl2ZSA9IG5ldyBJbnN0cnVtZW50RWRpdG9yKHRoaXMsIGluc3RyLCB0aGlzLm9wZW5UaW1lbGluZUVkaXRvci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmRyYXcoKVxuICB9XG4gIG9wZW5UaW1lbGluZUVkaXRvcigpIHtcbiAgICB0aGlzLmFjdGl2ZSA9IG5ldyBUaW1lbGluZUVkaXRvcih0aGlzLnRyYWNrcywgdGhpcyk7XG4gICAgdGhpcy5kcmF3KCk7XG4gIH1cbiAgb3BlblNlcXVlbmNlRWRpdG9yKHNlcXVlbmNlLCBjaGFubmVsTnIpIHtcbiAgICB0aGlzLmFjdGl2ZSA9IG5ldyBTZXF1ZW5jZUVkaXRvcih0aGlzLCBzZXF1ZW5jZSwgY2hhbm5lbE5yLCB0aGlzLm9wZW5UaW1lbGluZUVkaXRvci5iaW5kKHRoaXMpKVxuICAgIHRoaXMuZHJhdygpO1xuICB9XG4gIG9wZW5SZWdpc3RlclNlcXVlbmNlRWRpdG9yKHNlcXVlbmNlLCByZWdpc3Rlcikge1xuICAgIHRoaXMuYWN0aXZlID0gbmV3IFJlZ2lzdGVyU2VxdWVuY2VFZGl0b3IodGhpcywgc2VxdWVuY2UsIHJlZ2lzdGVyLCB0aGlzLm9wZW5UaW1lbGluZUVkaXRvci5iaW5kKHRoaXMpKVxuICAgIHRoaXMuZHJhdygpO1xuICB9XG5cbiAgaGFuZGxlTW91c2VEb3duKGUpIHtcbiAgICB2YXIgYm91bmQgPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHZhciB4ID0gZS5jbGllbnRYIC0gYm91bmQubGVmdDsgXG4gICAgdmFyIHkgPSBlLmNsaWVudFkgLSBib3VuZC50b3A7XG4gICAgdGhpcy5zZWxlY3RlZEVsZW0gPSBudWxsO1xuICAgIHRoaXMuc2VsZWN0ZWRQb3MgPSB7fTtcbiAgICBpZiAodGhpcy5hY3RpdmUuaGFuZGxlTW91c2VEb3duKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuYWN0aXZlLmhhbmRsZU1vdXNlRG93bih0aGlzLCB4LCB5KTtcbiAgICAgIGlmIChlbGVtKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRFbGVtID0gZWxlbTtcbiAgICAgICAgdGhpcy5zdGFydFNlbGVjdGVkUG9zID0ge3gsIHl9O1xuICAgICAgICB0aGlzLnNlbGVjdGVkUG9zID0ge3gsIHl9O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlVXAoZSkge1xuICAgIHZhciBib3VuZCA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgdmFyIHggPSBlLmNsaWVudFggLSBib3VuZC5sZWZ0OyBcbiAgICB2YXIgeSA9IGUuY2xpZW50WSAtIGJvdW5kLnRvcDtcbiAgICBpZiAodGhpcy5zZWxlY3RlZEVsZW0pIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy5zZWxlY3RlZEVsZW07XG4gICAgICB2YXIgc3ggPSB0aGlzLnN0YXJ0U2VsZWN0ZWRQb3MueDtcbiAgICAgIHZhciBzeSA9IHRoaXMuc3RhcnRTZWxlY3RlZFBvcy55O1xuICAgICAgaWYgKHN4ID49IHggLTUgJiYgc3ggPD0geCArIDUgJiYgc3kgPj0geSAtIDUgJiYgc3kgPD0geSArIDUpIHtcbiAgICAgICAgaWYgKGVsZW0uaGFuZGxlQ2xpY2spIHtcbiAgICAgICAgICBlbGVtLmhhbmRsZUNsaWNrKHRoaXMsIHgsIHkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZWxlbS5oYW5kbGVEcm9wKSB7XG4gICAgICAgICAgZWxlbS5oYW5kbGVEcm9wKHRoaXMsIHgsIHkpO1xuICAgICAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnNlbGVjdGVkRWxlbSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VNb3ZlKGUpIHtcbiAgICB2YXIgYm91bmQgPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHZhciB4ID0gZS5jbGllbnRYIC0gYm91bmQubGVmdDsgXG4gICAgdmFyIHkgPSBlLmNsaWVudFkgLSBib3VuZC50b3A7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRFbGVtKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuc2VsZWN0ZWRFbGVtO1xuICAgICAgdmFyIHN4ID0gdGhpcy5zZWxlY3RlZFBvcy54O1xuICAgICAgdmFyIHN5ID0gdGhpcy5zZWxlY3RlZFBvcy55O1xuICAgICAgaWYgKHN4ID49IHggLTUgJiYgc3ggPD0geCArIDUgJiYgc3kgPj0geSAtIDUgJiYgc3kgPD0geSArIDUpIHtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChlbGVtLmhhbmRsZURyYWcpIHtcbiAgICAgICAgICBlbGVtLmhhbmRsZURyYWcodGhpcywgeCAtIHN4LCB5IC0gc3ksIHgsIHksIHN4LCBzeSk7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZFBvcyA9IHt4LCB5fTtcbiAgICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgdmFyIHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdmFyIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB2YXIgYm91bmQgPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvd1dpZHRoO1xuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvd0hlaWdodCAtIGJvdW5kLnRvcDtcbiAgICBib2R5LnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLnRoZW1lLmNvbG91cnMuQmFja2dyb3VuZDtcbiAgICBib2R5LnN0eWxlLmNvbG9yID0gdGhpcy50aGVtZS5jb2xvdXJzLkZvcmVncm91bmQ7XG4gICAgdGhpcy5hY3RpdmUuZHJhdyh0aGlzKTtcbiAgfVxufVxuXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xuICB0cnkgeyBcbiAgbmV3IEJsZWVwKCk7XG4gIH0gY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIGFsZXJ0KGUpO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ2hhbm5lbCB7XG4gIGNvbnN0cnVjdG9yKGNoYW5uZWxOcikge1xuICAgIHRoaXMuY2hhbm5lbE5yID0gY2hhbm5lbE5yO1xuICAgIHRoaXMuaW5zdHJ1bWVudCA9IG51bGw7XG4gICAgdGhpcy5uYW1lID0gXCJVbnRpdGxlZCBcIiArIHRoaXMuY2hhbm5lbE5yO1xuICAgIHRoaXMubG9hZEZyb21EZWZpbml0aW9uKHt9KTtcbiAgfVxuXG4gIGxvYWRGcm9tRGVmaW5pdGlvbihkZWYpIHtcbiAgICB0aGlzLmJhbmsgPSBkZWYuYmFuayB8fCBudWxsO1xuICAgIHRoaXMuYmFua0luZGV4ID0gZGVmLmluc3RydW1lbnQgfHwgbnVsbDtcbiAgICB0aGlzLnJldmVyYiA9IGRlZi5yZXZlcmIgfHwgMDtcbiAgICB0aGlzLnJldmVyYlRpbWUgPSBkZWYucmV2ZXJiX3RpbWUgfHwgMDtcbiAgICB0aGlzLnJldmVyYkZlZWRiYWNrID0gZGVmLnJldmVyYl9mZWVkYmFjayB8fCAwO1xuICAgIHRoaXMudHJlbWVsbyA9IGRlZi50cmVtZWxvIHx8IDA7XG4gICAgdGhpcy52b2x1bWUgPSBkZWYudm9sdW1lIHx8IDEwMDtcbiAgICB0aGlzLnBhbm5pbmcgPSBkZWYucGFubmluZyB8fCA2NDtcbiAgICB0aGlzLmxwZkN1dG9mZiA9IGRlZi5scGZfY3V0b2ZmIHx8IDA7XG4gICAgdGhpcy5ocGZDdXRvZmYgPSBkZWYuaHBmX2N1dG9mZiB8fCAwO1xuICAgIHRoaXMuZ3JhaW4gPSBkZWYuZ3JhaW4gfHwgbnVsbDtcbiAgfVxuICBnZXRDb21waWxlVGFyZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWxOcjtcbiAgfVxuICBjb21waWxlKHNlcXVlbmNlVHJhY2tzKSB7XG4gICAgdmFyIGNoYW5uZWwgPSB7XG4gICAgICBcImNoYW5uZWxcIjogdGhpcy5jaGFubmVsTnIsXG4gICAgICBcImdlbmVyYXRvclwiOiB0aGlzLmluc3RydW1lbnQgPyB0aGlzLmluc3RydW1lbnQuY29tcGlsZSgpIDogbnVsbCxcbiAgICAgIFwiYmFua1wiOiB0aGlzLmJhbmssXG4gICAgICBcImluc3RydW1lbnRcIjogdGhpcy5iYW5rSW5kZXgsXG4gICAgICBcInJldmVyYlwiOiB0aGlzLnJldmVyYixcbiAgICAgIFwicmV2ZXJiX3RpbWVcIjogdGhpcy5yZXZlcmJUaW1lLFxuICAgICAgXCJyZXZlcmJfZmVlZGJhY2tcIjogdGhpcy5yZXZlcmJGZWVkYmFjayxcbiAgICAgIFwidHJlbWVsb1wiOiB0aGlzLnRyZW1lbG8sXG4gICAgICBcInZvbHVtZVwiOiB0aGlzLnZvbHVtZSxcbiAgICAgIFwicGFubmluZ1wiOiB0aGlzLnBhbm5pbmcsXG4gICAgICBcImxwZl9jdXRvZmZcIjogdGhpcy5scGZDdXRvZmYsXG4gICAgICBcImhwZl9jdXRvZmZcIjogdGhpcy5ocGZDdXRvZmYsXG4gICAgICBcImdyYWluXCI6IHRoaXMuZ3JhaW4sXG4gICAgfTtcbiAgICB2YXIgc2VxdWVuY2VzID0gW107XG4gICAgZm9yICh2YXIgdHIgb2Ygc2VxdWVuY2VUcmFja3MpIHtcbiAgICAgIHZhciB0clJlc3VsdCA9IHRyLmNvbXBpbGUoKTtcbiAgICAgIGlmICh0clJlc3VsdCkge1xuICAgICAgICBzZXF1ZW5jZXMucHVzaCh0clJlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBcImNoYW5uZWxcIjogY2hhbm5lbCxcbiAgICAgIFwic2VxdWVuY2VzXCI6IHNlcXVlbmNlcyxcbiAgICB9O1xuICB9XG59XG4iLCJleHBvcnQgeyBQYXRjaGFibGUgfSBmcm9tICcuL3BhdGNoYWJsZS5qcyc7XG5leHBvcnQgeyBSZWdpc3RlciB9IGZyb20gJy4vcmVnaXN0ZXIuanMnO1xuZXhwb3J0IHsgQ2hhbm5lbCB9IGZyb20gJy4vY2hhbm5lbC5qcyc7XG5leHBvcnQgKiBmcm9tICcuL3R5cGVzLmpzJztcbiIsImltcG9ydCB7IFBhdGNoLCBNb2R1bGUgfSBmcm9tICcuLi9jb21wb25lbnRzLyc7XG5cbmV4cG9ydCBjbGFzcyBQYXRjaGFibGUge1xuICBjb25zdHJ1Y3Rvcihtb2R1bGVzLCBwYXRjaGVzKSB7XG4gICAgdGhpcy5tb2R1bGVzID0gbW9kdWxlcztcbiAgICB0aGlzLnBhdGNoZXMgPSBwYXRjaGVzO1xuICB9XG4gIF9hZGRQYXRjaChmcm9tTW9kdWxlLCB0b01vZHVsZSwgZnJvbVNvY2tldCwgdG9Tb2NrZXQsIHR5cGUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0b01vZHVsZSkpIHtcbiAgICAgIGZvciAodmFyIHRvIG9mIHRvTW9kdWxlKSB7XG4gICAgICAgIHRoaXMuX2FkZFBhdGNoKGZyb21Nb2R1bGUsIHRvLCBmcm9tU29ja2V0LCB0b1NvY2tldCwgdHlwZSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBwID0gbmV3IFBhdGNoKGZyb21Nb2R1bGUsIHRvTW9kdWxlLCBmcm9tU29ja2V0LCB0b1NvY2tldCwgdHlwZSk7XG4gICAgdGhpcy5wYXRjaGVzLnB1c2gocCk7XG4gIH1cbiAgYWRkUGF0Y2goZnJvbU1vZCwgdG9Nb2QsIGZyb21Tb2NrZXQsIHRvU29ja2V0KSB7XG4gICAgdmFyIGZyb20gPSBudWxsO1xuICAgIHZhciB0byA9IG51bGw7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBtID0gdGhpcy5tb2R1bGVzW2ldO1xuICAgICAgaWYgKG0gPT09IGZyb21Nb2QpIHtcbiAgICAgICAgZnJvbSA9IGk7XG4gICAgICB9XG4gICAgICBpZiAobSA9PT0gdG9Nb2QpIHtcbiAgICAgICAgdG8gPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZnJvbSA9PT0gbnVsbCB8fCB0byA9PT0gbnVsbCB8fCAoZnJvbSA9PT0gdG8gJiYgZnJvbVNvY2tldCA9PT0gdG9Tb2NrZXQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMubW9kdWxlc1tmcm9tXS51bml0LnNvY2tldHNbZnJvbVNvY2tldF0udHlwZSAhPSB0aGlzLm1vZHVsZXNbdG9dLnVuaXQuc29ja2V0c1t0b1NvY2tldF0udHlwZSkge1xuICAgICAgYWxlcnQoXCJXcm9uZyB0eXBlc1wiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHBhdGNoID0gbmV3IFBhdGNoKGZyb20sIHRvLCBmcm9tU29ja2V0LCB0b1NvY2tldCwgdGhpcy5tb2R1bGVzW2Zyb21dLnVuaXQuc29ja2V0c1tmcm9tU29ja2V0XS50eXBlKTtcbiAgICB2YXIgcmVtb3ZlID0gbnVsbDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHAgPSB0aGlzLnBhdGNoZXNbaV07XG4gICAgICBpZiAocC5pc0lzb21vcnBoaWMocGF0Y2gpKSB7XG4gICAgICAgIHJlbW92ZSA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocmVtb3ZlID09PSBudWxsKSB7XG4gICAgICB0aGlzLnBhdGNoZXMucHVzaChwYXRjaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGF0Y2hlcy5zcGxpY2UocmVtb3ZlLCAxKTtcbiAgICB9XG4gIH1cbiAgYWRkTW9kdWxlKHVuaXQpIHtcbiAgICB2YXIgbSA9IG5ldyBNb2R1bGUodGhpcywgTWF0aC5yYW5kb20oKSAqIDgwMCArIDEwMCwgTWF0aC5yYW5kb20oKSAqIDYwMCwgdW5pdCk7XG4gICAgdGhpcy5tb2R1bGVzLnB1c2gobSk7XG4gICAgcmV0dXJuIHRoaXMubW9kdWxlcy5sZW5ndGggLSAxO1xuICB9XG5cbn1cbiIsImltcG9ydCB7IElOVF9UWVBFLCBJTlRfQVJSQVlfVFlQRSwgRkxPQVRfVFlQRSB9IGZyb20gJy4vdHlwZXMuanMnO1xuXG5leHBvcnQgY2xhc3MgUmVnaXN0ZXIge1xuICBjb25zdHJ1Y3RvcihyZWdpc3RlciwgdHlwZSkge1xuICAgIHRoaXMucmVnaXN0ZXIgPSByZWdpc3RlcjtcbiAgICB0aGlzLnR5cGUgPSB0eXBlIHx8IFwicmVnaXN0ZXJcIjtcbiAgICB0aGlzLnNvY2tldFR5cGUgPSBJTlRfVFlQRTtcbiAgICBpZiAodHlwZSA9PSBcImFycmF5X3JlZ2lzdGVyXCIpIHtcbiAgICAgIHRoaXMuc29ja2V0VHlwZSA9IElOVF9BUlJBWV9UWVBFO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImZsb2F0X3JlZ2lzdGVyXCIpIHtcbiAgICAgIHRoaXMuc29ja2V0VHlwZSA9IEZMT0FUX1RZUEU7XG4gICAgfVxuICB9XG4gIGdldENvbXBpbGVUYXJnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgY29tcGlsZShzZXF1ZW5jZVRyYWNrcykge1xuICAgIHZhciBzZXF1ZW5jZXMgPSBbXTtcbiAgICBmb3IgKHZhciB0ciBvZiBzZXF1ZW5jZVRyYWNrcykge1xuICAgICAgdmFyIHRyUmVzdWx0ID0gdHIuY29tcGlsZSgpO1xuICAgICAgaWYgKHRyUmVzdWx0KSB7XG4gICAgICAgIHNlcXVlbmNlcy5wdXNoKHRyUmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIFwic2VxdWVuY2VzXCI6IHNlcXVlbmNlcyxcbiAgICB9O1xuICB9XG59XG4iLCJleHBvcnQgY29uc3QgQVVESU9fVFlQRSA9IDE7XG5leHBvcnQgY29uc3QgRlJFUVVFTkNZX1RZUEUgPSAyO1xuZXhwb3J0IGNvbnN0IFBBTk5JTkdfVFlQRSA9IDM7XG5leHBvcnQgY29uc3QgQ0xPQ0tfVFlQRSA9IDQ7XG5leHBvcnQgY29uc3QgVFJJR0dFUl9UWVBFID0gNTtcbmV4cG9ydCBjb25zdCBJTlRfVFlQRSA9IDY7XG5leHBvcnQgY29uc3QgRkxPQVRfVFlQRSA9IDc7XG5leHBvcnQgY29uc3QgSU5UX0FSUkFZX1RZUEUgPSA4O1xuIiwiXG5pbXBvcnQgeyBFZGl0b3IsIEJ1dHRvbiwgTW9kdWxlIH0gZnJvbSAnLi4vY29tcG9uZW50cy8nO1xuaW1wb3J0IHsgU2VxdWVuY2UgfSBmcm9tICcuL3NlcXVlbmNlLmpzJztcbmltcG9ydCB7IFNlcXVlbmNlSW5wdXQsIFNlcXVlbmNlT3V0cHV0LCBQdWxzZSwgRXVjbGlkaWFuLCBQbGF5Tm90ZSwgUGxheU5vdGVzLCBSYW5nZSwgVHJhbnNwb3NlLCBSZWdpc3RlciwgSW50QXJyYXlSZWdpc3RlckluZGV4LCBUcmFuc3Bvc2VJbnRBcnJheSwgSW50QXJyYXlSZWdpc3RlciwgT2Zmc2V0LCBSZWdpc3Rlck91dHB1dCwgQ3ljbGVDaG9yZHMgfSBmcm9tICcuL21vZHVsZV91bml0cy8nO1xuXG5leHBvcnQgY2xhc3MgQmFzZVNlcXVlbmNlRWRpdG9yIGV4dGVuZHMgRWRpdG9yIHtcbiAgY29uc3RydWN0b3IoYXBwLCBzZXF1ZW5jZSwgc2VxdWVuY2VUYXJnZXQsIGhhbmRsZUNsb3NlKSB7XG4gICAgc3VwZXIoYXBwLCBzZXF1ZW5jZSwgaGFuZGxlQ2xvc2UpO1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICAgIGlmICghc2VxdWVuY2UpIHtcbiAgICAgIHNlcXVlbmNlID0gbmV3IFNlcXVlbmNlKHNlcXVlbmNlVGFyZ2V0LCBbXSwgW10pO1xuICAgICAgdmFyIG1vZHVsZXMgPSBbXG4gICAgICAgIG5ldyBNb2R1bGUoc2VxdWVuY2UsIDMwLCA1MCwgbmV3IFNlcXVlbmNlSW5wdXQoJ2lucHV0JykpLCBcbiAgICAgIF07XG4gICAgICBzZXF1ZW5jZS5tb2R1bGVzID0gbW9kdWxlcztcbiAgICB9XG4gICAgdGhpcy50YXJnZXQgPSBzZXF1ZW5jZTtcbiAgfVxuICBhZGRCdXR0b25EZWZpbml0aW9ucyhidXR0b25EZWZzKSB7XG4gICAgdmFyIHggPSAwO1xuICAgIHZhciBwcmV2ID0gbnVsbDtcbiAgICB2YXIgcGFkZGluZyA9IDA7XG4gICAgdmFyIGdyb3VwUGFkZGluZyA9IDE1O1xuICAgIGZvciAodmFyIGRlZiBvZiBidXR0b25EZWZzKSB7XG4gICAgICB2YXIgYiA9IG5ldyBCdXR0b24oeCwgdGhpcy5hcHAudGhlbWUucGFkZGluZywgZGVmLm9uY2xpY2suYmluZCh0aGlzKSwgZGVmLmxhYmVsKTtcbiAgICAgIGIuY29sb3VyID0gdGhpcy5hcHAudGhlbWUuY29sb3Vyc1tkZWYuY29sb3VyXSB8fCB0aGlzLmFwcC50aGVtZS5jb2xvdXJzLk1vZHVsZUdlbmVyYXRvcjtcbiAgICAgIHRoaXMuYnV0dG9ucy5wdXNoKGIpO1xuICAgICAgaWYgKHByZXYgJiYgcHJldi5jb2xvdXIgIT0gZGVmLmNvbG91cikge1xuICAgICAgICB4ICs9IGdyb3VwUGFkZGluZztcbiAgICAgICAgYi54ICs9IGdyb3VwUGFkZGluZztcbiAgICAgIH1cbiAgICAgIHggKz0gYi53ICsgcGFkZGluZztcbiAgICAgIHByZXYgPSBkZWY7XG4gICAgfVxuXG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBTZXF1ZW5jZUVkaXRvciBleHRlbmRzIEJhc2VTZXF1ZW5jZUVkaXRvciB7XG4gIGNvbnN0cnVjdG9yKGFwcCwgc2VxdWVuY2UsIGNoYW5uZWxOciwgaGFuZGxlQ2xvc2UpIHtcbiAgICBzdXBlcihhcHAsIHNlcXVlbmNlLCBjaGFubmVsTnIsIGhhbmRsZUNsb3NlKTtcbiAgICB2YXIgYnV0dG9uRGVmcyA9IFtcbiAgICAgICAge2xhYmVsOiBcIvCdhZ1cIiwgY29sb3VyOiAnTW9kdWxlUHVsc2UnLCBvbmNsaWNrOiAoKSA9PiB0aGlzLmhhbmRsZUFkZFVuaXQoKCkgPT4gbmV3IFB1bHNlKDQpKX0sXG4gICAgICAgIHtsYWJlbDogXCLwnYWeXCIsIGNvbG91cjogJ01vZHVsZVB1bHNlJywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBQdWxzZSgyKSl9LFxuICAgICAgICB7bGFiZWw6IFwi4pmpXCIsIGNvbG91cjogJ01vZHVsZVB1bHNlJywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBQdWxzZSgxKSl9LFxuICAgICAgICB7bGFiZWw6IFwi4pmqXCIsIGNvbG91cjogJ01vZHVsZVB1bHNlJywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBQdWxzZSgwLjUpKX0sXG4gICAgICAgIHtsYWJlbDogXCLwnYWhXCIsIGNvbG91cjogJ01vZHVsZVB1bHNlJywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBQdWxzZSgwLjI1KSl9LFxuICAgICAgICB7bGFiZWw6IFwi8J2FolwiLCBjb2xvdXI6ICdNb2R1bGVQdWxzZScsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgUHVsc2UoMC4xMjUpKX0sXG4gICAgICAgIHtsYWJlbDogXCJQVUxTXCIsIGNvbG91cjogJ01vZHVsZVB1bHNlJywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBQdWxzZSgpKX0sXG4gICAgICAgIHtsYWJlbDogXCJFVUNMXCIsIGNvbG91cjogJ01vZHVsZVB1bHNlJywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBFdWNsaWRpYW4oKSl9LFxuICAgICAgICB7bGFiZWw6IFwiT0ZGU0VUXCIsIGNvbG91cjogJ01vZHVsZVB1bHNlJywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBPZmZzZXQoKSl9LFxuXG4gICAgICAgIHtsYWJlbDogXCJOT1RFXCIsIGNvbG91cjogJ01vZHVsZU91dHB1dCcsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgUGxheU5vdGUoY2hhbm5lbE5yKSl9LFxuICAgICAgICB7bGFiZWw6IFwiTk9URVNcIiwgY29sb3VyOiAnTW9kdWxlT3V0cHV0Jywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBQbGF5Tm90ZXMoY2hhbm5lbE5yKSl9LFxuICAgICAgICB7bGFiZWw6IFwiUEFOXCIsIGNvbG91cjogJ01vZHVsZU91dHB1dCcsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkR2VuZXJhdG9yKFwic2luZVwiKX0sXG4gICAgICAgIHtsYWJlbDogXCJSRVZcIiwgY29sb3VyOiAnTW9kdWxlT3V0cHV0Jywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRHZW5lcmF0b3IoXCJzaW5lXCIpfSxcbiAgICAgICAge2xhYmVsOiBcIkxQRlwiLCBjb2xvdXI6ICdNb2R1bGVPdXRwdXQnLCBvbmNsaWNrOiAoKSA9PiB0aGlzLmhhbmRsZUFkZEdlbmVyYXRvcihcInNpbmVcIil9LFxuICAgICAgICB7bGFiZWw6IFwiSFBGXCIsIGNvbG91cjogJ01vZHVsZU91dHB1dCcsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkR2VuZXJhdG9yKFwic2luZVwiKX0sXG5cbiAgICAgICAge2xhYmVsOiBcIlNXRUVQXCIsIGNvbG91cjogJ01vZHVsZUludCcsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgUmFuZ2UoXCJzd2VlcFwiKSl9LFxuICAgICAgICB7bGFiZWw6IFwiQ1lDTEVcIiwgY29sb3VyOiAnTW9kdWxlSW50Jywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRHZW5lcmF0b3IoXCJzaW5lXCIpfSxcbiAgICAgICAge2xhYmVsOiBcIlJBTkdFXCIsIGNvbG91cjogJ01vZHVsZUludCcsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgUmFuZ2UoXCJyYW5nZVwiKSl9LFxuICAgICAgICB7bGFiZWw6IFwiRkFERVwiLCBjb2xvdXI6ICdNb2R1bGVJbnQnLCBvbmNsaWNrOiAoKSA9PiB0aGlzLmhhbmRsZUFkZFVuaXQoKCkgPT4gbmV3IFJhbmdlKFwiZmFkZSBpblwiKSl9LFxuICAgICAgICB7bGFiZWw6IFwiUkFORFwiLCBjb2xvdXI6ICdNb2R1bGVJbnQnLCBvbmNsaWNrOiAoKSA9PiB0aGlzLmhhbmRsZUFkZEdlbmVyYXRvcihcInNpbmVcIil9LFxuICAgICAgICB7bGFiZWw6IFwiUkVHXCIsIGNvbG91cjogJ01vZHVsZUludCcsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgUmVnaXN0ZXIoKSl9LFxuICAgICAgICB7bGFiZWw6IFwiVFJBTlNcIiwgY29sb3VyOiAnTW9kdWxlSW50Jywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBUcmFuc3Bvc2UoKSl9LFxuXG4gICAgICAgIHtsYWJlbDogXCJJTkRFWFwiLCBjb2xvdXI6ICdNb2R1bGVJbnRBcnJheScsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgSW50QXJyYXlSZWdpc3RlckluZGV4KCkpfSxcbiAgICAgICAge2xhYmVsOiBcIlJFR1wiLCBjb2xvdXI6ICdNb2R1bGVJbnRBcnJheScsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgSW50QXJyYXlSZWdpc3RlcigpKX0sXG4gICAgICAgIHtsYWJlbDogXCJUUkFOU1wiLCBjb2xvdXI6ICdNb2R1bGVJbnRBcnJheScsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgVHJhbnNwb3NlSW50QXJyYXkoKSl9LFxuICAgICAgICB7bGFiZWw6IFwiQ0hPUkRcIiwgY29sb3VyOiAnTW9kdWxlSW50QXJyYXknLCBvbmNsaWNrOiAoKSA9PiB0aGlzLmhhbmRsZUFkZFVuaXQoKCkgPT4gbmV3IEN5Y2xlQ2hvcmRzKCkpfSxcbiAgICBdXG4gICAgdGhpcy5hZGRCdXR0b25EZWZpbml0aW9ucyhidXR0b25EZWZzKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmVnaXN0ZXJTZXF1ZW5jZUVkaXRvciBleHRlbmRzIEJhc2VTZXF1ZW5jZUVkaXRvciB7XG4gIGNvbnN0cnVjdG9yKGFwcCwgc2VxdWVuY2UsIHJlZ2lzdGVyLCBoYW5kbGVDbG9zZSkge1xuICAgIHN1cGVyKGFwcCwgc2VxdWVuY2UsIHJlZ2lzdGVyLCBoYW5kbGVDbG9zZSk7XG4gICAgdmFyIGJ1dHRvbkRlZnMgPSBbXG4gICAgICAgIHtsYWJlbDogXCLwnYWdXCIsIGNvbG91cjogJ01vZHVsZVB1bHNlJywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBQdWxzZSg0KSl9LFxuICAgICAgICB7bGFiZWw6IFwi8J2FnlwiLCBjb2xvdXI6ICdNb2R1bGVQdWxzZScsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgUHVsc2UoMikpfSxcbiAgICAgICAge2xhYmVsOiBcIuKZqVwiLCBjb2xvdXI6ICdNb2R1bGVQdWxzZScsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgUHVsc2UoMSkpfSxcbiAgICAgICAge2xhYmVsOiBcIuKZqlwiLCBjb2xvdXI6ICdNb2R1bGVQdWxzZScsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgUHVsc2UoMC41KSl9LFxuICAgICAgICB7bGFiZWw6IFwi8J2FoVwiLCBjb2xvdXI6ICdNb2R1bGVQdWxzZScsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgUHVsc2UoMC4yNSkpfSxcbiAgICAgICAge2xhYmVsOiBcIvCdhaJcIiwgY29sb3VyOiAnTW9kdWxlUHVsc2UnLCBvbmNsaWNrOiAoKSA9PiB0aGlzLmhhbmRsZUFkZFVuaXQoKCkgPT4gbmV3IFB1bHNlKDAuMTI1KSl9LFxuICAgICAgICB7bGFiZWw6IFwiUFVMU1wiLCBjb2xvdXI6ICdNb2R1bGVQdWxzZScsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgUHVsc2UoKSl9LFxuICAgICAgICB7bGFiZWw6IFwiRVVDTFwiLCBjb2xvdXI6ICdNb2R1bGVQdWxzZScsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgRXVjbGlkaWFuKCkpfSxcbiAgICAgICAge2xhYmVsOiBcIk9GRlNFVFwiLCBjb2xvdXI6ICdNb2R1bGVQdWxzZScsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgT2Zmc2V0KCkpfSxcblxuICAgICAgICB7bGFiZWw6IFwiU1dFRVBcIiwgY29sb3VyOiAnTW9kdWxlSW50Jywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBSYW5nZShcInN3ZWVwXCIpKX0sXG4gICAgICAgIHtsYWJlbDogXCJDWUNMRVwiLCBjb2xvdXI6ICdNb2R1bGVJbnQnLCBvbmNsaWNrOiAoKSA9PiB0aGlzLmhhbmRsZUFkZEdlbmVyYXRvcihcInNpbmVcIil9LFxuICAgICAgICB7bGFiZWw6IFwiUkFOR0VcIiwgY29sb3VyOiAnTW9kdWxlSW50Jywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBSYW5nZShcInJhbmdlXCIpKX0sXG4gICAgICAgIHtsYWJlbDogXCJGQURFXCIsIGNvbG91cjogJ01vZHVsZUludCcsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgUmFuZ2UoXCJmYWRlIGluXCIpKX0sXG4gICAgICAgIHtsYWJlbDogXCJSQU5EXCIsIGNvbG91cjogJ01vZHVsZUludCcsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkR2VuZXJhdG9yKFwic2luZVwiKX0sXG4gICAgICAgIHtsYWJlbDogXCJSRUdcIiwgY29sb3VyOiAnTW9kdWxlSW50Jywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBSZWdpc3RlcigpKX0sXG4gICAgICAgIHtsYWJlbDogXCJUUkFOU1wiLCBjb2xvdXI6ICdNb2R1bGVJbnQnLCBvbmNsaWNrOiAoKSA9PiB0aGlzLmhhbmRsZUFkZFVuaXQoKCkgPT4gbmV3IFRyYW5zcG9zZSgpKX0sXG5cbiAgICAgICAge2xhYmVsOiBcIklOREVYXCIsIGNvbG91cjogJ01vZHVsZUludEFycmF5Jywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBJbnRBcnJheVJlZ2lzdGVySW5kZXgoKSl9LFxuICAgICAgICB7bGFiZWw6IFwiUkVHXCIsIGNvbG91cjogJ01vZHVsZUludEFycmF5Jywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBJbnRBcnJheVJlZ2lzdGVyKCkpfSxcbiAgICAgICAge2xhYmVsOiBcIlRSQU5TXCIsIGNvbG91cjogJ01vZHVsZUludEFycmF5Jywgb25jbGljazogKCkgPT4gdGhpcy5oYW5kbGVBZGRVbml0KCgpID0+IG5ldyBUcmFuc3Bvc2VJbnRBcnJheSgpKX0sXG4gICAgICAgIHtsYWJlbDogXCJDSE9SRFwiLCBjb2xvdXI6ICdNb2R1bGVJbnRBcnJheScsIG9uY2xpY2s6ICgpID0+IHRoaXMuaGFuZGxlQWRkVW5pdCgoKSA9PiBuZXcgQ3ljbGVDaG9yZHMoKSl9LFxuICAgIF1cbiAgICB0aGlzLmFkZEJ1dHRvbkRlZmluaXRpb25zKGJ1dHRvbkRlZnMpO1xuICAgIGlmIChzZXF1ZW5jZS5tb2R1bGVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICBzZXF1ZW5jZS5tb2R1bGVzLnB1c2gobmV3IE1vZHVsZShzZXF1ZW5jZSwgNDAwLCA0MDAsIG5ldyBSZWdpc3Rlck91dHB1dChyZWdpc3Rlci50eXBlLCByZWdpc3Rlci5zb2NrZXRUeXBlLCByZWdpc3Rlci5yZWdpc3RlcikpKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZHVsZVVuaXQsIElucHV0U29ja2V0LCBPdXRwdXRTb2NrZXQsIERpYWwgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzLyc7XG5pbXBvcnQgeyBJTlRfVFlQRSB9IGZyb20gJy4uLy4uL21vZGVsLyc7XG5cbmV4cG9ydCBjbGFzcyBDeWNsZSBleHRlbmRzIE1vZHVsZVVuaXQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihcImN5Y2xlXCIpO1xuICAgIHRoaXMuc29ja2V0cyA9IHtcbiAgICAgIFwiT1VUXCI6IG5ldyBPdXRwdXRTb2NrZXQodGhpcy53IC0gMjksIHRoaXMuaCAtIDI5LCBcIk9VVFwiLCBJTlRfVFlQRSksXG4gICAgfVxuICAgIHRoaXMuY3ljbGUgPSBbXTtcbiAgICB0aGlzLmRpYWxzID0ge1xuICAgIH1cbiAgICB0aGlzLmJhY2tncm91bmQgPSAnTW9kdWxlSW50QXJyYXknO1xuICB9XG5cbiAgY29tcGlsZShjb25uZWN0aW9ucykge1xuICAgIHZhciBnID0ge1wiY3ljbGVcIjogdGhpcy5jeWNsZX07XG4gICAgcmV0dXJuIGc7XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZHVsZVVuaXQsIElucHV0U29ja2V0LCBPdXRwdXRTb2NrZXQsIERpYWwgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzLyc7XG5pbXBvcnQgeyBJTlRfQVJSQVlfVFlQRSB9IGZyb20gJy4uLy4uL21vZGVsLyc7XG5cbmV4cG9ydCBjbGFzcyBDeWNsZUNob3JkcyBleHRlbmRzIE1vZHVsZVVuaXQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihcImN5Y2xlIGNob3Jkc1wiKTtcbiAgICB0aGlzLnNvY2tldHMgPSB7XG4gICAgICBcIk9VVFwiOiBuZXcgT3V0cHV0U29ja2V0KHRoaXMudyAtIDI5LCB0aGlzLmggLSAyOSwgXCJPVVRcIiwgSU5UX0FSUkFZX1RZUEUpLFxuICAgIH1cbiAgICB0aGlzLmNob3JkcyA9IFtdO1xuICAgIHRoaXMuZGlhbHMgPSB7XG4gICAgICBcImNvdW50XCI6IG5ldyBEaWFsKDI5LCA1OSwgXCJDT1VOVFwiLCAwLjAsIDEwLjAsIDEuMCksXG4gICAgfVxuICAgIHRoaXMuYmFja2dyb3VuZCA9ICdNb2R1bGVJbnRBcnJheSc7XG4gIH1cblxuICBjb21waWxlKGNvbm5lY3Rpb25zKSB7XG4gICAgdmFyIGcgPSB7XCJjeWNsZV9jaG9yZHNcIjoge1xuICAgICAgICBcImNvdW50XCI6IHBhcnNlRmxvYXQodGhpcy5kaWFscy5jb3VudC52YWx1ZS50b0ZpeGVkKDApKSxcbiAgICAgICAgXCJjaG9yZHNcIjogdGhpcy5jaG9yZHMsXG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gZztcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kdWxlVW5pdCwgSW5wdXRTb2NrZXQsIE91dHB1dFNvY2tldCwgRGlhbCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvJztcbmltcG9ydCB7IFRSSUdHRVJfVFlQRSwgQ0xPQ0tfVFlQRSB9IGZyb20gJy4uLy4uL21vZGVsLyc7XG5cbmV4cG9ydCBjbGFzcyBFdWNsaWRpYW4gZXh0ZW5kcyBNb2R1bGVVbml0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoXCJldWNsaWRpYW5cIik7XG4gICAgdGhpcy5zb2NrZXRzID0ge1xuICAgICAgXCJDTE9DS1wiOiBuZXcgSW5wdXRTb2NrZXQoMjksIHRoaXMuaCAtIDI5LCBcIkNMT0NLXCIsIENMT0NLX1RZUEUpLFxuICAgICAgXCJUUklHXCI6IG5ldyBPdXRwdXRTb2NrZXQodGhpcy53IC0gMjksIHRoaXMuaCAtIDI5LCBcIlRSSUdcIiwgVFJJR0dFUl9UWVBFKSxcbiAgICB9XG4gICAgdGhpcy5kaWFscyA9IHtcbiAgICAgIFwicHVsc2VzXCI6IG5ldyBEaWFsKDI5LCA1OSwgXCJQVUxTRVNcIiwgMC4wLCAxMC4wLCAxLjApLFxuICAgICAgXCJvdmVyXCI6IG5ldyBEaWFsKDc5LCA1OSwgXCJPVkVSXCIsIDAuMCwgMTAuMCwgMS4wKSxcbiAgICAgIFwiZHVyYXRpb25cIjogbmV3IERpYWwoMTI5LCA1OSwgXCJEVVJcIiwgMC4wLCAxMC4wLCAxLjApLFxuICAgIH1cbiAgICB0aGlzLmJhY2tncm91bmQgPSAnTW9kdWxlUHVsc2UnO1xuICB9XG5cbiAgY29tcGlsZShjb25uZWN0aW9ucykge1xuICAgIHZhciBnID0ge1wiZXVjbGlkaWFuXCI6IHtcbiAgICAgICAgXCJwdWxzZXNcIjogcGFyc2VGbG9hdCh0aGlzLmRpYWxzLnB1bHNlcy52YWx1ZS50b0ZpeGVkKDApKSxcbiAgICAgICAgXCJvdmVyXCI6IHBhcnNlRmxvYXQodGhpcy5kaWFscy5vdmVyLnZhbHVlLnRvRml4ZWQoMCkpLFxuICAgICAgICBcImR1cmF0aW9uXCI6IHRoaXMuZGlhbHMub3Zlci52YWx1ZSxcbiAgICAgICAgXCJzZXF1ZW5jZVwiOiBudWxsLFxuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuICgoZykgPT4ge1xuICAgICAgcmV0dXJuIChzZXEpID0+IHtcbiAgICAgICAgZy5ldWNsaWRpYW4uc2VxdWVuY2UgPSBzZXE7XG4gICAgICAgIHJldHVybiBnO1xuICAgICAgfVxuICAgfSkoZyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFJhbmdlIH0gIGZyb20gJy4vcmFuZ2UuanMnO1xuaW1wb3J0IHsgUmVnaXN0ZXIsIEludEFycmF5UmVnaXN0ZXIgfSBmcm9tICcuL3JlZ2lzdGVyLmpzJztcbmltcG9ydCB7IEludEFycmF5UmVnaXN0ZXJJbmRleCB9IGZyb20gJy4vcmVnaXN0ZXJfaW5kZXguanMnO1xuaW1wb3J0IHsgQ3ljbGVDaG9yZHMgfSBmcm9tICcuL2N5Y2xlX2Nob3Jkcy5qcyc7XG5pbXBvcnQgeyBDeWNsZSB9IGZyb20gJy4vY3ljbGUuanMnO1xuaW1wb3J0IHsgUmFuZG9tIH0gZnJvbSAnLi9yYW5kb20uanMnO1xuXG5leHBvcnQgY2xhc3MgRmFjdG9yeSB7XG5cbiAgc2VxdWVuY2VGcm9tRGVmaW5pdGlvbihzZXF1ZW5jZURlZikge1xuXG4gIH1cblxuICBhdXRvbWF0aW9uRnJvbURlZmluaXRpb24oYXV0b21hdGlvbkRlZikge1xuICAgIHZhciByYW5nZXJzID0gW1wicmFuZ2VcIiwgXCJmYWRlX2luXCIsIFwic3dlZXBcIl07XG4gICAgZm9yICh2YXIgcmFuZ2VyIG9mIHJhbmdlcnMpIHtcbiAgICAgIGlmIChhdXRvbWF0aW9uRGVmW3Jhbmdlcl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgZGVmID0gYXV0b21hdGlvbkRlZltyYW5nZXJdO1xuICAgICAgICB2YXIgYSA9IG5ldyBSYW5nZShyYW5nZXIpO1xuICAgICAgICBhLmRpYWxzLmZyb20udmFsdWUgPSBkZWYuZnJvbSB8fCAwO1xuICAgICAgICBhLmRpYWxzLnRvLnZhbHVlID0gZGVmLnRvIHx8IDEyNztcbiAgICAgICAgYS5kaWFscy5zdGVwLnZhbHVlID0gZGVmLnN0ZXAgfHwgMTtcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhdXRvbWF0aW9uRGVmW1wicmVnaXN0ZXJcIl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGEgPSBuZXcgUmVnaXN0ZXIoKTtcbiAgICAgIGEuZGlhbHMucmVnaXN0ZXIudmFsdWUgPSBhdXRvbWF0aW9uRGVmW1wicmVnaXN0ZXJcIl0gfHwgMDtcbiAgICAgIHJldHVybiBhO1xuICAgIH0gZWxzZSBpZiAoYXV0b21hdGlvbkRlZltcInJhbmRvbVwiXSkge1xuICAgICAgdmFyIGEgPSBuZXcgUmFuZG9tKCk7XG4gICAgICBhLmRpYWxzLm1pbi52YWx1ZSA9IGF1dG9tYXRpb25EZWYucmFuZG9tLm1pbiB8fCAwO1xuICAgICAgYS5kaWFscy5tYXgudmFsdWUgPSBhdXRvbWF0aW9uRGVmLnJhbmRvbS5tYXggfHwgMTI4O1xuICAgICAgcmV0dXJuIGE7XG4gICAgfSBlbHNlIGlmIChhdXRvbWF0aW9uRGVmW1wiY3ljbGVcIl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGEgPSBuZXcgQ3ljbGUoKTtcbiAgICAgIGEuY3ljbGUgPSBhdXRvbWF0aW9uRGVmLmN5Y2xlO1xuICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBkZWZpbml0aW9uIGluIGZhY3Rvcnk6XCIsIGF1dG9tYXRpb25EZWYpO1xuICB9XG4gIGludEFycmF5QXV0b21hdGlvbkZyb21EZWZpbml0aW9uKGF1dG9tYXRpb25EZWYpIHtcbiAgICBpZiAoYXV0b21hdGlvbkRlZltcInJlZ2lzdGVyXCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBhID0gbmV3IEludEFycmF5UmVnaXN0ZXIoKTtcbiAgICAgIGEuZGlhbHMucmVnaXN0ZXIudmFsdWUgPSBhdXRvbWF0aW9uRGVmW1wicmVnaXN0ZXJcIl0gfHwgMDtcbiAgICAgIHJldHVybiBhO1xuICAgIH0gZWxzZSBpZiAoYXV0b21hdGlvbkRlZltcImluZGV4XCJdKSB7XG4gICAgICB2YXIgYSA9IG5ldyBJbnRBcnJheVJlZ2lzdGVySW5kZXgoKTtcbiAgICAgIGEuZGlhbHMuaW5kZXgudmFsdWUgPSBhdXRvbWF0aW9uRGVmW1wiaW5kZXhcIl1bXCJ2YWx1ZVwiXSB8fCAwO1xuICAgICAgcmV0dXJuIGE7XG4gICAgfSBlbHNlIGlmIChhdXRvbWF0aW9uRGVmW1wiY3ljbGVfY2hvcmRzXCJdKSB7XG4gICAgICB2YXIgYSA9IG5ldyBDeWNsZUNob3JkcygpO1xuICAgICAgYS5kaWFscy5jb3VudC52YWx1ZSA9IGF1dG9tYXRpb25EZWZbXCJjeWNsZV9jaG9yZHNcIl1bXCJjb3VudFwiXTtcbiAgICAgIGEuY2hvcmRzID0gYXV0b21hdGlvbkRlZltcImN5Y2xlX2Nob3Jkc1wiXVtcImNob3Jkc1wiXTtcbiAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIlVua25vd24gaW50IGFycmF5IGRlZmluaXRpb24gaW4gZmFjdG9yeTpcIiwgYXV0b21hdGlvbkRlZik7XG4gIH1cbn1cbiIsImV4cG9ydCB7IFB1bHNlIH0gZnJvbSAnLi9wdWxzZS5qcyc7XG5leHBvcnQgeyBQbGF5Tm90ZSB9IGZyb20gJy4vcGxheV9ub3RlLmpzJztcbmV4cG9ydCB7IFBsYXlOb3RlcyB9IGZyb20gJy4vcGxheV9ub3Rlcy5qcyc7XG5leHBvcnQgeyBTZXF1ZW5jZUlucHV0IH0gZnJvbSAnLi9zZXF1ZW5jZV9pbnB1dC5qcyc7XG5leHBvcnQgeyBUcmFuc3Bvc2UsIFRyYW5zcG9zZUludEFycmF5IH0gZnJvbSAnLi90cmFuc3Bvc2UuanMnO1xuZXhwb3J0IHsgRXVjbGlkaWFuIH0gZnJvbSAnLi9ldWNsaWRpYW4uanMnO1xuZXhwb3J0IHsgUmFuZ2UgfSBmcm9tICcuL3JhbmdlLmpzJztcbmV4cG9ydCB7IFJlZ2lzdGVyLCBJbnRBcnJheVJlZ2lzdGVyIH0gZnJvbSAnLi9yZWdpc3Rlci5qcyc7XG5leHBvcnQgeyBGYWN0b3J5IH0gZnJvbSAnLi9mYWN0b3J5LmpzJztcbmV4cG9ydCB7IEludEFycmF5UmVnaXN0ZXJJbmRleCB9IGZyb20gJy4vcmVnaXN0ZXJfaW5kZXguanMnO1xuZXhwb3J0IHsgT2Zmc2V0IH0gZnJvbSAnLi9vZmZzZXQuanMnO1xuZXhwb3J0IHsgUmVnaXN0ZXJPdXRwdXQgfSBmcm9tICcuL3JlZ2lzdGVyX291dHB1dC5qcyc7XG5leHBvcnQgeyBDeWNsZUNob3JkcyB9IGZyb20gJy4vY3ljbGVfY2hvcmRzLmpzJztcbmV4cG9ydCB7IFJhbmRvbSB9IGZyb20gJy4vcmFuZG9tLmpzJztcbmV4cG9ydCB7IEN5Y2xlIH0gZnJvbSAnLi9jeWNsZS5qcyc7XG4iLCJpbXBvcnQgeyBNb2R1bGVVbml0LCBJbnB1dFNvY2tldCwgT3V0cHV0U29ja2V0LCBEaWFsIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy8nO1xuaW1wb3J0IHsgVFJJR0dFUl9UWVBFLCBDTE9DS19UWVBFIH0gZnJvbSAnLi4vLi4vbW9kZWwvJztcblxuZXhwb3J0IGNsYXNzIE9mZnNldCBleHRlbmRzIE1vZHVsZVVuaXQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihcIm9mZnNldFwiKTtcbiAgICB0aGlzLnNvY2tldHMgPSB7XG4gICAgICBcIkNMT0NLXCI6IG5ldyBJbnB1dFNvY2tldCgyOSwgdGhpcy5oIC0gMjksIFwiQ0xPQ0tcIiwgQ0xPQ0tfVFlQRSksXG4gICAgICBcIk9VVFwiOiBuZXcgT3V0cHV0U29ja2V0KHRoaXMudyAtIDI5LCB0aGlzLmggLSAyOSwgXCJPVVRcIiwgQ0xPQ0tfVFlQRSksXG4gICAgfVxuICAgIHRoaXMuZGlhbHMgPSB7XG4gICAgICBcIm9mZnNldFwiOiBuZXcgRGlhbCgyOSwgNTksIFwiT0ZGU0VUXCIsIDAuMCwgMTI4LjAsIDEuMCksXG4gICAgfVxuICAgIHRoaXMuYmFja2dyb3VuZCA9ICdNb2R1bGVQdWxzZSc7XG4gIH1cblxuICBjb21waWxlKGNvbm5lY3Rpb25zKSB7XG4gICAgdmFyIGcgPSB7XCJvZmZzZXRcIjoge1xuICAgICAgICBcIm9mZnNldFwiOiB0aGlzLmRpYWxzLm9mZnNldC52YWx1ZSxcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAoKGcpID0+IHtcbiAgICAgIHJldHVybiAoc2VxKSA9PiB7XG4gICAgICAgIGcuZXVjbGlkaWFuLnNlcXVlbmNlID0gc2VxO1xuICAgICAgICByZXR1cm4gZztcbiAgICAgIH1cbiAgIH0pKGcpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2R1bGVVbml0LCBJbnB1dFNvY2tldCwgRGlhbCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvJztcbmltcG9ydCB7IFRSSUdHRVJfVFlQRSwgSU5UX1RZUEUgfSBmcm9tICcuLi8uLi9tb2RlbC8nO1xuXG5leHBvcnQgY2xhc3MgUGxheU5vdGUgZXh0ZW5kcyBNb2R1bGVVbml0IHtcbiAgY29uc3RydWN0b3IoY2hhbm5lbE5yKSB7XG4gICAgc3VwZXIoXCJwbGF5X25vdGVcIik7XG4gICAgdGhpcy5jaGFubmVsTnIgPSBjaGFubmVsTnI7XG4gICAgdGhpcy5zb2NrZXRzID0ge1xuICAgICAgXCJUUklHXCI6IG5ldyBJbnB1dFNvY2tldCgyOSwgdGhpcy5oIC0gMjksIFwiVFJJR1wiLCBUUklHR0VSX1RZUEUpLFxuICAgICAgXCJOT1RFXCI6IG5ldyBJbnB1dFNvY2tldCg3OSwgdGhpcy5oIC0gMjksIFwiTk9URVwiLCBJTlRfVFlQRSksXG4gICAgICBcIlZFTFwiOiBuZXcgSW5wdXRTb2NrZXQoMTI5LCB0aGlzLmggLSAyOSwgXCJWRUxcIiwgSU5UX1RZUEUpLFxuICAgIH1cbiAgICB0aGlzLmRpYWxzID0ge1xuICAgICAgXCJub3RlXCI6IG5ldyBEaWFsKDI5LCA1OSwgXCJOT1RFXCIsIDAuMCwgMTI4LjAsIDEuMCksXG4gICAgICBcInZlbG9jaXR5XCI6IG5ldyBEaWFsKDc5LCA1OSwgXCJWRUxcIiwgMC4wLCAxMjguMCwgOTAuMCksXG4gICAgICBcImR1cmF0aW9uXCI6IG5ldyBEaWFsKDEyOSwgNTksIFwiRFVSXCIsIDAuMCwgMTAuMCwgMS4wKSxcbiAgICB9XG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gJ01vZHVsZU91dHB1dCc7XG4gIH1cblxuICBjb21waWxlKGNvbm5lY3Rpb25zKSB7XG4gICAgdmFyIGcgPSB7XCJwbGF5X25vdGVcIjoge1xuICAgICAgXCJkdXJhdGlvblwiOiB0aGlzLmRpYWxzW1wiZHVyYXRpb25cIl0udmFsdWUsXG4gICAgICBcImNoYW5uZWxcIjogdGhpcy5jaGFubmVsTnIsXG4gICAgfX07XG4gICAgdmFyIG9uID0gY29ubmVjdGlvbnNbXCJOT1RFXCJdO1xuICAgIGlmIChvbi5sZW5ndGggPT09IDApIHtcbiAgICAgIGdbXCJwbGF5X25vdGVcIl1bXCJub3RlXCJdID0gcGFyc2VGbG9hdCh0aGlzLmRpYWxzW1wibm90ZVwiXS52YWx1ZS50b0ZpeGVkKDApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ1tcInBsYXlfbm90ZVwiXVtcImF1dG9fbm90ZVwiXSA9IG9uWzBdO1xuICAgIH1cbiAgICB2YXIgb24gPSBjb25uZWN0aW9uc1tcIlZFTFwiXTtcbiAgICBpZiAob24ubGVuZ3RoID09PSAwKSB7XG4gICAgICBnW1wicGxheV9ub3RlXCJdW1widmVsb2NpdHlcIl0gPSBwYXJzZUZsb2F0KHRoaXMuZGlhbHNbXCJ2ZWxvY2l0eVwiXS52YWx1ZS50b0ZpeGVkKDApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ1tcInBsYXlfbm90ZVwiXVtcImF1dG9fdmVsb2NpdHlcIl0gPSBvblswXTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gW11cbiAgICB2YXIgb24gPSBjb25uZWN0aW9uc1tcIlRSSUdcIl07XG4gICAgZm9yICh2YXIgbyBvZiBvbikge1xuICAgICAgcmVzdWx0LnB1c2gobyhnKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZHVsZVVuaXQsIElucHV0U29ja2V0LCBEaWFsIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy8nO1xuaW1wb3J0IHsgVFJJR0dFUl9UWVBFLCBJTlRfVFlQRSwgSU5UX0FSUkFZX1RZUEUgfSBmcm9tICcuLi8uLi9tb2RlbC8nO1xuXG5leHBvcnQgY2xhc3MgUGxheU5vdGVzIGV4dGVuZHMgTW9kdWxlVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGNoYW5uZWxOcikge1xuICAgIHN1cGVyKFwicGxheV9ub3Rlc1wiKTtcbiAgICB0aGlzLmNoYW5uZWxOciA9IGNoYW5uZWxOcjtcbiAgICB0aGlzLnNvY2tldHMgPSB7XG4gICAgICBcIlRSSUdcIjogbmV3IElucHV0U29ja2V0KDI5LCB0aGlzLmggLSAyOSwgXCJUUklHXCIsIFRSSUdHRVJfVFlQRSksXG4gICAgICBcIk5PVEVTXCI6IG5ldyBJbnB1dFNvY2tldCg3OSwgdGhpcy5oIC0gMjksIFwiTk9URVNcIiwgSU5UX0FSUkFZX1RZUEUpLFxuICAgICAgXCJWRUxcIjogbmV3IElucHV0U29ja2V0KDEyOSwgdGhpcy5oIC0gMjksIFwiVkVMXCIsIElOVF9UWVBFKSxcbiAgICB9XG4gICAgdGhpcy5kaWFscyA9IHtcbiAgICAgIFwidmVsb2NpdHlcIjogbmV3IERpYWwoNzksIDU5LCBcIlZFTFwiLCAwLjAsIDEyOC4wLCA5MC4wKSxcbiAgICAgIFwiZHVyYXRpb25cIjogbmV3IERpYWwoMTI5LCA1OSwgXCJEVVJcIiwgMC4wLCAxMC4wLCAxLjApLFxuICAgIH1cbiAgICB0aGlzLmJhY2tncm91bmQgPSAnTW9kdWxlT3V0cHV0JztcbiAgfVxuXG4gIGNvbXBpbGUoY29ubmVjdGlvbnMpIHtcbiAgICB2YXIgZyA9IHtcInBsYXlfbm90ZXNcIjoge1xuICAgICAgXCJkdXJhdGlvblwiOiB0aGlzLmRpYWxzW1wiZHVyYXRpb25cIl0udmFsdWUsXG4gICAgICBcImNoYW5uZWxcIjogdGhpcy5jaGFubmVsTnIsXG4gICAgfX07XG4gICAgdmFyIG9uID0gY29ubmVjdGlvbnNbXCJOT1RFU1wiXTtcbiAgICBpZiAob24ubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgZ1tcInBsYXlfbm90ZXNcIl1bXCJhdXRvX25vdGVzXCJdID0gb25bMF07XG4gICAgfVxuICAgIHZhciBvbiA9IGNvbm5lY3Rpb25zW1wiVkVMXCJdO1xuICAgIGlmIChvbi5sZW5ndGggPT09IDApIHtcbiAgICAgIGdbXCJwbGF5X25vdGVzXCJdW1widmVsb2NpdHlcIl0gPSBwYXJzZUZsb2F0KHRoaXMuZGlhbHNbXCJ2ZWxvY2l0eVwiXS52YWx1ZS50b0ZpeGVkKDApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ1tcInBsYXlfbm90ZXNcIl1bXCJhdXRvX3ZlbG9jaXR5XCJdID0gb25bMF07XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IFtdXG4gICAgdmFyIG9uID0gY29ubmVjdGlvbnNbXCJUUklHXCJdO1xuICAgIGZvciAodmFyIG8gb2Ygb24pIHtcbiAgICAgIHJlc3VsdC5wdXNoKG8oZykpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2R1bGVVbml0LCBJbnB1dFNvY2tldCwgT3V0cHV0U29ja2V0LCBEaWFsIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy8nO1xuaW1wb3J0IHsgVFJJR0dFUl9UWVBFLCBDTE9DS19UWVBFIH0gZnJvbSAnLi4vLi4vbW9kZWwvJztcblxuZXhwb3J0IGNsYXNzIFB1bHNlIGV4dGVuZHMgTW9kdWxlVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGV2ZXJ5KSB7XG4gICAgc3VwZXIoXCJwdWxzZVwiKTtcbiAgICB0aGlzLnNvY2tldHMgPSB7XG4gICAgICBcIkNMT0NLXCI6IG5ldyBJbnB1dFNvY2tldCgyOSwgdGhpcy5oIC0gMjksIFwiQ0xPQ0tcIiwgQ0xPQ0tfVFlQRSksXG4gICAgICBcIlRSSUdcIjogbmV3IE91dHB1dFNvY2tldCh0aGlzLncgLSAyOSwgdGhpcy5oIC0gMjksIFwiVFJJR1wiLCBUUklHR0VSX1RZUEUpLFxuICAgIH1cbiAgICB0aGlzLmRpYWxzID0ge1xuICAgICAgXCJldmVyeVwiOiBuZXcgRGlhbCgyOSwgNTksIFwiRVZFUllcIiwgMC4wLCAxMC4wLCAxLjApLFxuICAgIH1cbiAgICB0aGlzLmRpYWxzLmV2ZXJ5LnZhbHVlID0gZXZlcnkgfHwgMTtcbiAgICB0aGlzLmJhY2tncm91bmQgPSAnTW9kdWxlUHVsc2UnO1xuICB9XG5cbiAgY29tcGlsZShjb25uZWN0aW9ucykge1xuICAgIHZhciBnID0ge1wicmVwZWF0XCI6IHtcbiAgICAgICAgXCJldmVyeVwiOiB0aGlzLmRpYWxzW1wiZXZlcnlcIl0udmFsdWUsXG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gKChnKSA9PiB7XG4gICAgICByZXR1cm4gKHNlcSkgPT4ge1xuICAgICAgICBnLnJlcGVhdC5zZXF1ZW5jZSA9IHNlcTtcbiAgICAgICAgcmV0dXJuIGc7XG4gICAgICB9XG4gICB9KShnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kdWxlVW5pdCwgSW5wdXRTb2NrZXQsIE91dHB1dFNvY2tldCwgRGlhbCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvJztcbmltcG9ydCB7IElOVF9UWVBFIH0gZnJvbSAnLi4vLi4vbW9kZWwvJztcblxuZXhwb3J0IGNsYXNzIFJhbmRvbSBleHRlbmRzIE1vZHVsZVVuaXQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihcInJhbmRvbVwiKTtcbiAgICB0aGlzLnNvY2tldHMgPSB7XG4gICAgICBcIk9VVFwiOiBuZXcgT3V0cHV0U29ja2V0KHRoaXMudyAtIDI5LCB0aGlzLmggLSAyOSwgXCJPVVRcIiwgSU5UX1RZUEUpLFxuICAgIH1cbiAgICB0aGlzLmN5Y2xlID0gW107XG4gICAgdGhpcy5kaWFscyA9IHtcbiAgICAgIFwibWluXCI6IG5ldyBEaWFsKDI5LCA1OSwgXCJDT1VOVFwiLCAwLjAsIDEyOC4wLCAxLjApLFxuICAgICAgXCJtYXhcIjogbmV3IERpYWwoMjksIDU5LCBcIkNPVU5UXCIsIDAuMCwgMTI4LjAsIDEyOC4wKSxcbiAgICB9XG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gJ01vZHVsZUludEFycmF5JztcbiAgfVxuXG4gIGNvbXBpbGUoY29ubmVjdGlvbnMpIHtcbiAgICB2YXIgZyA9IHtcInJhbmRvbVwiOiB7XG4gICAgICBcIm1pblwiOiBwYXJzZUZsb2F0KHRoaXMuZGlhbHMubWluLnZhbHVlLnRvRml4ZWQoMCkpLFxuICAgICAgXCJtYXhcIjogcGFyc2VGbG9hdCh0aGlzLmRpYWxzLm1heC52YWx1ZS50b0ZpeGVkKDApKSxcbiAgICB9fTtcbiAgICByZXR1cm4gZztcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kdWxlVW5pdCwgT3V0cHV0U29ja2V0LCBEaWFsIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy8nO1xuaW1wb3J0IHsgSU5UX1RZUEUgfSBmcm9tICcuLi8uLi9tb2RlbC8nO1xuXG5leHBvcnQgY2xhc3MgUmFuZ2UgZXh0ZW5kcyBNb2R1bGVVbml0IHtcbiAgY29uc3RydWN0b3IodHlwZSkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIHRoaXMuc29ja2V0cyA9IHtcbiAgICAgIFwiT1VUXCI6IG5ldyBPdXRwdXRTb2NrZXQodGhpcy53IC0gMjksIHRoaXMuaCAtIDI5LCBcIk9VVFwiLCBJTlRfVFlQRSksXG4gICAgfVxuICAgIHRoaXMuZGlhbHMgPSB7XG4gICAgICBcImZyb21cIjogbmV3IERpYWwoMjksIDU5LCBcIkZST01cIiwgMC4wLCAxMjcuMCwgMC4wKSxcbiAgICAgIFwidG9cIjogbmV3IERpYWwoNzksIDU5LCBcIlRPXCIsIDAuMCwgMTI3LjAsIDEyNy4wKSxcbiAgICAgIFwic3RlcFwiOiBuZXcgRGlhbCgxMjksIDU5LCBcIlNURVBcIiwgMC4wLCAxMjguMCwgMS4wKSxcbiAgICB9XG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gJ01vZHVsZUludCc7XG4gIH1cblxuICBjb21waWxlKGNvbm5lY3Rpb25zKSB7XG4gICAgdmFyIGcgPSB7fTtcbiAgICBnW3RoaXMudHlwZV0gPSB7XG4gICAgICBcImZyb21cIjogdGhpcy5kaWFscy5mcm9tLnZhbHVlLFxuICAgICAgXCJ0b1wiOiB0aGlzLmRpYWxzLnRvLnZhbHVlLFxuICAgICAgXCJzdGVwXCI6IHRoaXMuZGlhbHMuc3RlcC52YWx1ZSxcbiAgICB9O1xuICAgIHJldHVybiBnO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2R1bGVVbml0LCBJbnB1dFNvY2tldCwgT3V0cHV0U29ja2V0LCBEaWFsIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy8nO1xuaW1wb3J0IHsgSU5UX1RZUEUsIElOVF9BUlJBWV9UWVBFIH0gZnJvbSAnLi4vLi4vbW9kZWwvJztcblxuY2xhc3MgQmFzZVJlZ2lzdGVyIGV4dGVuZHMgTW9kdWxlVW5pdCB7XG4gIGNvbnN0cnVjdG9yKHNvY2tldFR5cGUpIHtcbiAgICBzdXBlcihcInJlZ2lzdGVyXCIpO1xuICAgIHRoaXMuc29ja2V0cyA9IHtcbiAgICAgIFwiT1VUXCI6IG5ldyBPdXRwdXRTb2NrZXQodGhpcy53IC0gMjksIHRoaXMuaCAtIDI5LCBcIk9VVFwiLCBzb2NrZXRUeXBlKSxcbiAgICB9XG4gICAgdGhpcy5kaWFscyA9IHtcbiAgICAgIFwicmVnaXN0ZXJcIjogbmV3IERpYWwoMjksIDU5LCBcIlZBTFVFXCIsIDAsIDE2LCAwLjApLFxuICAgIH1cbiAgICBpZiAoc29ja2V0VHlwZSA9PSBJTlRfVFlQRSkge1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gJ01vZHVsZUludCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYmFja2dyb3VuZCA9ICdNb2R1bGVJbnRBcnJheSc7XG4gICAgfVxuICB9XG5cbiAgY29tcGlsZShjb25uZWN0aW9ucykge1xuICAgIHZhciBnID0ge307XG4gICAgZ1t0aGlzLnR5cGVdID0gcGFyc2VGbG9hdCh0aGlzLmRpYWxzLnJlZ2lzdGVyLnZhbHVlLnRvRml4ZWQoMCkpO1xuICAgIHJldHVybiBnO1xuICB9XG59XG5leHBvcnQgY2xhc3MgUmVnaXN0ZXIgZXh0ZW5kcyBCYXNlUmVnaXN0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihJTlRfVFlQRSk7XG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBJbnRBcnJheVJlZ2lzdGVyIGV4dGVuZHMgQmFzZVJlZ2lzdGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoSU5UX0FSUkFZX1RZUEUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBNb2R1bGVVbml0LCBJbnB1dFNvY2tldCwgT3V0cHV0U29ja2V0LCBEaWFsIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy8nO1xuaW1wb3J0IHsgSU5UX1RZUEUsIElOVF9BUlJBWV9UWVBFIH0gZnJvbSAnLi4vLi4vbW9kZWwvJztcblxuY2xhc3MgQmFzZVJlZ2lzdGVySW5kZXggZXh0ZW5kcyBNb2R1bGVVbml0IHtcbiAgY29uc3RydWN0b3Ioc29ja2V0VHlwZSkge1xuICAgIHN1cGVyKFwiaW5kZXhcIik7XG4gICAgdGhpcy5zb2NrZXRzID0ge1xuICAgICAgXCJJTlwiOiBuZXcgSW5wdXRTb2NrZXQoMjksIHRoaXMuaCAtIDI5LCBcIklOXCIsIHNvY2tldFR5cGUpLFxuICAgICAgXCJJTkRFWFwiOiBuZXcgSW5wdXRTb2NrZXQoNzksIHRoaXMuaCAtIDI5LCBcIklOREVYXCIsIElOVF9UWVBFKSxcbiAgICAgIFwiT1VUXCI6IG5ldyBPdXRwdXRTb2NrZXQodGhpcy53IC0gMjksIHRoaXMuaCAtIDI5LCBcIk9VVFwiLCBzb2NrZXRUeXBlKSxcbiAgICB9XG4gICAgdGhpcy5kaWFscyA9IHtcbiAgICAgIFwiaW5kZXhcIjogbmV3IERpYWwoNzksIDU5LCBcIklOREVYXCIsIDAsIDE2LCAwLjApLFxuICAgIH1cbiAgICBpZiAoc29ja2V0VHlwZSA9PSBJTlRfVFlQRSkge1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gJ01vZHVsZUludCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYmFja2dyb3VuZCA9ICdNb2R1bGVJbnRBcnJheSc7XG4gICAgfVxuICB9XG5cbiAgY29tcGlsZShjb25uZWN0aW9ucykge1xuICAgIHZhciBnID0ge1wiaW5kZXhcIjoge1xuICAgICAgICBcInZhbHVlXCI6IHBhcnNlRmxvYXQodGhpcy5kaWFscy5pbmRleC52YWx1ZS50b0ZpeGVkKDApKSxcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBhdXRvVmFsdWUgPSBjb25uZWN0aW9uc1tcIklOREVYXCJdO1xuICAgIGlmIChhdXRvVmFsdWUpIHtcbiAgICAgIGlmIChhdXRvVmFsdWUubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGlmIChhdXRvVmFsdWVbMF0pIHtcbiAgICAgICAgICBnLmluZGV4LmF1dG9fdmFsdWUgPSBhdXRvVmFsdWVbMF07XG4gICAgICAgIH0gXG4gICAgICB9XG4gICAgfVxuICAgIHZhciBvbiA9IGNvbm5lY3Rpb25zW1wiSU5cIl07XG4gICAgaWYgKCFvbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChvbi5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmICghb25bMF0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgb2YgT2JqZWN0LmtleXMob25bMF0pKSB7XG4gICAgICAgIGdbXCJpbmRleFwiXVtrZXldID0gb25bMF1ba2V5XTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJpbnB1dHMgdG8gaW5kZXggIT0gMVwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gZztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW50QXJyYXlSZWdpc3RlckluZGV4IGV4dGVuZHMgQmFzZVJlZ2lzdGVySW5kZXgge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihJTlRfQVJSQVlfVFlQRSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vZHVsZVVuaXQsIElucHV0U29ja2V0LCBEaWFsIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy8nO1xuaW1wb3J0IHsgVFJJR0dFUl9UWVBFLCBJTlRfVFlQRSwgSU5UX0FSUkFZX1RZUEV9IGZyb20gJy4uLy4uL21vZGVsLyc7XG5cblxuZXhwb3J0IGNsYXNzIFJlZ2lzdGVyT3V0cHV0IGV4dGVuZHMgTW9kdWxlVW5pdCB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIHNvY2tldFR5cGUsIHJlZ2lzdGVyKSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgdGhpcy5zb2NrZXRzID0ge1xuICAgICAgXCJUUklHXCI6IG5ldyBJbnB1dFNvY2tldCgyOSwgdGhpcy5oIC0gMjksIFwiVFJJR1wiLCBUUklHR0VSX1RZUEUpLFxuICAgICAgXCJWQUxVRVwiOiBuZXcgSW5wdXRTb2NrZXQoNzksIHRoaXMuaCAtIDI5LCBcIlZBTFVFXCIsIHNvY2tldFR5cGUgfHwgSU5UX1RZUEUpLFxuICAgIH1cbiAgICB0aGlzLnJlZ2lzdGVyID0gcmVnaXN0ZXI7XG4gICAgdGhpcy5kaWFscyA9IHt9XG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gJ01vZHVsZU91dHB1dCc7XG4gIH1cbiAgY29tcGlsZShjb25uZWN0aW9ucykge1xuICAgIHZhciBnID0ge307XG4gICAgZ1t0aGlzLnR5cGVdID0ge1xuICAgICAgXCJyZWdpc3RlclwiOiB0aGlzLnJlZ2lzdGVyLFxuICAgIH1cblxuICAgIHZhciB2YWwgPSBjb25uZWN0aW9uc1tcIlZBTFVFXCJdO1xuICAgIGlmICh2YWwubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2UgaWYgKHZhbC5sZW5ndGggPT0gMSkge1xuICAgICAgdmFyIHYgPSBcImF1dG9fdmFsdWVcIjtcbiAgICAgIGlmICh0aGlzLnR5cGUgPT0gXCJhcnJheV9yZWdpc3RlclwiKSB7XG4gICAgICAgIHYgPSBcImF1dG9fdmFsdWVzXCI7XG4gICAgICB9XG4gICAgICBnW3RoaXMudHlwZV1bdl0gPSB2YWxbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibW9yZSB0aGFuIG9uZSBpbnB1dCB0byByZWdpc3RlciBzZXRcIik7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIG9uID0gY29ubmVjdGlvbnNbXCJUUklHXCJdO1xuICAgIGZvciAodmFyIG8gb2Ygb24pIHtcbiAgICAgIHJlc3VsdC5wdXNoKG8oZykpXG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuIiwiaW1wb3J0IHsgTW9kdWxlVW5pdCwgT3V0cHV0U29ja2V0IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy8nO1xuaW1wb3J0IHsgQ0xPQ0tfVFlQRSB9IGZyb20gJy4uLy4uL21vZGVsLyc7XG5cbmV4cG9ydCBjbGFzcyBTZXF1ZW5jZUlucHV0IGV4dGVuZHMgTW9kdWxlVW5pdCB7XG4gIGNvbnN0cnVjdG9yKHR5cGUpIHtcbiAgICBzdXBlcih0eXBlKTtcbiAgICB0aGlzLnNvY2tldHMgPSB7XG4gICAgICBcIkNMT0NLXCI6IG5ldyBPdXRwdXRTb2NrZXQodGhpcy53IC0gMjksIHRoaXMuaCAtIDI5LCBcIkNMT0NLXCIsIENMT0NLX1RZUEUpLFxuICAgIH1cbiAgICB0aGlzLmJhY2tncm91bmQgPSAnTW9kdWxlT3V0cHV0JztcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW9kdWxlVW5pdCwgSW5wdXRTb2NrZXQsIE91dHB1dFNvY2tldCwgRGlhbCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvJztcbmltcG9ydCB7IElOVF9UWVBFLCBJTlRfQVJSQVlfVFlQRSB9IGZyb20gJy4uLy4uL21vZGVsLyc7XG5cbmNsYXNzIEJhc2VUcmFuc3Bvc2UgZXh0ZW5kcyBNb2R1bGVVbml0IHtcbiAgY29uc3RydWN0b3Ioc29ja2V0VHlwZSkge1xuICAgIHN1cGVyKFwidHJhbnNwb3NlXCIpO1xuICAgIHRoaXMuc29ja2V0cyA9IHtcbiAgICAgIFwiSU5cIjogbmV3IElucHV0U29ja2V0KDI5LCB0aGlzLmggLSAyOSwgXCJJTlwiLCBzb2NrZXRUeXBlKSxcbiAgICAgIFwiT1VUXCI6IG5ldyBPdXRwdXRTb2NrZXQodGhpcy53IC0gMjksIHRoaXMuaCAtIDI5LCBcIk9VVFwiLCBzb2NrZXRUeXBlKSxcbiAgICB9XG4gICAgdGhpcy5kaWFscyA9IHtcbiAgICAgIFwidHJhbnNwb3NlXCI6IG5ldyBEaWFsKDI5LCA1OSwgXCJWQUxVRVwiLCAtMTI3LjAsIDEyNy4wLCAwLjApLFxuICAgIH1cbiAgICBpZiAoc29ja2V0VHlwZSA9PSBJTlRfVFlQRSkge1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gJ01vZHVsZUludCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYmFja2dyb3VuZCA9ICdNb2R1bGVJbnRBcnJheSc7XG4gICAgfVxuICB9XG5cbiAgY29tcGlsZShjb25uZWN0aW9ucykge1xuICAgIHZhciBnID0ge307XG4gICAgZ1t0aGlzLnR5cGVdID0ge1xuICAgICAgXCJ2YWx1ZVwiOiBwYXJzZUZsb2F0KHRoaXMuZGlhbHMudHJhbnNwb3NlLnZhbHVlLnRvRml4ZWQoMCkpLFxuICAgIH07XG4gICAgdmFyIG9uID0gY29ubmVjdGlvbnNbXCJJTlwiXTtcbiAgICBpZiAoIW9uKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKG9uLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKCFvblswXSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBvZiBPYmplY3Qua2V5cyhvblswXSkpIHtcbiAgICAgICAgZ1t0aGlzLnR5cGVdW2tleV0gPSBvblswXVtrZXldO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcImlucHV0cyB0byB0cmFuc3Bvc2UgIT0gMVwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gZztcbiAgfVxufVxuZXhwb3J0IGNsYXNzIFRyYW5zcG9zZSBleHRlbmRzIEJhc2VUcmFuc3Bvc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihJTlRfVFlQRSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRyYW5zcG9zZUludEFycmF5IGV4dGVuZHMgQmFzZVRyYW5zcG9zZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKElOVF9BUlJBWV9UWVBFKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGF0Y2hhYmxlLCBDTE9DS19UWVBFLCBJTlRfVFlQRSwgSU5UX0FSUkFZX1RZUEUsIFRSSUdHRVJfVFlQRSB9IGZyb20gJy4uL21vZGVsLyc7XG5pbXBvcnQgeyBGYWN0b3J5LCBTZXF1ZW5jZUlucHV0LCBQbGF5Tm90ZSwgUGxheU5vdGVzLCBQdWxzZSwgRXVjbGlkaWFuLCBUcmFuc3Bvc2UsIFRyYW5zcG9zZUludEFycmF5LCBPZmZzZXQsIFJlZ2lzdGVyT3V0cHV0IH0gZnJvbSAnLi9tb2R1bGVfdW5pdHMvJztcbmltcG9ydCB7IE1vZHVsZSB9IGZyb20gJy4uL2NvbXBvbmVudHMvJztcbmltcG9ydCB7IFJlZ2lzdGVyIH0gZnJvbSAnLi4vbW9kZWwvJztcblxuZXhwb3J0IGNsYXNzIFNlcXVlbmNlIGV4dGVuZHMgUGF0Y2hhYmxlIHtcbiAgY29uc3RydWN0b3IodGFyZ2V0LCBtb2R1bGVzLCBwYXRjaGVzKSB7XG4gICAgc3VwZXIobW9kdWxlcywgcGF0Y2hlcyk7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQgfHwgMTtcbiAgfVxuXG4gIGxvYWRGcm9tRGVmaW5pdGlvbihzZXF1ZW5jZURlZikge1xuXG4gICAgdGhpcy5tb2R1bGVzID0gW1xuICAgICAgbmV3IE1vZHVsZSh0aGlzLCAxMCwgNDAsIG5ldyBTZXF1ZW5jZUlucHV0KCdpbnB1dCcpKSwgXG4gICAgXTtcbiAgICB0aGlzLnBhdGNoZXMgPSBbXTtcblxuICAgIGlmICghc2VxdWVuY2VEZWYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5sb2FkU2VxdWVuY2Uoc2VxdWVuY2VEZWYsIDApO1xuICB9XG5cbiAgY29tcGlsZSgpIHtcbiAgICB2YXIgcXVldWUgPSBbXTtcbiAgICB2YXIgc2VlbiA9IHt9O1xuICAgIHZhciBkZXBlbmRlbmNpZXMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbSA9IHRoaXMubW9kdWxlc1tpXTtcbiAgICAgIGlmIChtLnVuaXQudHlwZSA9PSBcInBsYXlfbm90ZVwiIHx8IG0udW5pdC50eXBlID09IFwicGxheV9ub3Rlc1wiIHx8IG0udW5pdCBpbnN0YW5jZW9mIFJlZ2lzdGVyT3V0cHV0KSB7XG4gICAgICAgIHF1ZXVlLnB1c2goaSk7XG4gICAgICB9XG4gICAgfVxuICAgIHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgcSA9IHF1ZXVlWzBdO1xuICAgICAgdmFyIHF1ZXVlID0gcXVldWUuc3BsaWNlKDEpO1xuICAgICAgaWYgKHNlZW5bcV0pIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGRlcGVuZGVuY2llcy5wdXNoKHEpO1xuICAgICAgZm9yICh2YXIgcCBvZiB0aGlzLnBhdGNoZXMpIHtcbiAgICAgICAgdmFyIG1vZFNvY2tldHMgPSB0aGlzLm1vZHVsZXNbcV0udW5pdC5zb2NrZXRzO1xuICAgICAgICBpZiAocC50byA9PT0gcSAmJiBtb2RTb2NrZXRzW3AudG9Tb2NrZXRdICYmIG1vZFNvY2tldHNbcC50b1NvY2tldF0uaXNJbnB1dCkge1xuICAgICAgICAgIGlmICghc2VlbltwLmZyb21dKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKHAuZnJvbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHAuZnJvbSA9PT0gcSAmJiBtb2RTb2NrZXRzW3AuZnJvbVNvY2tldF0gJiYgbW9kU29ja2V0c1twLmZyb21Tb2NrZXRdLmlzSW5wdXQpIHtcbiAgICAgICAgICBpZiAoIXNlZW5bcC5mcm9tXSkge1xuICAgICAgICAgICAgcXVldWUucHVzaChwLnRvKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNlZW5bcV0gPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgc2VxdWVuY2VzID0ge307XG4gICAgZm9yICh2YXIgaSA9IGRlcGVuZGVuY2llcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGl4ID0gZGVwZW5kZW5jaWVzW2ldO1xuICAgICAgdmFyIHVuaXQgPSB0aGlzLm1vZHVsZXNbaXhdLnVuaXQ7XG5cbiAgICAgIHZhciBjb25uZWN0aW9ucyA9IHt9O1xuICAgICAgZm9yICh2YXIgc29ja2V0SWQgb2YgT2JqZWN0LmtleXModW5pdC5zb2NrZXRzKSkge1xuICAgICAgICBpZiAodW5pdC5zb2NrZXRzW3NvY2tldElkXS5pc0lucHV0KSB7XG4gICAgICAgICAgY29ubmVjdGlvbnNbc29ja2V0SWRdID0gdGhpcy5nZXRDb25uZWN0ZWRTZXF1ZW5jZXMoc2VxdWVuY2VzLCBpeCwgc29ja2V0SWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodW5pdC50eXBlID09IFwicGxheV9ub3RlXCIgfHwgdW5pdC50eXBlID09IFwicGxheV9ub3Rlc1wiIHx8IHVuaXQgaW5zdGFuY2VvZiBSZWdpc3Rlck91dHB1dCkge1xuICAgICAgICBmb3IgKHZhciBvIG9mIHVuaXQuY29tcGlsZShjb25uZWN0aW9ucykpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChvKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGcgPSB1bml0LmNvbXBpbGUoY29ubmVjdGlvbnMpO1xuICAgICAgICBzZXF1ZW5jZXNbaXhdID0gZztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHJlc3VsdFswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgXCJjb21iaW5lXCI6IHJlc3VsdCxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcGFyc2VEdXJhdGlvbihkdXJhdGlvbikge1xuICAgIGlmICh0eXBlb2YgZHVyYXRpb24gPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBkdXJhdGlvbjtcbiAgICB9XG4gICAgdmFyIGdyYW51bGFyaXR5ID0gNjQ7XG4gICAgaWYgKGR1cmF0aW9uID09IFwiVGhpcnR5c2Vjb25kXCIpIHtcbiAgICAgIHJldHVybiAwLjEyNTtcbiAgICB9IGVsc2UgaWYgKGR1cmF0aW9uID09IFwiU2l4dGVlbnRoXCIpIHtcbiAgICAgIHJldHVybiAwLjI1O1xuICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gPT0gXCJFaWdodFwiKSB7XG4gICAgICByZXR1cm4gMC41O1xuICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gPT0gXCJRdWFydGVyXCIpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gPT0gXCJIYWxmXCIpIHtcbiAgICAgIHJldHVybiAyO1xuICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gPT0gXCJXaG9sZVwiKSB7XG4gICAgICByZXR1cm4gNDtcbiAgICB9XG4gIH1cblxuICBsb2FkU2VxdWVuY2Uoc2VxdWVuY2VEZWYsIGlucHV0KSB7XG4gICAgaWYgKHNlcXVlbmNlRGVmW1wiYmVmb3JlXCJdKSB7IC8vIHdlIGZpbHRlciBvdXQgYmVmb3JlLCBiZWNhdXNlIHRoaXMgaXMgaGFuZGxlZCBpbiB0aGUgdGltZWxpbmVcbiAgICAgIHJldHVybiB0aGlzLmxvYWRTZXF1ZW5jZShzZXF1ZW5jZURlZltcImJlZm9yZVwiXVtcInNlcXVlbmNlXCJdLCBpbnB1dCk7XG4gICAgfSBlbHNlIGlmIChzZXF1ZW5jZURlZltcImFmdGVyXCJdKSB7IC8vIHdlIGZpbHRlciBvdXQgYWZ0ZXIsIGJlY2F1c2UgdGhpcyBpcyBoYW5kbGVkIGluIHRoZSB0aW1lbGluZVxuICAgICAgcmV0dXJuIHRoaXMubG9hZFNlcXVlbmNlKHNlcXVlbmNlRGVmW1wiYWZ0ZXJcIl1bXCJzZXF1ZW5jZVwiXSwgaW5wdXQpO1xuICAgIH0gZWxzZSBpZiAoc2VxdWVuY2VEZWZbXCJwbGF5X25vdGVcIl0pIHtcbiAgICAgIHZhciBkZWYgPSBzZXF1ZW5jZURlZltcInBsYXlfbm90ZVwiXTtcbiAgICAgIHZhciBnID0gbmV3IFBsYXlOb3RlKHRoaXMudGFyZ2V0KTtcbiAgICAgIGcuZGlhbHMubm90ZS52YWx1ZSA9IGRlZi5ub3RlIHx8IDEuMDtcbiAgICAgIGcuZGlhbHMudmVsb2NpdHkudmFsdWUgPSBkZWYudmVsb2NpdHkgfHwgMS4wO1xuICAgICAgZy5kaWFscy5kdXJhdGlvbi52YWx1ZSA9IHRoaXMucGFyc2VEdXJhdGlvbihkZWYuZHVyYXRpb24pIHx8IDEuMDtcbiAgICAgIHZhciBpeCA9IHRoaXMuYWRkTW9kdWxlKGcpO1xuICAgICAgaWYgKGRlZltcImF1dG9fdmVsb2NpdHlcIl0pIHtcbiAgICAgICAgdmFyIHZJeCA9IHRoaXMubG9hZEF1dG9tYXRpb24oZGVmW1wiYXV0b192ZWxvY2l0eVwiXSk7XG4gICAgICAgIGlmICh2SXggIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLl9hZGRQYXRjaChpeCwgdkl4LCBcIlZFTFwiLCBcIk9VVFwiLCBJTlRfVFlQRSk7XG4gICAgICAgIH1cbiAgICAgIH0gXG4gICAgICBpZiAoZGVmW1wiYXV0b19ub3RlXCJdKSB7XG4gICAgICAgIHZhciB2SXggPSB0aGlzLmxvYWRBdXRvbWF0aW9uKGRlZltcImF1dG9fbm90ZVwiXSk7XG4gICAgICAgIGlmICh2SXggIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLl9hZGRQYXRjaChpeCwgdkl4LCBcIk5PVEVcIiwgXCJPVVRcIiwgSU5UX1RZUEUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGVmW1wiZXZlcnlcIl0pIHtcbiAgICAgICAgdmFyIHB1bHNlSXggPSB0aGlzLmFkZE1vZHVsZShuZXcgUHVsc2UodGhpcy5wYXJzZUR1cmF0aW9uKGRlZltcImV2ZXJ5XCJdKSkpO1xuICAgICAgICB0aGlzLl9hZGRQYXRjaChpbnB1dCwgcHVsc2VJeCwgXCJDTE9DS1wiLCBcIkNMT0NLXCIsIENMT0NLX1RZUEUpO1xuICAgICAgICB0aGlzLl9hZGRQYXRjaChpeCwgcHVsc2VJeCwgXCJUUklHXCIsIFwiVFJJR1wiLCBUUklHR0VSX1RZUEUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl4O1xuICAgIH0gZWxzZSBpZiAoc2VxdWVuY2VEZWZbXCJjb21iaW5lXCJdKSB7XG4gICAgICB2YXIgc2VxcyA9IFtdO1xuICAgICAgZm9yICh2YXIgaURlZiBvZiBzZXF1ZW5jZURlZltcImNvbWJpbmVcIl0pIHtcbiAgICAgICAgdmFyIGl4ID0gdGhpcy5sb2FkU2VxdWVuY2UoaURlZiwgaW5wdXQpO1xuICAgICAgICBpZiAoaXgpIHtcbiAgICAgICAgICBzZXFzLnB1c2goaXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VxcztcbiAgICB9IGVsc2UgaWYgKHNlcXVlbmNlRGVmW1wicGxheV9ub3Rlc1wiXSkge1xuICAgICAgdmFyIGRlZiA9IHNlcXVlbmNlRGVmW1wicGxheV9ub3Rlc1wiXTtcbiAgICAgIHZhciBnID0gbmV3IFBsYXlOb3Rlcyh0aGlzLnRhcmdldCk7XG4gICAgICB2YXIgaXggPSB0aGlzLmFkZE1vZHVsZShnKTtcblxuICAgICAgaWYgKGRlZltcImF1dG9fdmVsb2NpdHlcIl0pIHtcbiAgICAgICAgdmFyIHZJeCA9IHRoaXMubG9hZEF1dG9tYXRpb24oZGVmW1wiYXV0b192ZWxvY2l0eVwiXSk7XG4gICAgICAgIGlmICh2SXggIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLl9hZGRQYXRjaChpeCwgdkl4LCBcIlZFTFwiLCBcIk9VVFwiLCBJTlRfVFlQRSk7XG4gICAgICAgIH1cbiAgICAgIH0gXG4gICAgICBpZiAoZGVmW1wiYXV0b19ub3Rlc1wiXSkge1xuICAgICAgICB2YXIgdkl4ID0gdGhpcy5sb2FkSW50QXJyYXlBdXRvbWF0aW9uKGRlZltcImF1dG9fbm90ZXNcIl0pO1xuICAgICAgICBpZiAodkl4ICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5fYWRkUGF0Y2goaXgsIHZJeCwgXCJOT1RFU1wiLCBcIk9VVFwiLCBJTlRfQVJSQVlfVFlQRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkZWZbXCJldmVyeVwiXSkge1xuICAgICAgICB2YXIgcHVsc2VJeCA9IHRoaXMuYWRkTW9kdWxlKG5ldyBQdWxzZSh0aGlzLnBhcnNlRHVyYXRpb24oZGVmW1wiZXZlcnlcIl0pKSk7XG4gICAgICAgIHRoaXMuX2FkZFBhdGNoKGlucHV0LCBwdWxzZUl4LCBcIkNMT0NLXCIsIFwiQ0xPQ0tcIiwgQ0xPQ0tfVFlQRSk7XG4gICAgICAgIHRoaXMuX2FkZFBhdGNoKGl4LCBwdWxzZUl4LCBcIlRSSUdcIiwgXCJUUklHXCIsIFRSSUdHRVJfVFlQRSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXg7XG4gICAgfSBlbHNlIGlmIChzZXF1ZW5jZURlZltcInJlcGVhdFwiXSkge1xuICAgICAgdmFyIGRlZiA9IHNlcXVlbmNlRGVmW1wicmVwZWF0XCJdO1xuICAgICAgdmFyIGcgPSBuZXcgUHVsc2UodGhpcy5wYXJzZUR1cmF0aW9uKGRlZi5ldmVyeSkpO1xuICAgICAgdmFyIGl4ID0gdGhpcy5hZGRNb2R1bGUoZyk7XG4gICAgICB2YXIgYUl4ID0gdGhpcy5sb2FkU2VxdWVuY2UoZGVmLnNlcXVlbmNlKTtcbiAgICAgIGlmIChhSXggIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9hZGRQYXRjaChpeCwgYUl4LCBcIlRSSUdcIiwgXCJUUklHXCIsIFRSSUdHRVJfVFlQRSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9hZGRQYXRjaChpbnB1dCwgaXgsIFwiQ0xPQ0tcIiwgXCJDTE9DS1wiLCBDTE9DS19UWVBFKTtcbiAgICAgIHJldHVybiBpeDtcbiAgICB9IGVsc2UgaWYgKHNlcXVlbmNlRGVmW1wib2Zmc2V0XCJdKSB7XG4gICAgICAvLyBUT0RPIGZpeD9cbiAgICAgIGNvbnNvbGUubG9nKFwiV0FUQ0ggT1VUIEZPUiBvZmZzZXRcIiwgc2VxdWVuY2VEZWZbXCJvZmZzZXRcIl0pO1xuICAgICAgdmFyIGRlZiA9IHNlcXVlbmNlRGVmW1wib2Zmc2V0XCJdO1xuICAgICAgdmFyIGcgPSBuZXcgT2Zmc2V0KCk7XG4gICAgICBnLmRpYWxzLm9mZnNldC52YWx1ZSA9IGRlZi5vZmZzZXQgfHwgMDtcbiAgICAgIHZhciBpeCA9IHRoaXMuYWRkTW9kdWxlKGcpO1xuICAgICAgdmFyIGFJeCA9IHRoaXMubG9hZFNlcXVlbmNlKGRlZi5zZXF1ZW5jZSk7XG4gICAgICBpZiAoYUl4ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fYWRkUGF0Y2goaXgsIGFJeCwgXCJPVVRcIiwgXCJDTE9DS1wiLCBDTE9DS19UWVBFKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2FkZFBhdGNoKGlucHV0LCBpeCwgXCJDTE9DS1wiLCBcIkNMT0NLXCIsIENMT0NLX1RZUEUpO1xuICAgICAgcmV0dXJuIGl4O1xuICAgIH0gZWxzZSBpZiAoc2VxdWVuY2VEZWZbXCJldWNsaWRpYW5cIl0pIHtcbiAgICAgIHZhciBkZWYgPSBzZXF1ZW5jZURlZltcImV1Y2xpZGlhblwiXTtcbiAgICAgIHZhciBnID0gbmV3IEV1Y2xpZGlhbigpO1xuICAgICAgZy5kaWFscy5wdWxzZXMudmFsdWUgPSBkZWYucHVsc2VzIHx8IDE7XG4gICAgICBnLmRpYWxzLm92ZXIudmFsdWUgPSBkZWYub3ZlciB8fCAxO1xuICAgICAgdmFyIGl4ID0gdGhpcy5hZGRNb2R1bGUoZyk7XG4gICAgICB2YXIgYUl4ID0gdGhpcy5sb2FkU2VxdWVuY2UoZGVmLnNlcXVlbmNlKTtcbiAgICAgIHRoaXMuX2FkZFBhdGNoKGl4LCBhSXgsIFwiVFJJR1wiLCBcIlRSSUdcIiwgVFJJR0dFUl9UWVBFKTtcbiAgICAgIHRoaXMuX2FkZFBhdGNoKGlucHV0LCBpeCwgXCJDTE9DS1wiLCBcIkNMT0NLXCIsIENMT0NLX1RZUEUpO1xuICAgICAgcmV0dXJuIGl4O1xuICAgIH0gZWxzZSBpZiAoc2VxdWVuY2VEZWZbXCJhcnJheV9yZWdpc3RlclwiXSkge1xuICAgICAgdmFyIGRlZiA9IHNlcXVlbmNlRGVmLmFycmF5X3JlZ2lzdGVyO1xuICAgICAgdmFyIGcgPSBuZXcgUmVnaXN0ZXJPdXRwdXQoXCJhcnJheV9yZWdpc3RlclwiLCBJTlRfQVJSQVlfVFlQRSwgZGVmLnJlZ2lzdGVyKTtcbiAgICAgIHZhciBpeCA9IHRoaXMuYWRkTW9kdWxlKGcpO1xuICAgICAgaWYgKGRlZltcImF1dG9fdmFsdWVzXCJdKSB7XG4gICAgICAgIHZhciBhSXggPSB0aGlzLmxvYWRJbnRBcnJheUF1dG9tYXRpb24oZGVmLmF1dG9fdmFsdWVzKTtcbiAgICAgICAgaWYgKGFJeCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5fYWRkUGF0Y2goaXgsIGFJeCwgXCJWQUxVRVwiLCBcIk9VVFwiLCBJTlRfQVJSQVlfVFlQRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpeDtcbiAgICB9IGVsc2UgaWYgKHNlcXVlbmNlRGVmW1wicmVnaXN0ZXJcIl0pIHtcbiAgICAgIHZhciBkZWYgPSBzZXF1ZW5jZURlZi5yZWdpc3RlcjtcbiAgICAgIHZhciBnID0gbmV3IFJlZ2lzdGVyT3V0cHV0KFwicmVnaXN0ZXJcIiwgSU5UX1RZUEUsIGRlZi5yZWdpc3Rlcik7XG4gICAgICBnLmRpYWxzLnZhbHVlLnZhbHVlID0gZGVmLnZhbHVlIHx8IDA7XG4gICAgICB2YXIgaXggPSB0aGlzLmFkZE1vZHVsZShnKTtcbiAgICAgIGlmIChkZWZbXCJhdXRvX3ZhbHVlXCJdKSB7XG4gICAgICAgIHZhciBhSXggPSB0aGlzLmxvYWRBdXRvbWF0aW9uKGRlZi5hdXRvX3ZhbHVlKTtcbiAgICAgICAgaWYgKGFJeCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5fYWRkUGF0Y2goaXgsIGFJeCwgXCJWQUxVRVwiLCBcIk9VVFwiLCBJTlRfVFlQRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpeDtcbiAgICB9IGVsc2UgaWYgKHNlcXVlbmNlRGVmW1wicGFubmluZ1wiXSkge1xuICAgICAgY29uc29sZS5sb2coXCJVbnN1cHBvcnRlZCBzZXF1ZW5jZSBkZWZcIiwgc2VxdWVuY2VEZWYpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiVW5zdXBwb3J0ZWQgc2VxdWVuY2UgZGVmXCIsIHNlcXVlbmNlRGVmKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRBdXRvbWF0aW9uKGF1dG9tYXRpb25EZWYpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiTG9hZGluZyBhdXRvbWF0aW9uXCIsIGF1dG9tYXRpb25EZWYpO1xuICAgIGlmIChhdXRvbWF0aW9uRGVmW1wiYmFja19hbmRfZm9ydGhcIl0pIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiVW5zdXBwb3J0ZWQgYXV0b21hdGlvbiBkZWZcIiwgYXV0b21hdGlvbkRlZik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKGF1dG9tYXRpb25EZWZbXCJmYWRlX2luXCJdICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgIHx8IGF1dG9tYXRpb25EZWZbXCJyYW5nZVwiXSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICB8fCBhdXRvbWF0aW9uRGVmW1wic3dlZXBcIl0gIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgfHwgYXV0b21hdGlvbkRlZltcImN5Y2xlXCJdICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgIHx8IGF1dG9tYXRpb25EZWZbXCJyYW5kb21cIl0gIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgfHwgYXV0b21hdGlvbkRlZltcInJlZ2lzdGVyXCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBhID0gbmV3IEZhY3RvcnkoKS5hdXRvbWF0aW9uRnJvbURlZmluaXRpb24oYXV0b21hdGlvbkRlZik7XG4gICAgICByZXR1cm4gdGhpcy5hZGRNb2R1bGUoYSk7XG4gICAgfSBlbHNlIGlmIChhdXRvbWF0aW9uRGVmW1widHJhbnNwb3NlXCJdKSB7XG4gICAgICB2YXIgYSA9IG5ldyBUcmFuc3Bvc2UoKTtcbiAgICAgIGEuZGlhbHMudHJhbnNwb3NlLnZhbHVlID0gYXV0b21hdGlvbkRlZltcInRyYW5zcG9zZVwiXS52YWx1ZTtcbiAgICAgIHZhciBpeCA9IHRoaXMuYWRkTW9kdWxlKGEpO1xuICAgICAgdmFyIGFJeCA9IHRoaXMubG9hZEF1dG9tYXRpb24oYXV0b21hdGlvbkRlZltcInRyYW5zcG9zZVwiXSk7XG4gICAgICBpZiAoYUl4ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fYWRkUGF0Y2goaXgsIGFJeCwgXCJJTlwiLCBcIk9VVFwiLCBJTlRfVFlQRSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiVW5zdXBwb3J0ZWQgYXV0b21hdGlvbiBkZWZcIiwgYXV0b21hdGlvbkRlZik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBsb2FkSW50QXJyYXlBdXRvbWF0aW9uKGF1dG9tYXRpb25EZWYpIHtcbiAgICBpZiAoYXV0b21hdGlvbkRlZltcInRyYW5zcG9zZVwiXSkge1xuICAgICAgdmFyIGEgPSBuZXcgVHJhbnNwb3NlSW50QXJyYXkoKTtcbiAgICAgIGEuZGlhbHMudHJhbnNwb3NlLnZhbHVlID0gYXV0b21hdGlvbkRlZltcInRyYW5zcG9zZVwiXS52YWx1ZTtcbiAgICAgIHZhciBpeCA9IHRoaXMuYWRkTW9kdWxlKGEpO1xuICAgICAgdmFyIGFJeCA9IHRoaXMubG9hZEludEFycmF5QXV0b21hdGlvbihhdXRvbWF0aW9uRGVmW1widHJhbnNwb3NlXCJdKTtcbiAgICAgIGlmIChhSXggIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9hZGRQYXRjaChpeCwgYUl4LCBcIklOXCIsIFwiT1VUXCIsIElOVF9BUlJBWV9UWVBFKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpeDtcbiAgICB9IGVsc2UgaWYgKGF1dG9tYXRpb25EZWZbXCJyZWdpc3RlclwiXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgYSA9IG5ldyBGYWN0b3J5KCkuaW50QXJyYXlBdXRvbWF0aW9uRnJvbURlZmluaXRpb24oYXV0b21hdGlvbkRlZik7XG4gICAgICByZXR1cm4gdGhpcy5hZGRNb2R1bGUoYSk7XG4gICAgfSBlbHNlIGlmIChhdXRvbWF0aW9uRGVmW1wiaW5kZXhcIl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGEgPSBuZXcgRmFjdG9yeSgpLmludEFycmF5QXV0b21hdGlvbkZyb21EZWZpbml0aW9uKGF1dG9tYXRpb25EZWYpO1xuICAgICAgdmFyIGl4ID0gdGhpcy5hZGRNb2R1bGUoYSk7XG4gICAgICB2YXIgYUl4ID0gdGhpcy5sb2FkSW50QXJyYXlBdXRvbWF0aW9uKGF1dG9tYXRpb25EZWZbXCJpbmRleFwiXSk7XG4gICAgICBpZiAoYUl4ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fYWRkUGF0Y2goaXgsIGFJeCwgXCJJTlwiLCBcIk9VVFwiLCBJTlRfQVJSQVlfVFlQRSk7XG4gICAgICB9XG4gICAgICBpZiAoYXV0b21hdGlvbkRlZltcImluZGV4XCJdW1wiYXV0b192YWx1ZVwiXSkge1xuICAgICAgICBhSXggPSB0aGlzLmxvYWRBdXRvbWF0aW9uKGF1dG9tYXRpb25EZWZbXCJpbmRleFwiXVtcImF1dG9fdmFsdWVcIl0pO1xuICAgICAgICBpZiAoIWFJeCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5fYWRkUGF0Y2goaXgsIGFJeCwgXCJJTkRFWFwiLCBcIk9VVFwiLCBJTlRfVFlQRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpeDtcbiAgICB9IGVsc2UgaWYgKGF1dG9tYXRpb25EZWZbXCJjeWNsZV9jaG9yZHNcIl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGEgPSBuZXcgRmFjdG9yeSgpLmludEFycmF5QXV0b21hdGlvbkZyb21EZWZpbml0aW9uKGF1dG9tYXRpb25EZWYpO1xuICAgICAgcmV0dXJuIHRoaXMuYWRkTW9kdWxlKGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlVuc3VwcG9ydGVkIGludGVnZXIgYXJyYXkgYXV0b21hdGlvbiBkZWZcIiwgYXV0b21hdGlvbkRlZik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBnZXRDb25uZWN0ZWRTZXF1ZW5jZXMoc2VxdWVuY2VzLCBpeCwgaW5wdXQpIHtcbiAgICB2YXIgZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBwIG9mIHRoaXMucGF0Y2hlcykge1xuICAgICAgaWYgKHAuZG9lc1BhdGNoQ29ubmVjdFRvKGl4LCBpbnB1dCkpIHtcbiAgICAgICAgZ3MucHVzaChzZXF1ZW5jZXNbcC5jb25uZWN0c1RvKGl4LCBpbnB1dCkubW9kdWxlXSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBVURJT19UWVBFLCBGUkVRVUVOQ1lfVFlQRSwgUEFOTklOR19UWVBFLCBDTE9DS19UWVBFLCBUUklHR0VSX1RZUEUsIElOVF9UWVBFLCBJTlRfQVJSQVlfVFlQRSB9IGZyb20gJy4vbW9kZWwvJztcblxuZXhwb3J0IGNsYXNzIFRoZW1lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wYWRkaW5nID0gMDtcbiAgICB2YXIgc29ja2V0Q29sb3VycyA9IHt9O1xuICAgIHZhciBwYXRjaENvbG91cnMgPSB7fVxuICAgIHNvY2tldENvbG91cnNbQVVESU9fVFlQRV0gPSAncmdiKDE0MCwgMjU1LCAyNTUpJztcbiAgICBzb2NrZXRDb2xvdXJzW0ZSRVFVRU5DWV9UWVBFXSA9ICdyZ2IoMjU1LCAyNTUsIDE0MCknO1xuICAgIHNvY2tldENvbG91cnNbUEFOTklOR19UWVBFXSA9ICdyZ2IoMjU1LCAxNDAsIDI1NSknO1xuICAgIHNvY2tldENvbG91cnNbQ0xPQ0tfVFlQRV0gPSAncmdiKDEwMCwgMTAwLCAyNTUpJztcbiAgICBzb2NrZXRDb2xvdXJzW1RSSUdHRVJfVFlQRV0gPSAncmdiKDUwLCA1MCwgNTApJztcbiAgICBzb2NrZXRDb2xvdXJzW0lOVF9UWVBFXSA9ICdyZ2IoMjU1LCAyNTUsIDQwKSc7XG4gICAgc29ja2V0Q29sb3Vyc1tJTlRfQVJSQVlfVFlQRV0gPSAncmdiKDI1NSwgNDAsIDQwKSc7XG4gICAgZm9yICh2YXIga2V5IG9mIE9iamVjdC5rZXlzKHNvY2tldENvbG91cnMpKSB7XG4gICAgICBwYXRjaENvbG91cnNba2V5XSA9IFJHQl9MaW5lYXJfU2hhZGUoMC4xLCBzb2NrZXRDb2xvdXJzW2tleV0pO1xuICAgIH1cbiAgICB0aGlzLmNvbG91cnMgPSB7XG4gICAgICBPdXRsaW5lQ29sb3VyOiAnIzMzMycsXG4gICAgICBCYWNrZ3JvdW5kOiAnIzQ0NCcsXG4gICAgICBGb3JlZ3JvdW5kOiAnI2VlZScsXG4gICAgICBJbnN0cnVtZW50RWRpdG9yQmFja2dyb3VuZDogJyNlZWUnLFxuXG4gICAgICBTb2NrZXRCYWNrZ3JvdW5kOiAnIzlmZicsXG4gICAgICBTb2NrZXRJbnNpZGU6ICcjOTk5JyxcbiAgICAgIFNvY2tldE91dGxpbmU6ICcjNzc3JyxcblxuICAgICAgUGF0Y2g6ICcjN2ZmJyxcblxuICAgICAgTW9kdWxlT3V0bGluZTogJyM3NzcnLFxuICAgICAgTW9kdWxlVGV4dDogJyM0NDQnLFxuICAgICAgTW9kdWxlR2VuZXJhdG9yOiAnI2ZmZicsXG4gICAgICBNb2R1bGVGaWx0ZXI6ICcjZmZkJyxcbiAgICAgIE1vZHVsZURlcml2ZWQ6ICcjZGRmJyxcbiAgICAgIE1vZHVsZU91dHB1dDogJyNkZmQnLFxuICAgICAgTW9kdWxlSW50OiAnI2ZmOScsXG4gICAgICBNb2R1bGVGbG9hdDogJyNmOWYnLFxuICAgICAgTW9kdWxlSW50QXJyYXk6ICcjZjk5JyxcbiAgICAgIE1vZHVsZVB1bHNlOiAnI2RkZicsXG5cbiAgICAgIEJ1dHRvbjogJyNjY2MnLFxuICAgICAgQnV0dG9uVGV4dDogJyMzMzMnLFxuXG4gICAgICBEaWFsOiAnI2NjYycsXG4gICAgICBEaWFsTGluZTogJyM0NDQnLFxuXG4gICAgICBTb2NrZXRzOiBzb2NrZXRDb2xvdXJzLFxuICAgICAgUGF0Y2hlczogcGF0Y2hDb2xvdXJzLFxuICAgIH07XG4gIH1cbn1cblxuY29uc3QgUkdCX0xpbmVhcl9TaGFkZT0ocCxjKT0+e1xuICAgIHZhciBpPXBhcnNlSW50LHI9TWF0aC5yb3VuZCxbYSxiLGMsZF09Yy5zcGxpdChcIixcIiksUD1wPDAsdD1QPzA6MjU1KnAsUD1QPzErcDoxLXA7XG4gICAgcmV0dXJuXCJyZ2JcIisoZD9cImEoXCI6XCIoXCIpK3IoaShhWzNdPT1cImFcIj9hLnNsaWNlKDUpOmEuc2xpY2UoNCkpKlArdCkrXCIsXCIrcihpKGIpKlArdCkrXCIsXCIrcihpKGMpKlArdCkrKGQ/XCIsXCIrZDpcIilcIik7XG59XG4iLCJleHBvcnQgY2xhc3MgQ2hhbm5lbFNpZGVCYXIge1xuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBhcHAsIHBhZGRpbmcsIHBhbmVsV2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgdGhpcy5wYWRkaW5nID0gcGFkZGluZztcbiAgICB0aGlzLnBhbmVsV2lkdGggPSBwYW5lbFdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgZHJhdyhhcHAsIGNvbG9yT2Zmc2V0KSB7XG4gICAgYXBwLmN0eC5maWxsU3R5bGUgPSAncmdiKDAsICcgKyAoMjAwIC0gY29sb3JPZmZzZXQpICsgJywgMCknO1xuICAgIGFwcC5jdHguc3Ryb2tlU3R5bGUgPSAncmdiKDQwLCA0MCwgNDAsIDEuMCknO1xuICAgIGFwcC5jdHguZmlsbFJlY3QodGhpcy5wYWRkaW5nLCB0aGlzLnBhZGRpbmcsIHRoaXMucGFuZWxXaWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIGFwcC5jdHguc3Ryb2tlUmVjdCh0aGlzLnBhZGRpbmcsIHRoaXMucGFkZGluZywgdGhpcy5wYW5lbFdpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICBhcHAuY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMjU1LCAyNTUsIDI1NSknO1xuICAgIGFwcC5jdHguZm9udCA9ICcxMHB4IHNhbnMtc2VyaWYnO1xuICAgIGFwcC5jdHguZmlsbFRleHQodGhpcy5jaGFubmVsLm5hbWUsIHRoaXMucGFkZGluZyArIDMsIHRoaXMucGFkZGluZyArIDExKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKCkge1xuICAgIHRoaXMuYXBwLm9wZW5JbnN0cnVtZW50RWRpdG9yKHRoaXMuY2hhbm5lbC5pbnN0cnVtZW50KTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlRG93bihhcHAsIHgsIHkpIHtcbiAgICB2YXIgcGF0aCA9IG5ldyBQYXRoMkQoKTtcbiAgICBwYXRoLnJlY3QoMCwgMCwgdGhpcy5wYW5lbFdpZHRoLCB0aGlzLmhlaWdodCArIHRoaXMucGFkZGluZyAqIDIpO1xuICAgIGlmIChhcHAuY3R4LmlzUG9pbnRJblBhdGgocGF0aCwgeCwgeSkpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiIsImV4cG9ydCB7IENoYW5uZWxUcmFjaywgUmVnaXN0ZXJUcmFjayB9IGZyb20gJy4vdHJhY2suanMnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi4vY29tcG9uZW50cy8nO1xuaW1wb3J0IHsgQ2hhbm5lbFRyYWNrLCBSZWdpc3RlclRyYWNrIH0gZnJvbSAnLi90cmFjay5qcyc7XG5pbXBvcnQgeyBDaGFubmVsLCBSZWdpc3RlciB9IGZyb20gJy4uL21vZGVsLyc7XG5cbmV4cG9ydCBjbGFzcyBUaW1lbGluZUVkaXRvciB7XG4gIGNvbnN0cnVjdG9yKHRyYWNrcywgYXBwKSB7XG4gICAgdGhpcy50cmFja3MgPSB0cmFja3M7XG4gICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgdmFyIGJ1dHRvbkRlZnMgPSBbXG4gICAgICAgIHtsYWJlbDogXCJDSEFOXCIsIGNvbG91cjogJ01vZHVsZVB1bHNlJywgb25jbGljazogdGhpcy5hZGRDaGFubmVsVHJhY2t9LFxuICAgICAgICB7bGFiZWw6IFwiUkVHXCIsIGNvbG91cjogJ01vZHVsZUludCcsIG9uY2xpY2s6IHRoaXMuYWRkUmVnaXN0ZXJUcmFja30sXG4gICAgICAgIHtsYWJlbDogXCJGTFRcIiwgY29sb3VyOiAnTW9kdWxlRmxvYXQnLCBvbmNsaWNrOiB0aGlzLmFkZEZsb2F0UmVnaXN0ZXJUcmFja30sXG4gICAgICAgIHtsYWJlbDogXCJBUlJcIiwgY29sb3VyOiAnTW9kdWxlSW50QXJyYXknLCBvbmNsaWNrOiB0aGlzLmFkZEludEFycmF5UmVnaXN0ZXJUcmFja30sXG4gICAgXTtcbiAgICB0aGlzLmJ1dHRvbnMgPSBbXTtcbiAgICB0aGlzLmFkZEJ1dHRvbkRlZmluaXRpb25zKGJ1dHRvbkRlZnMpO1xuICB9XG4gIGFkZENoYW5uZWxUcmFjaygpIHtcbiAgICB2YXIgbmV4dENoYW5uZWwgPSAwO1xuICAgIGZvciAodmFyIHRyIG9mIHRoaXMudHJhY2tzKSB7XG4gICAgICBpZiAodHIgaW5zdGFuY2VvZiBDaGFubmVsVHJhY2spIHtcbiAgICAgICAgaWYgKHRyLnVuaXQuY2hhbm5lbE5yID49IG5leHRDaGFubmVsKSB7XG4gICAgICAgICAgbmV4dENoYW5uZWwgPSB0ci51bml0LmNoYW5uZWxOciArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGNoID0gbmV3IENoYW5uZWwobmV4dENoYW5uZWwpO1xuICAgIHZhciB0cmFjayA9IG5ldyBDaGFubmVsVHJhY2soY2gsIHRoaXMuYXBwKTtcbiAgICB0aGlzLmFwcC50cmFja3MucHVzaCh0cmFjayk7XG4gICAgdGhpcy5hcHAuZHJhdygpXG4gIH1cbiAgYWRkUmVnaXN0ZXJUcmFjaygpIHtcbiAgICB0aGlzLl9hZGRSZWdpc3RlclRyYWNrKFwicmVnaXN0ZXJcIik7XG4gIH1cbiAgYWRkRmxvYXRSZWdpc3RlclRyYWNrKCkge1xuICAgIHRoaXMuX2FkZFJlZ2lzdGVyVHJhY2soXCJmbG9hdF9yZWdpc3RlclwiKTtcbiAgfVxuICBhZGRJbnRBcnJheVJlZ2lzdGVyVHJhY2soKSB7XG4gICAgdGhpcy5fYWRkUmVnaXN0ZXJUcmFjayhcImFycmF5X3JlZ2lzdGVyXCIpO1xuICB9XG4gIF9hZGRSZWdpc3RlclRyYWNrKHR5cGUpIHtcbiAgICB2YXIgbmV4dFJlZ2lzdGVyID0gMDtcbiAgICBmb3IgKHZhciB0ciBvZiB0aGlzLnRyYWNrcykge1xuICAgICAgaWYgKHRyIGluc3RhbmNlb2YgUmVnaXN0ZXJUcmFjaykge1xuICAgICAgICBpZiAodHIudW5pdC50eXBlID09IHR5cGUgJiYgdHIudW5pdC5yZWdpc3RlciA+PSBuZXh0UmVnaXN0ZXIpIHtcbiAgICAgICAgICBuZXh0UmVnaXN0ZXIgPSB0ci51bml0LnJlZ2lzdGVyICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgY2ggPSBuZXcgUmVnaXN0ZXIobmV4dFJlZ2lzdGVyLCB0eXBlKTtcbiAgICB2YXIgdHJhY2sgPSBuZXcgUmVnaXN0ZXJUcmFjayhjaCwgdGhpcy5hcHApO1xuICAgIHRoaXMuYXBwLnRyYWNrcy5wdXNoKHRyYWNrKTtcbiAgICB0aGlzLmFwcC5kcmF3KClcbiAgfVxuICBhZGRCdXR0b25EZWZpbml0aW9ucyhidXR0b25EZWZzKSB7XG4gICAgdmFyIHggPSAwO1xuICAgIHZhciBwcmV2ID0gbnVsbDtcbiAgICB2YXIgcGFkZGluZyA9IDA7XG4gICAgdmFyIGdyb3VwUGFkZGluZyA9IDEwO1xuICAgIGZvciAodmFyIGRlZiBvZiBidXR0b25EZWZzKSB7XG4gICAgICB2YXIgYiA9IG5ldyBCdXR0b24oeCwgdGhpcy5hcHAudGhlbWUucGFkZGluZywgZGVmLm9uY2xpY2suYmluZCh0aGlzKSwgZGVmLmxhYmVsKTtcbiAgICAgIGIuY29sb3VyID0gdGhpcy5hcHAudGhlbWUuY29sb3Vyc1tkZWYuY29sb3VyXSB8fCB0aGlzLmFwcC50aGVtZS5jb2xvdXJzLk1vZHVsZUdlbmVyYXRvcjtcbiAgICAgIHRoaXMuYnV0dG9ucy5wdXNoKGIpO1xuICAgICAgaWYgKHByZXYgJiYgcHJldi5jb2xvdXIgIT0gZGVmLmNvbG91cikge1xuICAgICAgICB4ICs9IGdyb3VwUGFkZGluZztcbiAgICAgICAgYi54ICs9IGdyb3VwUGFkZGluZztcbiAgICAgIH1cbiAgICAgIHggKz0gYi53ICsgcGFkZGluZztcbiAgICAgIHByZXYgPSBkZWY7XG4gICAgfVxuXG4gIH1cbiAgaGFuZGxlTW91c2VEb3duKGFwcCwgeCwgeSkge1xuICAgIHZhciBpID0gMDtcbiAgICBmb3IgKHZhciBiIG9mIHRoaXMuYnV0dG9ucykge1xuICAgICAgdmFyIHYgPSBiLmhhbmRsZU1vdXNlRG93bihhcHAsIHgsIHkpO1xuICAgICAgaWYgKHYpIHtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGUgb2YgdGhpcy50cmFja3MpIHtcbiAgICAgIHZhciB2ID0gZS5oYW5kbGVNb3VzZURvd24oYXBwLCB4LCB5IC0gKDI1ICsgaSAqIChlLmhlaWdodCArIGUucGFkZGluZyAqIDIpKSk7XG4gICAgICBpZiAodikge1xuICAgICAgICByZXR1cm4gdjtcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gIH1cbiAgZHJhdyhhcHApIHtcbiAgICBhcHAuY3R4LnNhdmUoKTtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICAvLyBEcmF3IHRoZSBidXR0b25zIFxuICAgIGZvciAodmFyIGIgb2YgdGhpcy5idXR0b25zKSB7XG4gICAgICBiLmRyYXcoYXBwKTtcbiAgICB9XG5cbiAgICAvLyBEcmF3IHRoZSB0cmFja3NcbiAgICBmb3IgKHZhciBlIG9mIHRoaXMudHJhY2tzKSB7XG4gICAgICBhcHAuY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTsgLy8gcmVzZXQgdHJhbnNsYXRlXG4gICAgICBhcHAuY3R4LnRyYW5zbGF0ZSgwLCAyNSArIGkgKiAoZS5oZWlnaHQgKyBlLnBhZGRpbmcgKiAyKSk7XG4gICAgICBlLmRyYXcoYXBwKTtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgYXBwLmN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBSZWdpc3RlclNpZGVCYXIge1xuICBjb25zdHJ1Y3RvcihyZWdpc3RlciwgYXBwLCBwYWRkaW5nLCBwYW5lbFdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLnJlZ2lzdGVyID0gcmVnaXN0ZXI7XG4gICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgdGhpcy5wYWRkaW5nID0gcGFkZGluZztcbiAgICB0aGlzLnBhbmVsV2lkdGggPSBwYW5lbFdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgZHJhdyhhcHAsIGNvbG9yT2Zmc2V0KSB7XG4gICAgYXBwLmN0eC5maWxsU3R5bGUgPSAncmdiKDAsICcgKyAoMjAwIC0gY29sb3JPZmZzZXQpICsgJywgMCknO1xuICAgIGFwcC5jdHguc3Ryb2tlU3R5bGUgPSAncmdiKDQwLCA0MCwgNDAsIDEuMCknO1xuICAgIGFwcC5jdHguZmlsbFJlY3QodGhpcy5wYWRkaW5nLCB0aGlzLnBhZGRpbmcsIHRoaXMucGFuZWxXaWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIGFwcC5jdHguc3Ryb2tlUmVjdCh0aGlzLnBhZGRpbmcsIHRoaXMucGFkZGluZywgdGhpcy5wYW5lbFdpZHRoLCB0aGlzLmhlaWdodCk7XG5cbiAgICBhcHAuY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMjU1LCAyNTUsIDI1NSknO1xuICAgIGFwcC5jdHguZm9udCA9ICcxMHB4IHNhbnMtc2VyaWYnO1xuICAgIGFwcC5jdHguZmlsbFRleHQodGhpcy5yZWdpc3Rlci50eXBlICsgXCIgXCIgKyB0aGlzLnJlZ2lzdGVyLnJlZ2lzdGVyLCB0aGlzLnBhZGRpbmcgKyAzLCB0aGlzLnBhZGRpbmcgKyAxMSk7XG4gIH1cbiAgaGFuZGxlTW91c2VEb3duKGFwcCwgeCwgeSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2VxdWVuY2UgfSBmcm9tICcuLi9zZXF1ZW5jZV9lZGl0b3Ivc2VxdWVuY2UuanMnO1xuXG5leHBvcnQgY2xhc3MgUmFuZ2Uge1xuICBjb25zdHJ1Y3RvcihzdGFydCwgc3RvcCkge1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLnN0b3AgPSBzdG9wO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXF1ZW5jZVRyYWNrIHtcbiAgY29uc3RydWN0b3IodGFyZ2V0LCBzZXF1ZW5jZV9kZWYpIHtcbiAgICB0aGlzLnNlcXVlbmNlX2RlZiA9IG51bGw7XG4gICAgdGhpcy5zZXF1ZW5jZSA9IG5ldyBTZXF1ZW5jZSh0YXJnZXQpXG4gICAgdGhpcy5zZXF1ZW5jZS5sb2FkRnJvbURlZmluaXRpb24oc2VxdWVuY2VfZGVmKTtcbiAgICB0aGlzLnJhbmdlcyA9IFtdO1xuICB9XG4gIGFkZFJhbmdlKHN0YXJ0LCBzdG9wKSB7XG4gICAgdGhpcy5yYW5nZXMucHVzaChuZXcgUmFuZ2Uoc3RhcnQgPyBzdGFydCA6IDAsIHN0b3AgPyBzdG9wIDogMTAwMDAwMCkpO1xuICB9XG4gIGNvbXBpbGUoKSB7XG4gICAgaWYgKHRoaXMuc2VxdWVuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlcXVlbmNlLmNvbXBpbGUoKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgZHJhdyhhcHAsIHgsIHksIHcsIGgpIHtcbiAgICB2YXIgc2hvd0JhcnMgPSA2NDtcbiAgICB2YXIgcG9pbnRzSW5SYW5nZSA9IHNob3dCYXJzICogNDtcbiAgICB2YXIgc2NhbGluZyA9IHcgLyBwb2ludHNJblJhbmdlO1xuICAgIHZhciBiYXJXaWR0aCA9IDQgKiBzY2FsaW5nO1xuICAgIGZvciAodmFyIHIgb2YgdGhpcy5yYW5nZXMpIHtcbiAgICAgIHZhciBjb2xvck9mZnNldCA9IDEwO1xuICAgICAgdmFyIHdpZHRoID0gTWF0aC5taW4oKHIuc3RvcCAtIHIuc3RhcnQpICogc2NhbGluZywgdyAtIChyLnN0YXJ0ICogc2NhbGluZykpXG4gICAgICBhcHAuY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMzUsIDc1LCAnICsgKDIwMCAtIGNvbG9yT2Zmc2V0KSArICcsIDAuMyknO1xuICAgICAgYXBwLmN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoNSwgNSwgJyArICgyMDAgLSBjb2xvck9mZnNldCkgKyAnLCAwLjYpJztcbiAgICAgIGFwcC5jdHguZmlsbFJlY3QoeCArIHIuc3RhcnQgKiBzY2FsaW5nLCB5LCB3aWR0aCwgaCk7XG4gICAgICBhcHAuY3R4LnN0cm9rZVJlY3QoeCArIHIuc3RhcnQgKiBzY2FsaW5nLCB5LCB3aWR0aCwgaCk7XG4gICAgfVxuICAgIGFwcC5jdHguc3Ryb2tlU3R5bGUgPSAncmdiKDcwLCA3MCwgNzAsIDAuOCknO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2hvd0JhcnM7IGkrKykge1xuICAgICAgYXBwLmN0eC5zdHJva2VSZWN0KHggKyBpICogYmFyV2lkdGgsIHksIGJhcldpZHRoLCBoKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFNlcXVlbmNlVHJhY2sgfSBmcm9tICcuL3NlcXVlbmNlX3RyYWNrLmpzJztcbmltcG9ydCB7IENoYW5uZWwsIFJlZ2lzdGVyIH0gZnJvbSAnLi4vbW9kZWwvJztcblxuZXhwb3J0IGNsYXNzIEJhc2VTZXF1ZW5jZVRyYWNrcyB7XG5cbiAgY29uc3RydWN0b3IodW5pdCwgYXBwLCBwYWRkaW5nLCBwYW5lbFdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLnVuaXQgPSB1bml0O1xuICAgIHRoaXMuYXBwID0gYXBwO1xuICAgIHRoaXMucGFkZGluZyA9IHBhZGRpbmc7XG4gICAgdGhpcy5wYW5lbFdpZHRoID0gcGFuZWxXaWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLnNlcXVlbmNlVHJhY2tzID0gW25ldyBTZXF1ZW5jZVRyYWNrKCldO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMudW5pdCBpbnN0YW5jZW9mIENoYW5uZWwpIHtcbiAgICAgIHRoaXMuYXBwLm9wZW5TZXF1ZW5jZUVkaXRvcih0aGlzLnNlcXVlbmNlVHJhY2tzWzBdLnNlcXVlbmNlLCB0aGlzLnVuaXQuZ2V0Q29tcGlsZVRhcmdldCgpKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudW5pdCBpbnN0YW5jZW9mIFJlZ2lzdGVyKSB7XG4gICAgICB0aGlzLmFwcC5vcGVuUmVnaXN0ZXJTZXF1ZW5jZUVkaXRvcih0aGlzLnNlcXVlbmNlVHJhY2tzWzBdLnNlcXVlbmNlLCB0aGlzLnVuaXQpO1xuXG4gICAgfVxuICB9XG5cbiAgZHJhdyhhcHAsIGNvbG9yT2Zmc2V0KSB7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgIHZhciBwYWRkaW5nID0gdGhpcy5wYWRkaW5nO1xuICAgIHZhciBwYW5lbFdpZHRoID0gdGhpcy5wYW5lbFdpZHRoO1xuICAgIHZhciB0cmFja1dpZHRoID0gYXBwLmNhbnZhcy53aWR0aCAtIHBhbmVsV2lkdGggLSBwYWRkaW5nICogMjtcblxuICAgIGFwcC5jdHguZmlsbFN0eWxlID0gJ3JnYigyNTUsICcgKyAoMjAwIC0gY29sb3JPZmZzZXQpICsgJywgMCknO1xuICAgIGFwcC5jdHguc3Ryb2tlU3R5bGUgPSAncmdiKDQwLCA0MCwgNDAsIDEuMCknO1xuICAgIGFwcC5jdHguZmlsbFJlY3QocGFkZGluZyArIHBhbmVsV2lkdGgsIHBhZGRpbmcsIHRyYWNrV2lkdGgsIGhlaWdodCk7XG4gICAgYXBwLmN0eC5zdHJva2VSZWN0KHBhZGRpbmcgKyBwYW5lbFdpZHRoLCBwYWRkaW5nLCB0cmFja1dpZHRoLCBoZWlnaHQpO1xuXG4gICAgdmFyIHRyYWNrSGVpZ2h0ID0gaGVpZ2h0IC8gdGhpcy5zZXF1ZW5jZVRyYWNrcy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlcXVlbmNlVHJhY2tzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgYXBwLmN0eC5zdHJva2VSZWN0KHBhZGRpbmcgKyBwYW5lbFdpZHRoLCBwYWRkaW5nICsgaSAqIHRyYWNrSGVpZ2h0LCB0cmFja1dpZHRoLCB0cmFja0hlaWdodCk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZXF1ZW5jZVRyYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHMgPSB0aGlzLnNlcXVlbmNlVHJhY2tzW2ldO1xuICAgICAgcy5kcmF3KGFwcCwgcGFkZGluZyArIHBhbmVsV2lkdGgsIHBhZGRpbmcgKyBpICogdHJhY2tIZWlnaHQsIHRyYWNrV2lkdGgsIHRyYWNrSGVpZ2h0KTtcbiAgICB9XG5cbiAgICB2YXIgc2hvd0JhcnMgPSA0O1xuICAgIHZhciBwb2ludHNJblJhbmdlID0gc2hvd0JhcnMgKiA0O1xuICAgIHZhciBzY2FsaW5nID0gdHJhY2tXaWR0aCAvIHBvaW50c0luUmFuZ2U7XG4gICAgdmFyIGJhcldpZHRoID0gNCAqIHNjYWxpbmc7XG4gICAgYXBwLmN0eC5maWxsU3R5bGUgPSAncmdiKDQwLCA0MCwgNDApJztcbiAgICBhcHAuY3R4LmZvbnQgPSAnMTBweCBtb25vJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNob3dCYXJzOyBpKyspIHtcbiAgICAgIGFwcC5jdHguZmlsbFRleHQoaSArIDEsIHBhZGRpbmcgKyBwYW5lbFdpZHRoICsgMyArIGkgKiBiYXJXaWR0aCwgcGFkZGluZyArIGhlaWdodCAtIDMpO1xuICAgIH1cbiAgfVxuICBoYW5kbGVNb3VzZURvd24oYXBwLCB4LCB5KSB7XG4gICAgdmFyIHBhdGggPSBuZXcgUGF0aDJEKCk7XG4gICAgdmFyIHdpZHRoID0gYXBwLmNhbnZhcy53aWR0aCAtIHRoaXMucGFkZGluZyAqIDI7XG4gICAgcGF0aC5yZWN0KHRoaXMucGFuZWxXaWR0aCwgMCwgd2lkdGgsIHRoaXMuaGVpZ2h0ICsgdGhpcy5wYWRkaW5nICogMik7XG4gICAgaWYgKGFwcC5jdHguaXNQb2ludEluUGF0aChwYXRoLCB4LCB5KSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb21waWxlKCkge1xuICAgIHJldHVybiB0aGlzLnVuaXQuY29tcGlsZSh0aGlzLnNlcXVlbmNlVHJhY2tzKTtcbiAgfVxuXG4gIGluaXRpYWxpc2VTZXF1ZW5jZVRyYWNrcyhzZXF1ZW5jZXMpIHtcbiAgICB0aGlzLnNlcXVlbmNlVHJhY2tzID0gW107XG4gICAgZm9yICh2YXIgcyBvZiBzZXF1ZW5jZXMpIHtcbiAgICAgIHZhciBzZWdtZW50ID0ge307XG4gICAgICBpZiAocy5hZnRlcikge1xuICAgICAgICBzZWdtZW50LmFmdGVyID0gcy5hZnRlci5hZnRlcjtcbiAgICAgICAgaWYgKHMuYWZ0ZXIuc2VxdWVuY2UuYmVmb3JlKSB7XG4gICAgICAgICAgc2VnbWVudC5iZWZvcmUgPSBzLmFmdGVyLnNlcXVlbmNlLmJlZm9yZS5iZWZvcmU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocy5iZWZvcmUpIHtcbiAgICAgICAgc2VnbWVudC5iZWZvcmUgPSBzLmJlZm9yZS5iZWZvcmU7XG4gICAgICAgIGlmIChzLmJlZm9yZS5zZXF1ZW5jZS5hZnRlcikge1xuICAgICAgICAgIHNlZ21lbnQuYWZ0ZXIgPSBzLmJlZm9yZS5zZXF1ZW5jZS5hZnRlci5hZnRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHRyYWNrID0gbmV3IFNlcXVlbmNlVHJhY2sodGhpcy51bml0LmdldENvbXBpbGVUYXJnZXQoKSwgcyk7XG4gICAgICB0cmFjay5hZGRSYW5nZShzZWdtZW50LmFmdGVyLCBzZWdtZW50LmJlZm9yZSk7XG4gICAgICB0aGlzLnNlcXVlbmNlVHJhY2tzLnB1c2godHJhY2spO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2hhbm5lbFNlcXVlbmNlVHJhY2tzIGV4dGVuZHMgQmFzZVNlcXVlbmNlVHJhY2tzIHtcbiAgY29uc3RydWN0b3IoY2hhbm5lbCwgYXBwLCBwYWRkaW5nLCBwYW5lbFdpZHRoLCBoZWlnaHQpIHtcbiAgICBzdXBlcihjaGFubmVsLCBhcHAsIHBhZGRpbmcsIHBhbmVsV2lkdGgsIGhlaWdodCk7XG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBSZWdpc3RlclNlcXVlbmNlVHJhY2tzIGV4dGVuZHMgQmFzZVNlcXVlbmNlVHJhY2tzIHtcbiAgY29uc3RydWN0b3IocmVnaXN0ZXIsIGFwcCwgcGFkZGluZywgcGFuZWxXaWR0aCwgaGVpZ2h0KSB7XG4gICAgc3VwZXIocmVnaXN0ZXIsIGFwcCwgcGFkZGluZywgcGFuZWxXaWR0aCwgaGVpZ2h0KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2hhbm5lbFNpZGVCYXIgfSBmcm9tICcuL2NoYW5uZWxfc2lkZWJhci5qcyc7XG5pbXBvcnQgeyBSZWdpc3RlclNpZGVCYXIgfSBmcm9tICcuL3JlZ2lzdGVyX3NpZGViYXIuanMnO1xuaW1wb3J0IHsgQ2hhbm5lbFNlcXVlbmNlVHJhY2tzLCBSZWdpc3RlclNlcXVlbmNlVHJhY2tzIH0gZnJvbSAnLi9zZXF1ZW5jZV90cmFja3MuanMnO1xuXG5leHBvcnQgY2xhc3MgQmFzZVRyYWNrIHtcbiAgY29uc3RydWN0b3IodW5pdCkge1xuICAgIHRoaXMudW5pdCA9IHVuaXQ7XG4gICAgdGhpcy5wYWRkaW5nID0gMDtcbiAgICB0aGlzLmhlaWdodCA9IDc1O1xuICAgIHRoaXMucGFuZWxXaWR0aCA9IDkwO1xuXG4gICAgdGhpcy5zaWRlQmFyID0gbnVsbDtcbiAgICB0aGlzLnNlcXVlbmNlVHJhY2tzID0gbnVsbDtcbiAgfVxuXG4gIGRyYXcoYXBwKSB7XG4gICAgdmFyIGNvbG9yT2Zmc2V0ID0gJyNkZGQnOyBcbiAgICB0aGlzLnNpZGVCYXIuZHJhdyhhcHAsIGNvbG9yT2Zmc2V0KTtcbiAgICB0aGlzLnNlcXVlbmNlVHJhY2tzLmRyYXcoYXBwLCBjb2xvck9mZnNldCk7XG4gIH1cblxuICBoYW5kbGVNb3VzZURvd24oYXBwLCB4LCB5KSB7XG4gICAgaWYgKHRoaXMuc2lkZUJhci5oYW5kbGVNb3VzZURvd24oYXBwLCB4LCB5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2lkZUJhcjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2VxdWVuY2VUcmFja3MuaGFuZGxlTW91c2VEb3duKGFwcCwgeCwgeSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlcXVlbmNlVHJhY2tzO1xuICAgIH0gXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGluaXRpYWxpc2VTZXF1ZW5jZVRyYWNrcyhkZWZzKSB7XG4gICAgdGhpcy5zZXF1ZW5jZVRyYWNrcy5pbml0aWFsaXNlU2VxdWVuY2VUcmFja3MoZGVmcyk7XG4gIH1cbiAgY29tcGlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXF1ZW5jZVRyYWNrcy5jb21waWxlKCk7XG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBDaGFubmVsVHJhY2sgZXh0ZW5kcyBCYXNlVHJhY2sge1xuICBjb25zdHJ1Y3RvcihjaGFubmVsLCBhcHApIHtcbiAgICBzdXBlcihjaGFubmVsKTtcbiAgICB0aGlzLnNpZGVCYXIgPSBuZXcgQ2hhbm5lbFNpZGVCYXIoY2hhbm5lbCwgYXBwLCB0aGlzLnBhZGRpbmcsIHRoaXMucGFuZWxXaWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIHRoaXMuc2VxdWVuY2VUcmFja3MgPSBuZXcgQ2hhbm5lbFNlcXVlbmNlVHJhY2tzKGNoYW5uZWwsIGFwcCwgdGhpcy5wYWRkaW5nLCB0aGlzLnBhbmVsV2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgfVxufVxuZXhwb3J0IGNsYXNzIFJlZ2lzdGVyVHJhY2sgZXh0ZW5kcyBCYXNlVHJhY2sge1xuICBjb25zdHJ1Y3RvcihyZWdpc3RlciwgYXBwKSB7XG4gICAgc3VwZXIocmVnaXN0ZXIpO1xuICAgIHRoaXMuc2lkZUJhciA9IG5ldyBSZWdpc3RlclNpZGVCYXIocmVnaXN0ZXIsIGFwcCwgdGhpcy5wYWRkaW5nLCB0aGlzLnBhbmVsV2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICB0aGlzLnNlcXVlbmNlVHJhY2tzID0gbmV3IFJlZ2lzdGVyU2VxdWVuY2VUcmFja3MocmVnaXN0ZXIsIGFwcCwgdGhpcy5wYWRkaW5nLCB0aGlzLnBhbmVsV2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==