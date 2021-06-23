import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { useDispatch } from 'react-redux';
import NavigationContainer from './navigation/root.navigator';
import { initAppAction } from './reducers/app-reducer/app.actions';
import { firebaseService } from './services';

const App = () => {
  const dispatch = useDispatch();

  const requestPermission = async () => {
    await messaging().requestPermission();
    await firebaseService.getAndSetToken();
  };

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled === 1) {
      await firebaseService.getAndSetToken();
    } else {
      requestPermission();
    }
  };

  const createNotificationListeners = async () => {
    messaging().onMessage((remoteMessage) => {
      firebaseService.processMessage(remoteMessage);
    });
  };

  useEffect(() => {
    LogBox.ignoreLogs(['Require cycle']);
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
