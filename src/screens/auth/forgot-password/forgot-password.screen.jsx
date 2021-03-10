import React from 'react';
import { ImageBackground, Text } from 'react-native';
import { ForgotPasswordForm } from '../../../components/forms';
import { userAuthService } from '../../../services';
import { forgotPasswordModel } from '../../../models';
import { FormScreenContainer } from '../../../components';
import useTheme from '../../../theme/hooks/useTheme';
import LoginLink from '../../../components/atoms/login-link';

const ForgotPasswordScreen = () => {
  const { Images, Layout, Gutters, Common } = useTheme();
  return (
    <ImageBackground source={Images.loginBackground} style={[Layout.fullSize]} resizeMode="cover">
      <FormScreenContainer contentContainerStyle={[Layout.scrollCenter]}>
        <Text style={[Common.loginLogo, Layout.alignSelfCenter, Gutters.largeBMargin]}>
          Forgot Password
        </Text>
        <ForgotPasswordForm
          submitForm={userAuthService.forgotPassword}
          initialValues={forgotPasswordModel()}
          containerStyle={[Gutters.largeHMargin]}
        />
        <LoginLink containerStyle={[Gutters.largeMargin]} />
      </FormScreenContainer>
    </ImageBackground>
  );
};

ForgotPasswordScreen.propTypes = {};
ForgotPasswordScreen.defaultProps = {};

export default ForgotPasswordScreen;
