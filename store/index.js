/* eslint-disable no-global-assign */
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension'
import { createReactNavigationReduxMiddleware, createNavigationReducer } from 'react-navigation-redux-helpers';
import AppNavigator from 'MCConfig/Navigator';
import * as reducerothers from 'MCReducer';
import { autoCacheModule_prd as cacheModule, haveReactNativeDebugger } from 'MCConfig/app.json';
import * as systemReducers from './reducer';
import screentraker from './middleware/screenTraker';
import promiseMiddleWare from './middleware/promise';


const navReducer = createNavigationReducer(AppNavigator);

const reducers = combineReducers({
  nav: navReducer,
  ...reducerothers || {},
  ...systemReducers,
});

let devoptions = {};
if (!__DEV__) {
  devoptions = {
    whitelist: cacheModule,
  };
}
const persistConfig = {
  key: 'rootpersistKey',
  storage,
  timeout: 3000,
  ...devoptions,
};

const persistedReducer = persistReducer(persistConfig, reducers);
const navMiddleware = createReactNavigationReduxMiddleware('root', state => state.nav);
let combinedMiddleware = [promiseMiddleWare, thunk, navMiddleware, screentraker]
if (__DEV__) {
  if(haveReactNativeDebugger)
    combinedMiddleware = composeWithDevTools(applyMiddleware(...combinedMiddleware))
  else {
    combinedMiddleware.push(logger)
    combinedMiddleware = applyMiddleware(...combinedMiddleware)
  }
}
export default store = createStore(persistedReducer, combinedMiddleware);
export const persistor = persistStore(store);
