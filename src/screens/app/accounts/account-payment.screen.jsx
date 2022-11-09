import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { Text } from 'react-native-elements';

import _ from 'lodash';
import useTheme from '../../../theme/hooks/useTheme';
import AccountPaymentForm from '../../../components/forms/account-payment-form/account-payment.form';
import { Colors } from '../../../theme/Variables';

const AccountPaymentScreen = ({ route }) => {
  const creditCardLink = _.get(route, 'params.creditCardLink', '');
  const eftLink = _.get(route, 'params.eftLink', '');
  const totalBalance = _.get(route, 'params.totalBalance', null);
  const maxAmount = _.get(route, 'params.maxAmount', null);
  const minAmount = _.get(route, 'params.minAmount', null);
  const channelRef = _.get(route, 'params.channelRef', null);
  const accountNumber = _.get(route, 'params.accountNumber', null);
  const { Layout, Images, Gutters, Common } = useTheme();
  const navigation = useNavigation();

  const _onFormSuccess = (paymentLink, amount) => {
    if (paymentLink) {
      navigation.navigate('AccountPaymentWebView', {
        redirectUrl: paymentLink,
        paymentAmount: amount,
        channelRef,
        accountNumber,
      });
    }
  };
  const handleSubmit = async (values) => {
    if (values.creditCard === true) {
      return Promise.resolve({ paymentLink: creditCardLink, amount: values.amount });
    }
    return Promise.resolve({ paymentLink: eftLink, amount: values.amount });
  };

  return (
    <ImageBackground
      source={Images.serviceRequest}
      style={[Layout.fullSize, Layout.fill]}
      resizeMode="cover"
    >
      <View style={Layout.fill}>
        <View style={[Gutters.largeHMargin, Gutters.tinyVMargin]}>
          <Text style={styles.title}>Payment</Text>
        </View>
        <View
          style={[
            Layout.alignSelfCenter,
            Layout.alignItemsCenter,
            Layout.justifyContentFlexEnd,
            Gutters.regularTMargin,
          ]}
        >
          <Text style={[Common.cardDescription, ...[{ color: Colors.secondary }]]}>
            Total Amount Due
          </Text>
          {totalBalance ? (
            <View
              style={[
                Common.textInputWithShadow,
                Gutters.smallPadding,
                Layout.rowBetween,
                Gutters.smallMargin,
                styles.balanceContainer,
              ]}
            >
              <>
                <Text style={[Common.cardDescription, styles.balance]}>
                  R {totalBalance.toFixed(2)}
                </Text>
              </>
            </View>
          ) : (
            <></>
          )}
        </View>
        <AccountPaymentForm
          initialValues={{ eft: null, creditCard: null, amount: null }}
          submitForm={handleSubmit}
          onSuccess={_onFormSuccess}
          minAmount={minAmount}
          maxAmount={maxAmount}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  balance: {
    fontWeight: '800',
  },
  balanceContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: '22%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 0.3,
  },
  title: { fontSize: 18, fontWeight: '500' },
});

AccountPaymentScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

export default AccountPaymentScreen;
