import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../../screens/auth/sign-in/sign-in.screen';
import ForgotPasswordScene from '../../screens/auth/forgot-password/forgot-password.screen';
import RegisterScene from '../../screens/auth/register/register.screen';
import TermsAndConditionsScreen from '../../screens/global/terms-and-conditions/terms-and-conditions.screen';
import useTheme from '../../theme/hooks/useTheme';

const AuthStack = createStackNavigator();
const AuthNavigator = () => {
  const { Custom } = useTheme();
  return (
    <AuthStack.Navigator screenOptions={Custom.globalNavigatorScreenOptions}>
      <AuthStack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScene}
        options={{
          title: 'Forgot Password',
          header: () => null,
        }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScene}
        options={{
          title: 'Register',
          header: () => null,
        }}
      />
      <AuthStack.Screen
        name="TermsAndConditions"
        component={TermsAndConditionsScreen}
        options={{
          title: 'Terms And Conditions',
          header: () => null,
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
