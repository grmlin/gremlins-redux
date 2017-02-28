import gremlins from 'gremlins';

import configureStore from './store/configureStore';
import * as counterActions from './actions/counter';

const test = require('tape');
require('tape-dom')(test);
const store = configureStore();

const { addStore } = require('../src');
const reduxMixin = require('../src').default;

require('./components');

test('mixin has to be initialized to work', t => {
  // t.notOk(hasStore(), 'no store was added yet');
  // t.throws(getStore, 'getting the store before adding one throws an exception');
  // t.throws(() => reduxMixin.dispatch({ type: 'FOO' }), 'gremlin#dispatch fails if the store is missing');
  t.end();


  // const appEl = document.createElement('x-app');
  // document.body.appendChild(appEl);

  // t.ok(true);
  // t.end();
});

test('mixin exports methods to manage the store', t => {
  t.ok(typeof addStore === 'function', 'addStore is a function');

  t.ok(typeof reduxMixin.attached === 'function', 'redux-mixin#attached is a function');
  t.ok(typeof reduxMixin.detached === 'function', 'redux-mixin#detached is a function');
  t.ok(typeof reduxMixin.dispatch === 'function', 'redux-mixin#dispatch is a function');
  t.end();
});

test('you can add a store', t => {
  t.doesNotThrow(() => addStore(store), 'adds a store');
  t.throws(() => addStore(store), 'only one store can be added');
  t.end();
});

test('works with custom elements', { timeout: 500 }, t => {
  t.plan(5);

  let step = -1;

  gremlins.create('x-counter', {
    mixins: [ reduxMixin ],
    mapDispatch: {
      increment: counterActions.increment,
      decrement: counterActions.decrement,
    },
    attached() {
      setTimeout(() => {
        this.actions.increment();
        this.actions.increment();
        this.actions.increment();
      }, 50);
    },
  });

  gremlins.create('x-counter-last', {
    mixins: [ reduxMixin ],
    mapState(state) {
      return {
        counter: state.counter
      };
    },
    mapDispatch(){
      return {
        increment: counterActions.increment,
        decrement: counterActions.decrement,
      };
    },
    onStateUpdate() {
      if (this.state.counter === 3) {
        this.dispatch(counterActions.decrement());
      }
    },
  });

  gremlins.create('x-app', {
    mixins: [ reduxMixin ],
    mapState(state) {
      return {
        counter: state.counter
      };
    },
    onStateUpdate() {
      step++;

      this.el.innerHTML = this.state.counter;

      switch (step) {
        case 0:
          t.equal(this.state.counter, 0, 'counter is 0');
          break;
        case 1:
          t.equal(this.state.counter, 1, 'counter is 1');
          break;
        case 2:
          t.equal(this.state.counter, 2, 'counter is 2');
          break;
        case 3:
          t.equal(this.state.counter, 3, 'counter is 3');
          break;
        case 4:
          t.equal(this.state.counter, 2, 'counter is 2');
          break;
        default:
          break;
      }
    }
  });

  const appEl = document.createElement('x-app');
  const counterEl = document.createElement('x-counter');
  const counterLastEl = document.createElement('x-counter-last');
  document.body.appendChild(appEl);
  document.body.appendChild(counterEl);
  document.body.appendChild(counterLastEl);

});
