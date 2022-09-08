import React from 'react';
import { useSelector } from 'react-redux';
import { Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { UserInfoForm } from '../../../components/forms';
import { userService } from '../../../services';
import useTheme from '../../../theme/hooks/useTheme';
import FormScreenContainer from '../../../components/containers/form-screen-container/form-screen.container';

const ProfileScreen = () => {
  const { user } = useSelector((reducers) => reducers.userReducer);
  const navigation = useNavigation();
  const _onFormSuccess = () => {
    navigation.navigate('News');
  };
  const { Gutters, Fonts } = useTheme();

  return (
    <FormScreenContainer contentContainerStyle={[Gutters.smallHMargin, styles.container]}>
      <Text style={[Gutters.smallVMargin, Fonts.titleTiny]}>Profile</Text>
      <UserInfoForm
        edit
        submitForm={userService.updateUser}
        onSuccess={_onFormSuccess}
        initialValues={user}
      />
    </FormScreenContainer>
  );
};

ProfileScreen.propTypes = {};

ProfileScreen.defaultProps = {};

const styles = StyleSheet.create({
  container: { paddingBottom: 100 },
});

export default ProfileScreen;
