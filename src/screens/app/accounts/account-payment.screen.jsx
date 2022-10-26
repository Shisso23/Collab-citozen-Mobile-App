import React from 'react';
import { View, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

import _ from 'lodash';
import useTheme from '../../../theme/hooks/useTheme';
import AccountPaymentForm from '../../../components/forms/account-payment-form/account-payment.form';

const AccountPaymentScreen = ({ route }) => {
  const link = _.get(route, 'params.link', 'https://www.google.com');
  const { Layout, Images } = useTheme();
  const navigation = useNavigation();

  const _onFormSuccess = () => {
    navigation.navigate('AccountPaymentWebView', {
      redirectUrl: link,
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

AccountPaymentScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

export default AccountPaymentScreen;
