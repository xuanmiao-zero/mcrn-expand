import { Dimensions, Platform, PixelRatio } from 'react-native';

const dimen = Dimensions.get('window');

// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;
const XR_MAX_WIDTH = 414;
const XR_MAX_HEIGHT = 896;

const DEVICE_WIDTH = dimen.width;
const DEVICE_HEIGHT = dimen.height;
const isIOS = Platform.OS === 'ios';
const fixSize = size => PixelRatio.roundToNearestPixel((size / 375) * DEVICE_WIDTH);
const onePixel = 1 / PixelRatio.get();
const isIphoneX = (isIOS &&
((DEVICE_HEIGHT === X_HEIGHT && DEVICE_WIDTH === X_WIDTH) ||
    (DEVICE_HEIGHT === X_WIDTH && DEVICE_WIDTH === X_HEIGHT))) || (isIOS &&
    ((DEVICE_HEIGHT === XR_MAX_HEIGHT && DEVICE_WIDTH === XR_MAX_WIDTH) ||
        (DEVICE_HEIGHT === XR_MAX_WIDTH && DEVICE_WIDTH === XR_MAX_HEIGHT)));

export {
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  onePixel,
  isIphoneX,
  fixSize,
  isIOS,
};
