import React from 'react';
import { ImageBackground, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { RegisterForm } from '../../../components/forms';
import { registrationUserModel } from '../../../models';
import { FormScreenContainer } from '../../../components';
import useTheme from '../../../theme/hooks/useTheme';
import OnBackPressHeader from '../../../components/atoms/on-back-press-header';
import { RegisterAction } from '../../../reducers/user-auth-reducer/user-auth.actions';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { Images, Layout, Gutters, Common } = useTheme();

  const _handleSubmit = (formData) => {
    return dispatch(RegisterAction(formData));
  };

  const _onFormSuccess = () => {
    navigation.pop();
  };

  return (
    <ImageBackground source={Images.loginBackground} style={[Layout.fullSize]} resizeMode="cover">
      <OnBackPressHeader />
      <FormScreenContainer contentContainerStyle={[Layout.scrollCenter]}>
        <Text style={[Common.loginLogo, Layout.alignSelfCenter, Gutters.largeBMargin]}>
          Register
        </Text>
        <RegisterForm
          submitForm={_handleSubmit}
          onSuccess={_onFormSuccess}
          initialValues={registrationUserModel()}
          containerStyle={Gutters.largeHMargin}
        />
      </FormScreenContainer>
    </ImageBackground>
  );
};

RegisterScreen.propTypes = {};
RegisterScreen.defaultProps = {};

export default RegisterScreen;
