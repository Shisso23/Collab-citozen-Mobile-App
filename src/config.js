import Config from 'react-native-config';

const {
  API_LOCATION,
  HOST_URL,
  GOOGLE_MAPS_API_KEY,
  MAP_KIT_KEY,
  WEB_SITE_URL,
  APPCENTER_ANDROID_PRODUCTION,
  APPCENTER_ANDROID_STAGING,
  APPCENTER_IOS_PRODUCTION,
  APPCENTER_IOS_STAGING,
  ENVIRONMENT,
  HUAWEI_API_KEY,
} = Config;
export default {
  accessTokenKey: 'access_token',
  hostUrl: HOST_URL,
  apiUrl: `${HOST_URL}${API_LOCATION}`,
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  mapKitKey: MAP_KIT_KEY,
  webSiteUrl: WEB_SITE_URL,
  fcmTokenKey: 'fcmToken',
  pushKitEnabled: 'pushKitEnabled',
  pushKitTokenKey: 'pushKitToken',
  appCenterAndroid: APPCENTER_ANDROID_PRODUCTION,
  appCenterAndroidStaging: APPCENTER_ANDROID_STAGING,
  appCenterIos: APPCENTER_IOS_PRODUCTION,
  appCenterIosStaging: APPCENTER_IOS_STAGING,
  appEnvironment: ENVIRONMENT,
  huaweiApiKey: HUAWEI_API_KEY,
  hmsSiteApiUrl: 'https://siteapi.cloud.huawei.com/mapApi/v1/siteService',
};
