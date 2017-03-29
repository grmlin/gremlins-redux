'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addStore = undefined;

var _storeManager = require('./storeManager');

Object.defineProperty(exports, 'addStore', {
  enumerable: true,
  get: function get() {
    return _storeManager.addStore;
  }
});

var _reduxMixin = require('./reduxMixin');

var _reduxMixin2 = _interopRequireDefault(_reduxMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _reduxMixin2.default;