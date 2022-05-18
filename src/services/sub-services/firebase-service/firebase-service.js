import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import _ from 'lodash';

import config from '../../../config';
import FlashService from '../flash-service/flash.service';

const messagingAllowed = async () => {
  // eslint-disable-next-line no-return-await
  return await messaging().hasPermission();
};

const getAndSetToken = async () => {
  let fcmToken = await AsyncStorage.getItem(config.fcmTokenKey);
  const enabled = await messagingAllowed();

  if (enabled) {
    if (!fcmToken) {
      try {
        fcmToken = await messaging().getToken();
      } catch (e) {
        fcmToken = null;
      }
      if (fcmToken) {
        await AsyncStorage.setItem(`${config.fcmTokenKey}`, `${fcmToken}`);
      }
    }
  }
  return fcmToken;
};

const processMessage = async (remoteMessage) => {
  const title = _.get(remoteMessage, 'notification.title', 'collaborator');
  const body = _.get(remoteMessage, 'notification.body', '');
  FlashService.inbox(title, body);
};

export default {
  getAndSetToken,
  messagingAllowed,
  processMessage,
};
