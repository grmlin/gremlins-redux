let __store = null;
const components = new Set();

const hasStore = () => __store !== null;

export const getStore = () => {
  if (!hasStore()) {
    throw new Error('gremlins-redux: trying to use the redux store, but none was added. Add a store with `addStore` first');
  }

  return __store;
};

const addComponentDispatchers = (component) => {
  const dispatchMap = component.__reduxMapDispatchToComponent();

  for (const action in dispatchMap) {
    if (dispatchMap.hasOwnProperty(action)) {
      component.redux.actions[ action ] = (...params) => {
        const store = getStore();
        store.dispatch(dispatchMap[ action ](...params));
      }
    }
  }
};

const deleteComponentDispatchers = (c) => {
  const actions = c.redux.actions;
  for (const action in actions) {
    if (actions.hasOwnProperty(action)) {
      delete actions[ action ];
    }
  }
};

const updateComponentState = (component, state, triggerUpdate) => {
  // console.log('updating state for', component.el, state);
  component.__reduxMapStateToComponent(state, triggerUpdate);
};

const propagateState = () => {
  const store = getStore();
  const state = store.getState();

  // console.log('propagating state for all components', state);
  components.forEach(c => updateComponentState(c, state, true));
};

export const addStore = newStore => {
  if (hasStore()) {
    throw new Error('gremlins-redux: you already added a store to the mixin');
  }

  __store = newStore;
  __store.subscribe(propagateState);
};

export const initComponent = c => {
};

export const addComponent = c => {
  const store = getStore();
  const state = store.getState();
  updateComponentState(c, state, false);
  addComponentDispatchers(c);
  components.add(c);
};

export const deleteComponent = c => {
  deleteComponentDispatchers(c);
  components.delete(c);
};


