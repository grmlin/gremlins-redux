import isPlainObject from 'is-plain-object';
import { getStore, initComponent, addComponent, deleteComponent } from './storeManager';

const reduxMixin = {
  created() {
    this.redux = {
      dispatch(...params) {
        const store = getStore();
        store.dispatch(...params);
      },
      get store() {
        return getStore();
      },
      state: {},
      actions: {},
    };
    
    initComponent(this);
  },
  attached() {
    addComponent(this);
  },
  detached() {
    deleteComponent(this);
  },
  __reduxMapStateToComponent(state, triggerUpdate = true) {
    if (typeof this.mapState === 'function') {
      this.redux.state = this.mapState(state);
      if (triggerUpdate && typeof this.onStateUpdate === 'function') {
        this.onStateUpdate();
      }
    }
  },
  __reduxMapDispatchToComponent(dispatch) {
    if (typeof this.mapDispatch === 'function') {
      return this.mapDispatch(dispatch);
    } else if (isPlainObject(this.mapDispatch)) {
      return this.mapDispatch;
    } else {
      return {};
    }
  }
};

export default reduxMixin;
