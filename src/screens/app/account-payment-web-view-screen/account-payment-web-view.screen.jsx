import React from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';

import { LoadingComponent } from '../../../components/molecules';
import OnBackPressHeader from '../../../components/atoms/on-back-press-header';
import useTheme from '../../../theme/hooks/useTheme';

const AccountPaymentWebViewScreen = ({ route }) => {
  const redirectUrl = _.get(route, 'params.redirectUrl', '');
  const paymentAmount = _.get(route, 'params.paymentAmount', '');
  const channelRef = _.get(route, 'params.channelRef', '');
  const accountNumber = _.get(route, 'params.accountNumber', '');
  const navigation = useNavigation();
  const { Layout } = useTheme();
  return (
    <View style={[Layout.fill, styles.container]}>
      <OnBackPressHeader arrowColor="#000000" />
      <WebView
        startInLoadingState
        renderLoading={() => <LoadingComponent />}
        source={{ uri: `${redirectUrl}` }}
        onLoadProgress={({ nativeEvent }) => {
          if (
            nativeEvent.url.includes('collaboratoronline') &&
            nativeEvent.url.includes('successful')
          ) {
            return navigation.navigate('PaymentStatus', {
              paymentStatus: 'success',
              paymentAmount,
              channelRef,
              accountNumber,
              paymentRef: nativeEvent.url
                .substr(nativeEvent.url.lastIndexOf('payatReferenceNum='), 35)
                .split('=')[1],
            });
          }
          if (
            nativeEvent.url.includes('collaboratoronline') &&
            nativeEvent.url.includes('failed')
          ) {
            return navigation.navigate('PaymentStatus', {
              paymentStatus: 'failed',
              paymentAmount,
              channelRef,
              accountNumber,
              paymentRef: nativeEvent.url
                .substr(nativeEvent.url.lastIndexOf('payatReferenceNum='), 35)
                .split('=')[1],
            });
          }
          if (
            nativeEvent.url.includes('collaboratoronline') &&
            nativeEvent.url.includes('cancel')
          ) {
            return navigation.navigate('PaymentStatus', {
              paymentStatus: 'cancelled',
              paymentAmount,
              channelRef,
              accountNumber,
              paymentRef: nativeEvent.url
                .substr(nativeEvent.url.lastIndexOf('payatReferenceNum='), 35)
                .split('=')[1],
            });
          }
          return null;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 90 },
});

AccountPaymentWebViewScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

AccountPaymentWebViewScreen.defaultProps = {};

export default AccountPaymentWebViewScreen;
