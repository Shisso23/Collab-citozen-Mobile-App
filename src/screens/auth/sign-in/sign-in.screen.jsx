import React from 'react';
import { useDispatch } from 'react-redux';
import { RegisterLink, ForgotPasswordLink } from '../../../components/atoms';
import { SignInForm } from '../../../components/forms';

import { userAuthService } from '../../../services';
import { signInModel } from '../../../models';
import { isAuthenticatedFlowAction } from '../../../reducers/app-reducer/app.actions';
import useTheme from '../../../theme/hooks/useTheme';
import { FormScreenContainer } from '../../../components';

const SignInScreen = () => {
  const dispatch = useDispatch();

  const { Gutters } = useTheme();

  const _onSignInSuccess = () => {
    dispatch(isAuthenticatedFlowAction());
  };
  return (
    <FormScreenContainer>
      <SignInForm
        submitForm={userAuthService.signIn}
        onSuccess={_onSignInSuccess}
        initialValues={signInModel()}
        containerStyle={[Gutters.smallHMargin]}
      />
      <RegisterLink containerStyle={[Gutters.regularMargin]} />
      <ForgotPasswordLink containerStyle={[Gutters.largeBMargin]} />
    </FormScreenContainer>
  );
};

export default SignInScreen;
