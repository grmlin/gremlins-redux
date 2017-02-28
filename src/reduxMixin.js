import isPlainObject from 'is-plain-object';
import { getStore, initComponent, addComponent, deleteComponent } from './storeManager';

const reduxMixin = {
  created() {
    this.state = {};
    this.actions = {};
    initComponent(this);
  },
  attached() {
    addComponent(this);
  },
  detached() {
    deleteComponent(this);
  },
  dispatch(...params) {
    const store = getStore();
    store.dispatch(...params);
  },
  __reduxMapStateToComponent(state) {
    if (typeof this.mapState === 'function') {
      this.state = this.mapState(state);
      if (typeof this.onStateUpdate === 'function') {
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
