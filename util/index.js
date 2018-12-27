const showLoading = () => {
  store.dispatch({ type: 'SHOW_LOADING' });
};

const hideLoading = () => {
  store.dispatch({ type: 'HIDE_LOADING' });
};

const changeTheme = (theme = {}) => {
  store.dispatch({ type: 'MCRN_SET_THEME', payload: theme });
};

export default {
  showLoading,
  hideLoading,
  changeTheme,
};

