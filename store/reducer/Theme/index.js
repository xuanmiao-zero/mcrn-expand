import { handleActions } from 'redux-actions';
import defaultTheme from 'MCConfig/DefaultTheme';


const Theme = handleActions({
  MCRN_SET_THEME: (preData, action) => ({
    ...preData,
    ...action.payload,
  }),
}, defaultTheme);

export default Theme;
