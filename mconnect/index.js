/* eslint-disable no-global-assign */
import { connect } from 'react-redux';
import { get } from 'lodash-core'

export const getState = subscribedNodes => state => ({
  ...Object.keys(subscribedNodes).reduce(
    (acc, key) => ({
      ...acc,
      [key]: get(state, subscribedNodes[key]),
    }),
    {},
  ),
});

export const getDispatch = dispatchobj => dispatch =>
  Object.keys(dispatchobj)
    .map(keys => ({
      [keys]: (...args) => dispatch(dispatchobj[keys](...args)),
    }))
    .reduce((last, curr) => ({ ...last, ...curr }), {});

export default mconnect = (
  stateKeys = null,
  dispatchActions = null,
) => WrappedComponent =>
  connect(
    stateKeys ? () => getState(stateKeys) : null,
    dispatchActions ? () => getDispatch(dispatchActions) : null,
  )(WrappedComponent);
