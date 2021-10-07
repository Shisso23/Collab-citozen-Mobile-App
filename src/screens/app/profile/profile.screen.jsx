import React from 'react';
import { useSelector } from 'react-redux';
import { Text, StyleSheet, View, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import IntentLauncher from 'react-native-intent-launcher';

import { UserInfoForm } from '../../../components/forms';
import { userService } from '../../../services';
import useTheme from '../../../theme/hooks/useTheme';
import FormScreenContainer from '../../../components/containers/form-screen-container/form-screen.container';

const ProfileScreen = () => {
  const { user } = useSelector((reducers) => reducers.userReducer);
  const navigation = useNavigation();
  const _onFormSuccess = () => {
    navigation.navigate('Home');
  };
  const { Gutters, Fonts, Colors, Layout } = useTheme();
  const packageName = DeviceInfo.getBundleId();

  const openAppSetting = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      IntentLauncher.startActivity({
        action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
        data: `package:${packageName}`,
      });
    }
  };

  return (
    <FormScreenContainer contentContainerStyle={[Gutters.smallHMargin, styles.container]}>
      <Text style={[Gutters.smallVMargin, Fonts.titleTiny]}>Profile</Text>
      <UserInfoForm
        edit
        submitForm={userService.updateUser}
        onSuccess={_onFormSuccess}
        initialValues={user}
      />
      <View style={[Layout.alignSelfEnd, Gutters.largeTMargin]}>
        <Text style={[Fonts.textRegular, styles.permissions]}>Manage your permissions</Text>
        <Icon
          name="gear"
          type="font-awesome"
          size={55}
          color={Colors.gray}
          onPress={openAppSetting}
          containerStyle={[Layout.alignSelfEnd, Gutters.regularTMargin]}
        />
      </View>
    </FormScreenContainer>
  );
};

ProfileScreen.propTypes = {};

ProfileScreen.defaultProps = {};

const styles = StyleSheet.create({
  container: { paddingBottom: 100 },
  permissions: { fontWeight: '500' },
});

export default ProfileScreen;
