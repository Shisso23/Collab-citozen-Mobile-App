import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';

export const handleNotificationOpenedBackGround = () => {
  const navigation = useNavigation();

  return () => {
    DeviceInfo.hasHms().then(() => {
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
    });
  };
};
