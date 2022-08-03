import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import { HmsPushEvent, HmsPushMessaging } from '@hmscore/react-native-hms-push';

export const handleNotificationOpenedBackGround = () => {
  const navigation = useNavigation();

  return () => {
    DeviceInfo.hasHms().then((hasHms) => {
      if (hasHms) {
        HmsPushEvent.onNotificationOpenedApp((remoteMessage) => {
          if (!_.isEmpty(remoteMessage)) {
            navigation.navigate('Inbox');
          }
        });

        HmsPushMessaging.getInitialNotification().then((remoteMessage) => {
          if (!_.isEmpty(remoteMessage.result)) {
            navigation.navigate('Inbox');
          }
        });
      } else {
        messaging().onNotificationOpenedApp((remoteMessage) => {
          if (!_.isEmpty(remoteMessage)) {
            navigation.navigate('Inbox');
          }
        });

        messaging()
          .getInitialNotification()
          .then((remoteMessage) => {
            if (!_.isEmpty(remoteMessage)) {
              navigation.navigate('Inbox');
            }
          });
      }
    });
  };
};
