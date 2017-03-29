'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _storeManager = require('./storeManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reduxMixin = {
  created: function created() {
    this.redux = {
      dispatch: function dispatch() {
        var store = (0, _storeManager.getStore)();
        store.dispatch.apply(store, arguments);
      },

      get store() {
        return (0, _storeManager.getStore)();
      },
      state: {},
      actions: {}
    };

    (0, _storeManager.initComponent)(this);
  },
  attached: function attached() {
    (0, _storeManager.addComponent)(this);
  },
  detached: function detached() {
    (0, _storeManager.deleteComponent)(this);
  },
  __reduxMapStateToComponent: function __reduxMapStateToComponent(state) {
    var triggerUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (typeof this.mapState === 'function') {
      this.redux.state = this.mapState(state);
      if (triggerUpdate && typeof this.onStateUpdate === 'function') {
        this.onStateUpdate();
      }
    }
  },
  __reduxMapDispatchToComponent: function __reduxMapDispatchToComponent(dispatch) {
    if (typeof this.mapDispatch === 'function') {
      return this.mapDispatch(dispatch);
    } else if ((0, _isPlainObject2.default)(this.mapDispatch)) {
      return this.mapDispatch;
    } else {
      return {};
    }
  }
};

exports.default = reduxMixin;