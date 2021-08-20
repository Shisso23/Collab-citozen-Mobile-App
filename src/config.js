import Config from 'react-native-config';

const {
  API_LOCATION,
  HOST_URL,
  GOOGLE_MAPS_API_KEY,
  WEB_SITE_URL,
  APPCENTER_ANDROID_PRODUCTION,
  APPCENTER_ANDROID_STAGING,
  APPCENTER_IOS_PRODUCTION,
  APPCENTER_IOS_STAGING,
  ENVIRONMENT,
} = Config;
export default {
  accessTokenKey: 'access_token',
  hostUrl: HOST_URL,
  apiUrl: `${HOST_URL}${API_LOCATION}`,
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  webSiteUrl: WEB_SITE_URL,
  fcmTokenKey: 'fcmToken',
  appCenterAndroid: APPCENTER_ANDROID_PRODUCTION,
  appCenterAndroidStaging: APPCENTER_ANDROID_STAGING,
  appCenterIos: APPCENTER_IOS_PRODUCTION,
  appCenterIosStaging: APPCENTER_IOS_STAGING,
  appEnvironment: ENVIRONMENT,
};
