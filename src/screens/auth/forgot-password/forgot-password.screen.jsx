import React from 'react';
import { ImageBackground, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { ForgotPasswordForm } from '../../../components/forms';
import { forgotPasswordModel } from '../../../models';
import { FormScreenContainer } from '../../../components';
import useTheme from '../../../theme/hooks/useTheme';
import OnBackPressHeader from '../../../components/atoms/on-back-press-header';
import { forogtPasswordAction } from '../../../reducers/user-auth-reducer/user-auth.actions';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { Images, Layout, Gutters, Common } = useTheme();

  const _handleSubmit = (formData) => {
    return dispatch(forogtPasswordAction(formData));
  };

  const _onFormSuccess = () => {
    navigation.pop();
  };

  return (
    <ImageBackground source={Images.loginBackground} style={[Layout.fullSize]} resizeMode="cover">
      <OnBackPressHeader />
      <FormScreenContainer contentContainerStyle={[Layout.scrollCenter]}>
        <Text style={[Common.loginLogo, Layout.alignSelfCenter, Gutters.largeBMargin]}>
          Forgot Password
        </Text>
        <ForgotPasswordForm
          submitForm={_handleSubmit}
          onSuccess={_onFormSuccess}
          initialValues={forgotPasswordModel()}
          containerStyle={Gutters.largeMargin}
        />
      </FormScreenContainer>
    </ImageBackground>
  );
};

ForgotPasswordScreen.propTypes = {};
ForgotPasswordScreen.defaultProps = {};

export default ForgotPasswordScreen;
