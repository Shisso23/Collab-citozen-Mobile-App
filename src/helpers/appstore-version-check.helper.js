import checkVersion from 'react-native-store-version';
import { Platform } from 'react-native';
import { getVersion } from 'react-native-device-info';
import { flashService } from '../services';
import config from '../config';

export const checkAppVersion = async () => {
  if (Platform.OS === 'ios') {
    try {
      const check = await checkVersion({
        version: getVersion(),
        iosStoreURL: `https://apps.apple.com/za/app/collab-citizen/id${config.appStoreAppId}`,
        androidStoreURL: `https://play.google.com/store/apps/details?id=${config.androidPackageId}`,
        country: 'za',
      });

      if (check.result === 'new') {
        return flashService.info('New version is Available on the store. Please Update');
      }
      return null;
    } catch (e) {
      return Promise.reject(e);
    }
  }
  if (Platform.OS === 'android') {
    const storeUrl = `https://play.google.com/store/apps/details?id=${config.androidPackageId}`;

    return fetch(storeUrl)
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        const match = text.toString().match(/[1-9]\.[1-9]\.[1-9]/); // only check for 2 digits versions eg. 1.4.8
        if (match) {
          const latestVersion = match[0].trim();
          if (
            parseInt(`${latestVersion}`.split('.').join(''), 10) >
            parseInt(getVersion().split('.').join(''), 10)
          ) {
            return flashService.info('New version is Available on the store. Please Update');
          }
          return Promise.resolve({ version: latestVersion, storeUrl });
        }
        return null;
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }
  return null;
};
