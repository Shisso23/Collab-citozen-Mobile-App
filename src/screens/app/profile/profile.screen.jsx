import React from 'react';
import { useSelector } from 'react-redux';
import { UserInfoForm } from '../../../components/forms';
import { userService } from '../../../services';
import useTheme from '../../../theme/hooks/useTheme';
import FormScreenContainer from '../../../components/containers/form-screen-container/form-screen.container';

const ProfileScreen = () => {
  const { user } = useSelector((reducers) => reducers.userReducer);
  const _onFormSuccess = () => {};
  const { Gutters } = useTheme();

  return (
    <FormScreenContainer contentContainerStyle={[Gutters.largeMargin]}>
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
