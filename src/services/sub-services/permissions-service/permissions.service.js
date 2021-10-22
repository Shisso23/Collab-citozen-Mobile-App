import { Platform } from 'react-native';
import { check, PERMISSIONS, RESULTS, request, openSettings } from 'react-native-permissions';
import alertService from '../alert-service/alert.service';
import flashService from '../flash-service/flash.service';

const _hasPermissions = (permission) => permission === 'granted';

export const checkLocationPermissions = async () => {
  let permission;
  if (Platform.OS === 'android') {
    permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  } else {
    permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  }
  await checkPlatformLocationPermissions(permission);
};

const checkPlatformLocationPermissions = async (permission) => {
  const permissionStatus = await check(permission);
  if (!_hasPermissions(permissionStatus)) {
    await requestLocationPermissions(permission);
  }
};

const requestLocationPermissions = (platform) => {
  return new Promise((resolve, reject) => {
    return request(platform).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          flashService.info(
            'Location Services is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          reject(new Error('Please grant permissions to select a location.'));
          break;
        case RESULTS.GRANTED:
          resolve();
          break;
        case RESULTS.BLOCKED:
          alertService.createTwoButtonAlert({
            title: 'Location Permissions Error',
            message: 'Open settings to change permissions?',
            onOk: async () => openSettings(),
            onCancel: () => {},
          });
          break;
        default: {
          // eslint-disable-next-line no-console
          console.warn(`Error getting location permissions`);
        }
      }
    });
  });
};

const requestAndroidStoragePermissions = (platform) => {
  return new Promise((resolve, reject) => {
    return request(platform).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          flashService.info('Storage Services is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          reject(new Error('Please grant permissions to download statement.'));
          break;
        case RESULTS.GRANTED:
          resolve();
          break;
        case RESULTS.BLOCKED:
          alertService.createTwoButtonAlert({
            title: 'Storage Permissions Error',
            message: 'Open settings to change permissions?',
            onOk: async () => openSettings(),
            onCancel: () => {},
          });
          break;
        default: {
          // eslint-disable-next-line no-console
          console.warn(`Error getting storage permissions`);
        }
      }
    });
  });
};

const requestAndroidDownloadWithoutNotificationPermissions = (platform) => {
  return new Promise((resolve, reject) => {
    return request(platform).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          flashService.info(
            'Download without notification is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          reject(new Error('Please grant permissions to download statement.'));
          break;
        case RESULTS.GRANTED:
          resolve();
          break;
        case RESULTS.BLOCKED:
          alertService.createTwoButtonAlert({
            title: 'Download without notification Permissions Error',
            message: 'Open settings to change permissions?',
            onOk: async () => openSettings(),
            onCancel: () => {},
          });
          break;
        default: {
          // eslint-disable-next-line no-console
          console.warn(`Error getting Download without notification permissions`);
        }
      }
    });
  });
};

export const checkAndroidWriteStoragePermissions = async () => {
  let permission;
  if (Platform.OS === 'android') {
    permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

    const permissionStatus = await check(permission);
    if (!_hasPermissions(permissionStatus)) {
      await requestAndroidStoragePermissions(permission);
    }
  }
};

export const checkAndroidReadStoragePermissions = async () => {
  let permission;
  if (Platform.OS === 'android') {
    permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    const permissionStatus = await check(permission);
    if (!_hasPermissions(permissionStatus)) {
      await requestAndroidStoragePermissions(permission);
    }
  }
};

export const checkAndroidDownloadWithoutNotificationPermissions = async () => {
  let permission;
  if (Platform.OS === 'android') {
    permission = PERMISSIONS.ANDROID.DOWNLOAD_WITHOUT_NOTIFICATION;

    const permissionStatus = await check(permission);
    if (!_hasPermissions(permissionStatus)) {
      await requestAndroidDownloadWithoutNotificationPermissions(permission);
    }
  }
};

export default {
  checkLocationPermissions,
  checkAndroidDownloadWithoutNotificationPermissions,
  checkAndroidReadStoragePermissions,
  checkAndroidWriteStoragePermissions,
};
