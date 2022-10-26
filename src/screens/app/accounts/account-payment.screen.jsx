import React from 'react';
import { View, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import useTheme from '../../../theme/hooks/useTheme';
import AccountPaymentForm from '../../../components/forms/account-payment-form/account-payment.form';

const AccountPaymentScreen = () => {
  const { Layout, Images } = useTheme();
  const navigation = useNavigation();

  const _onFormSuccess = () => {
    navigation.navigate('AccountPaymentWebView', {
      redirectUrl: 'https://www.google.com',
    });
  };
  const handleSubmit = async (values) => {
    _onFormSuccess();
    console.warn({ values });
  };

  return (
    <ImageBackground
      source={Images.serviceRequest}
      style={[Layout.fullSize, Layout.fill]}
      resizeMode="cover"
    >
      <View style={Layout.fill}>
        <AccountPaymentForm
          initialValues={{ eft: null, creditCard: null, amount: null }}
          submitForm={handleSubmit}
          onSuccess={_onFormSuccess}
        />
      </View>
    </ImageBackground>
  );
};

export default AccountPaymentScreen;
