import { Alert } from 'react-native';

const createTwoButtonAlert = ({ title, message, onOk, onCancel }) =>
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        onPress: onCancel,
        style: 'cancel',
      },
      { text: 'OK', onPress: onOk },
    ],
    { cancelable: false },
  );

export default {
  createTwoButtonAlert,
};
