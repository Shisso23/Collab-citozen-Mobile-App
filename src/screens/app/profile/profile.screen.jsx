import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { UserInfoForm } from '../../../components/forms';
import { userModel } from '../../../models';
import { userService } from '../../../services';

const ProfileScreen = () => {
  const { user } = useSelector((reducers) => reducers.userReducer);
  const _onFormSuccess = () => {};
  return (
    <View>
      <UserInfoForm
        edit
        submitForm={userService.updateUser}
        onSuccess={_onFormSuccess}
        initialValues={userModel(user)}
      />
    </View>
  );
};

ProfileScreen.propTypes = {};

ProfileScreen.defaultProps = {};

export default ProfileScreen;
