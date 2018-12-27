const isPromise = val => val && typeof val.then === 'function';
export default store => next => (action) => {
  const { dispatch } = store;
  return isPromise(action.payload) ? action.payload.then(
    result => dispatch({ ...action, payload: result }),
    error => dispatch({ ...action, payload: error, error: true })
  ) : next(action);
};
