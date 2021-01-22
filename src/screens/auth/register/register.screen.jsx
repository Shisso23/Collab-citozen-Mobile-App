import React from 'react';
import { userAuthService } from '../../../services';
import { UserInfoForm } from '../../../components/forms';
import { registrationUserModel } from '../../../models';
import { FormScreenContainer } from '../../../components';

const RegisterScreen = () => {
  const _onFormSuccess = () => {};
  return (
    <FormScreenContainer>
      <UserInfoForm
        submitForm={userAuthService.register}
        onSuccess={_onFormSuccess}
        initialValues={registrationUserModel()}
      />
    </FormScreenContainer>
  );
};

RegisterScreen.propTypes = {};
RegisterScreen.defaultProps = {};

export default RegisterScreen;
