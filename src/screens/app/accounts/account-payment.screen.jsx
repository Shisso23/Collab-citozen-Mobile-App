import React from 'react';
import { View, ImageBackground, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import AccountPaymentForm from '../../../components/forms/account-payment-form/account-payment.form';
import { Colors } from '../../../theme/Variables';
import { paymentService } from '../../../services';

const AccountPaymentScreen = ({ route }) => {
  const accountPaymentDetails = _.get(route, 'params.accountPaymentDetails', {});
  const totalBalance = _.get(accountPaymentDetails, 'amount', null);
  const maxAmount = _.get(accountPaymentDetails, 'maxAmount', null);
  const minAmount = _.get(accountPaymentDetails, 'minAmount', null);
  const channelRef = _.get(route, 'params.channelRef', null);
  const userToken = _.get(route, 'params.userToken', null);
  const accountNumber = _.get(accountPaymentDetails, 'accountNumber', null);
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
    return paymentService
      .initiatePayment({
        accountNumber,
        amount: values.amount,
        token: _.get(accountPaymentDetails, 'token', null),
        authToken: userToken,
      })
      .then((response) => {
        const creditCardLink = response.webPaymentLinks.filter(
          (link) => link.paymentMethodName === 'CARD',
        )[0].paymentUrl;
        const eftLink = response.webPaymentLinks.filter(
          (link) => link.paymentMethodName === 'EFT',
        )[0].paymentUrl;
        if (values.creditCard === true) {
          return { paymentLink: creditCardLink, amount: values.amount };
        }
        return { paymentLink: eftLink, amount: values.amount };
      });
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
