import gremlins from 'gremlins';
import gremlinsRedux from '../../src';

gremlins.create('x-app', {
  mixins: [gremlinsRedux],
  mapState(state) {
    console.log(state)
    return {counter: state.counter};
  },
  created() {
  },
});
