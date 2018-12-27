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
import { autoCacheModule_prd as cacheModule } from 'MCConfig/app.json';
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
const navmiddleware = createReactNavigationReduxMiddleware('root', state => state.nav);
const middlewares = [promiseMiddleWare, thunk, navmiddleware, screentraker];
let combinedMiddleware = applyMiddleware(...middlewares)
if (__DEV__) {
  middlewares.push(logger);
  combinedMiddleware = composeWithDevTools(combinedMiddleware)
}
export default store = createStore(persistedReducer, combinedMiddleware);
export const persistor = persistStore(store);
