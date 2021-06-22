import AsyncStorage from '@react-native-community/async-storage';
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
        await AsyncStorage.setItem(config.fcmTokenKey, fcmToken);
      }
    }
  }
  return fcmToken;
};

const saveMessage = async (remoteMessage) => {
  const currentMessages = await AsyncStorage.getItem('data_notifications');
  const messageArray = JSON.parse(currentMessages);
  messageArray.push(remoteMessage.data);
  await AsyncStorage.setItem('data_notifications', JSON.stringify(messageArray));
};

const processMessage = async (remoteMessage) => {
  const fcmEnabled = await AsyncStorage.getItem(config.fcmEnabled);
  const title = _.get(remoteMessage, 'notification.title', 'collaborator');
  const body = _.get(remoteMessage, 'notification.body', '');
  if (fcmEnabled === 'true') {
    FlashService.inbox(title, body);
  }
};

export default {
  getAndSetToken,
  messagingAllowed,
  processMessage,
  saveMessage,
};
