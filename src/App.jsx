import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';

import { useDispatch, useSelector } from 'react-redux';
import NavigationContainer from './navigation/root.navigator';
import { initAppAction } from './reducers/app-reducer/app.actions';
import { firebaseService, firebaseNotificationService } from './services';

const App = () => {
  const dispatch = useDispatch();
  const [fcmToken, setFcmToken] = useState(null);
  const [messagingEnabled, setMessagingEnabled] = useState(false);
  const { isAuthenticated } = useSelector((reducers) => reducers.userAuthReducer);
  const deviceId = DeviceInfo.getDeviceId();

  const requestPermission = async () => {
    await messaging().requestPermission();
    const token = await firebaseService.getAndSetToken();
    setFcmToken(token);
    return token;
  };

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    setMessagingEnabled(enabled === 1);
    if (enabled === 1) {
      const token = await firebaseService.getAndSetToken();
      setFcmToken(token);
      return token;
    }
    const token = await requestPermission();
    setFcmToken(token);
    return token;
  };

  const createNotificationListeners = async () => {
    messaging().onMessage((remoteMessage) => {
      firebaseService.processMessage(remoteMessage);
    });
  };

  useEffect(() => {
    if (isAuthenticated && messagingEnabled) {
      firebaseNotificationService.updateNotificationToken(fcmToken, deviceId);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    PushNotification.setApplicationIconBadgeNumber(0);
    LogBox.ignoreLogs([
      'Require cycle',
      'VirtualizedLists should never be nested',
      'Usage of "messaging().registerDeviceForRemoteMessages()" is not required.',
    ]);
    messaging()
      .registerDeviceForRemoteMessages()
      .then(() => {
        checkPermission().then(() => {
          createNotificationListeners().then(() => {
            messaging().setBackgroundMessageHandler((remoteMessage) => {
              firebaseService.processMessage(remoteMessage).then();
            });
          });
        });
      })
      .finally(() => {
        dispatch(initAppAction());
      });
  }, []);

  return <NavigationContainer />;
};

export default App;
