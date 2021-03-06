/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-multi-comp */
/* eslint-disable import/imports-first */
import React, { Component } from 'react';
import { View, Text, NativeModules } from 'react-native';
import { Provider, connect } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { reduxifyNavigator } from 'react-navigation-redux-helpers';
import DeviceInfo from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ThemeProvider } from 'mcrn-ui';
import Loading from 'mcrn-ui/Loading';
import envConfig from 'MCConfig/Env';
import mconnect from './mconnect';
import store, { persistor } from './store';
import AppNavigator from 'MCConfig/Navigator';
import { sentryDsn, jsVersion } from 'MCConfig/app.json';
import CSS_CONFIG from './css';
import initialStorage from './storage';
import { isIOS } from './device';
import env from './env';
import {StoreContext} from 'redux-react-hook';

const NAVBAR_HEIGHT = isIOS ? 44 : 56;

EStyleSheet.build(CSS_CONFIG);
initialStorage();

@mconnect({ visible: 'Loading.visible', Theme: 'Theme' })
class PublicCom extends Component {
  render() {
    return (
      <ThemeProvider theme={this.props.Theme}>
        <View style={{ flex: 1 }}>
          {this.props.children}
          <Loading
            visible={this.props.visible}
            size="large"
            color="#FFF"
            overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            loaderStyle={{
              marginTop: -NAVBAR_HEIGHT,
            }}
          />
          {__DEV__ && <Text
            style={{ position: 'absolute', right: 15, width: 30, fontSize: 10, color: 'white', textAlign: 'center', borderRadius: 3, height: 15, bottom: 15, backgroundColor: 'pink' }} onPress={() => {
            persistor.purge();
          }}
          >clear</Text>}
        </View>
      </ThemeProvider>
    );
  }
}

const AppCom = reduxifyNavigator(AppNavigator, 'root');
const mapStateToProps = state => ({ state: state.nav });
const AppWithNavigationState = connect(mapStateToProps)(AppCom);

export default class App extends Component {
  constructor(props) {
    super(props);
    NativeModules.ConfigModule &&
    NativeModules.ConfigModule.setEnvOptions &&
    NativeModules.ConfigModule.setEnvOptions(Object.keys(envConfig));
    Object.assign(env, envConfig[props.envKey || 'prod']);

    if (sentryDsn) {
      const { Sentry } = require('react-native-sentry');
      Sentry.config(props.envKey === 'prod' ? sentryDsn.prod : sentryDsn.stage).install();
      Sentry.setRelease(`${DeviceInfo.getReadableVersion()}`);
      Sentry.setDist(`${jsVersion}`);
    }
  }

  render() {
    return (
      <StoreContext.Provider value={store}>
        <Provider store={store}>
          <PublicCom>
            <PersistGate loading={null} persistor={persistor}>
              <AppWithNavigationState />
            </PersistGate>
          </PublicCom>
        </Provider>
      </StoreContext.Provider>

    );
  }
}
