/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable no-console */
import { handleActions } from 'redux-actions';

let defaultTheme = {};

try {
  defaultTheme = require('MCConfig/DefaultTheme');
} catch (error) {
  alert('请在MCConfig下配置DefaultTheme');
  console.warn('请在MCConfig下配置DefaultTheme');
}

const Theme = handleActions({

  MCRN_SET_THEME: (preData, action) => ({
    ...preData,
    ...action.payload,
  }),
}, {
  ...defaultTheme.default,
});

export default Theme;
