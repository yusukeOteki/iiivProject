import * as types from '../constants/ActionTypes';

function increment() {
  return { type: types.INCREMENT };
}

function decrement() {
  return { type: types.DECREMENT };
}

const CounterActions = {
  increment,
  decrement,
};

export default CounterActions;
