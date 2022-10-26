import React, { useState } from 'react';
import { View, ImageBackground, Text, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

import _ from 'lodash';
import useTheme from '../../../theme/hooks/useTheme';
import AccountPaymentForm from '../../../components/forms/account-payment-form/account-payment.form';

const AccountPaymentScreen = ({ route }) => {
  const creditCardLink = _.get(route, 'params.creditCardLink', '');
  const eftLink = _.get(route, 'params.eftLink', '');
  const { Layout, Images } = useTheme();
  const [paymentLink, setPaymentLink] = useState(null);
  const navigation = useNavigation();

  const _onFormSuccess = () => {
    navigation.navigate('AccountPaymentWebView', {
      redirectUrl: paymentLink,
    });
  };
  const handleSubmit = async (values) => {
    if (values.creditCard === true) {
      setPaymentLink(creditCardLink);
    } else {
      setPaymentLink(eftLink);
    }
    _onFormSuccess();
    console.warn({ values });
  };

  return (
    <ImageBackground
      source={Images.serviceRequest}
      style={[Layout.fullSize, Layout.fill]}
      resizeMode="cover"
    >
      <TouchableOpacity
        onPress={() =>
          Linking.openURL('https://citizen.collaboratoronline.com')
            .then((supported) => {
              if (!supported) {
                return console.log('Operation is not supported!');
              }
              return Linking.openURL('https://citizen.collaboratoronline.com');
            })
            .catch((error) => console.log({ error }))
        }
      >
        <Text>Click here to test deep links</Text>
      </TouchableOpacity>
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
