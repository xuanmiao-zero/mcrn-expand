/* eslint-disable no-global-assign */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { Component, PureComponent, useEffect } from 'react';
import { BackHandler } from 'react-native';
import Toast from 'react-native-root-toast';
import navigation from '../navigation';

function enhanceFunction(target) {
  const withEnhance = (props) => {
    this.begin = Date.now()
    this.backHardWare = () => {
      if (target.backHardWare) {
        target.backHardWare()
        return true
      }
      if (store.getState().nav.index === 0) {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
          BackHandler.exitApp()
          return false
        }
        Toast.show('再按一次退出!', {
          duration: 1000,
          position: Toast.positions.CENTER,
        });

        this.lastBackPressed = Date.now()
        return true
      }
      navigation.pop()
      return true
    }

    this.componentDidActive = (params) => {
      target.componentDidActive && target.componentDidActive(params)
    }

    this.componentWillDeactive = (params) => {
      target.componentWillDeactive && target.componentWillDeactive(params)
    }

    useEffect(() => {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.backHardWare())
      this.didFocusSubscription = props.navigation&&props.navigation.addListener('didFocus', payload => this.componentDidActive(payload.state && payload.state.params || {}))
      this.willBlurSubscription = props.navigation&&props.navigation.addListener('willBlur', payload => this.componentWillDeactive(payload.lastState && payload.lastState.params || {}))
      this.end = Date.now()
      if (__DEV__) {
        console.log(`${this.name}组件渲染时间->${this.end - this.begin}ms`)
      }
      return () => {
        this.backHandler.remove()
        this.didFocusSubscription.remove()
        this.willBlurSubscription.remove()
      }
    },[])
    if(target.$$typeof === Symbol.for('react.forward_ref')){
      return target.render.apply(this,arguments)
    }else{
      return target.apply(this, arguments)
    }
  }

  withEnhance.displayName = `enhanceFunction(${target.displayName || target.name || 'target'})`;
  return withEnhance
}

function enhanceClass(Target) {
  return class Enhancer extends Target {
    constructor(p) {
      super(p);
      this.name = `enhanceClass(${Target.name})`
      this.begin = Date.now()
      this.componentDidActive = this.componentDidActive.bind(this);
      this.componentWillDeactive = this.componentWillDeactive.bind(this);
      this.didFocusSubscription = this.props.navigation.addListener('didFocus', payload => this.componentDidActive(payload.state && payload.state.params || {}));
      this.willBlurSubscription = this.props.navigation.addListener('willBlur', payload => this.componentWillDeactive(payload.lastState && payload.lastState.params || {}));
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.backHardWare());
    }

    backHardWare = () => {
      if (super.backHardWare) {
        super.backHardWare();
        return true;
      }
      if (store.getState().nav.index === 0) {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
          BackHandler.exitApp();
          return false;
        }
        Toast.show('再按一次退出!', {
          duration: 1000,
          position: Toast.positions.CENTER,
        });

        this.lastBackPressed = Date.now();
        return true;
      }
      navigation.pop();
      return true;
    }

    componentDidActive = (params) => {
      super.componentDidActive && super.componentDidActive(params);
    }
    componentWillDeactive = (params) => {
      super.componentWillDeactive && super.componentWillDeactive(params);
    }

    componentDidMount() {
      super.componentDidMount && super.componentDidMount();
      this.end = Date.now();
      if (__DEV__) {
        console.log(`${Target.name}->组件渲染时间->${this.end - this.begin}ms`);
      }
    }

    componentWillUnmount() {
      this.setState = () => {};
      this.didFocusSubscription.remove();
      this.willBlurSubscription.remove();
      this.backHandler.remove();
      super.componentWillUnmount && super.componentWillUnmount();
    }

    render() {
      return super.render();
    }
  };
}

export default screen = target => {
  const isClass = Object.getPrototypeOf(target) === Component || Object.getPrototypeOf(target) === PureComponent
  return isClass ? enhanceClass(target) : enhanceFunction(target)
}
