import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { useDispatch } from 'react-redux';
import { Image } from 'react-native-elements';
import { StyleSheet } from 'react-native';
import { RegisterLink, ForgotPasswordLink } from '../../../components/atoms';
import { SignInForm } from '../../../components/forms';

import { userAuthService } from '../../../services';
import { signInModel } from '../../../models';
import { isAuthenticatedFlowAction } from '../../../reducers/app-reducer/app.actions';
import useTheme from '../../../theme/hooks/useTheme';
import { FormScreenContainer } from '../../../components';
import { Colors } from '../../../theme/Variables';

const SignInScreen = () => {
  const dispatch = useDispatch();

  const { Gutters, Layout, Images } = useTheme();

  const _onSignInSuccess = async () => {
    RNBootSplash.show({ fade: true });
    await dispatch(isAuthenticatedFlowAction());
    RNBootSplash.hide({ fade: true });
  };

  return (
    <FormScreenContainer contentContainerStyle={[Layout.scrollCenter]}>
      <Image
        source={Images.collaboratorLogo}
        resizeMode="contain"
        style={styles.collaboratorLogo}
        containerStyle={[Gutters.largeHMargin]}
        placeholderStyle={{ backgroundColor: Colors.white }}
      />
      <SignInForm
        submitForm={userAuthService.signIn}
        onSuccess={_onSignInSuccess}
        initialValues={signInModel()}
        containerStyle={[Gutters.largeMargin]}
      />
      <RegisterLink containerStyle={[Gutters.regularMargin]} />
      <ForgotPasswordLink containerStyle={[Gutters.largeBMargin]} />
    </FormScreenContainer>
  );
};

const styles = StyleSheet.create({
  collaboratorLogo: {
    height: 180,
  },
});
export default SignInScreen;
