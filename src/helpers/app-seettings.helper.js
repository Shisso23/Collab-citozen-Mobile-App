import { Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import IntentLauncher from 'react-native-intent-launcher';

export const openAppSetting = () => {
  const packageName = DeviceInfo.getBundleId();
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    IntentLauncher.startActivity({
      action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
      data: `package:${packageName}`,
    });
  }
};
