/* eslint-disable no-global-assign */
import { bindActionCreators } from 'redux'
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

export default mconnect = (
  stateKeys = null,
  actions = null,
) => WrappedComponent =>
  connect(
    stateKeys ? () => getState(stateKeys) : null,
    actions ? dispatch => bindActionCreators(actions, dispatch) : null,
  )(WrappedComponent);
