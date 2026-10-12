import Constants from 'expo-constants';

let mobileAds: any, MaxAdContentRating: any;
const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo) {
  try {
    const admobModule = require('react-native-google-mobile-ads');
    mobileAds = admobModule.default;
    MaxAdContentRating = admobModule.MaxAdContentRating;

    mobileAds()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: true,
        testDeviceIdentifiers: ['EMULATOR'],
      })
      .then(() => {
      });
  } catch (error) {
    console.log('AdMob module not available for configuration:', error);
  }
} else {
  console.log('Skipping AdMob configuration in Expo GO');
}
