'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var __store = null;
var components = new Set();

var hasStore = function hasStore() {
  return __store !== null;
};

var getStore = exports.getStore = function getStore() {
  if (!hasStore()) {
    throw new Error('gremlins-redux: trying to use the redux store, but none was added. Add a store with `addStore` first');
  }

  return __store;
};

var addComponentDispatchers = function addComponentDispatchers(component) {
  var dispatchMap = component.__reduxMapDispatchToComponent();

  var _loop = function _loop(action) {
    if (dispatchMap.hasOwnProperty(action)) {
      component.redux.actions[action] = function () {
        var store = getStore();
        store.dispatch(dispatchMap[action].apply(dispatchMap, arguments));
      };
    }
  };

  for (var action in dispatchMap) {
    _loop(action);
  }
};

var deleteComponentDispatchers = function deleteComponentDispatchers(c) {
  var actions = c.redux.actions;
  for (var action in actions) {
    if (actions.hasOwnProperty(action)) {
      delete actions[action];
    }
  }
};

var updateComponentState = function updateComponentState(component, state, triggerUpdate) {
  // console.log('updating state for', component.el, state);
  component.__reduxMapStateToComponent(state, triggerUpdate);
};

var propagateState = function propagateState() {
  var store = getStore();
  var state = store.getState();

  // console.log('propagating state for all components', state);
  components.forEach(function (c) {
    return updateComponentState(c, state, true);
  });
};

var addStore = exports.addStore = function addStore(newStore) {
  if (hasStore()) {
    throw new Error('gremlins-redux: you already added a store to the mixin');
  }

  __store = newStore;
  __store.subscribe(propagateState);
};

var initComponent = exports.initComponent = function initComponent(c) {};

var addComponent = exports.addComponent = function addComponent(c) {
  var store = getStore();
  var state = store.getState();
  updateComponentState(c, state, false);
  addComponentDispatchers(c);
  components.add(c);
};

var deleteComponent = exports.deleteComponent = function deleteComponent(c) {
  deleteComponentDispatchers(c);
  components.delete(c);
};