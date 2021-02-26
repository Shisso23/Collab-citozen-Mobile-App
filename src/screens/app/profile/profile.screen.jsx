import React from 'react';
import { useSelector } from 'react-redux';
import { Text } from 'react-native';
import { UserInfoForm } from '../../../components/forms';
import { userService } from '../../../services';
import useTheme from '../../../theme/hooks/useTheme';
import FormScreenContainer from '../../../components/containers/form-screen-container/form-screen.container';

const ProfileScreen = () => {
  const { user } = useSelector((reducers) => reducers.userReducer);
  const _onFormSuccess = () => {};
  const { Gutters, Fonts, Layout, Common } = useTheme();

  return (
    <FormScreenContainer
      contentContainerStyle={[Gutters.largeHMargin, Layout.fullHeight, Common.backgroundWhite]}
    >
      <Text style={[Gutters.smallBMargin, Fonts.titleTiny]}>Profile</Text>
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

export default ProfileScreen;
