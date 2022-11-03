import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';

import { LoadingComponent } from '../../../components/molecules';
import OnBackPressHeader from '../../../components/atoms/on-back-press-header';
import useTheme from '../../../theme/hooks/useTheme';

const AccountPaymentWebViewScreen = ({ route }) => {
  const redirectUrl = _.get(route, 'params.redirectUrl', '');
  const navigation = useNavigation();
  const { Layout } = useTheme();
  return (
    <View style={Layout.fill}>
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
            return navigation.navigate('PaymentStatus', { paymentStatus: 'success' });
          }
          if (
            nativeEvent.url.includes('collaboratoronline') &&
            nativeEvent.url.includes('failed')
          ) {
            return navigation.navigate('PaymentStatus', { paymentStatus: 'failed' });
          }
          if (
            nativeEvent.url.includes('collaboratoronline') &&
            nativeEvent.url.includes('cancel')
          ) {
            return navigation.navigate('PaymentStatus', { paymentStatus: 'cancelled' });
          }
          return null;
        }}
      />
    </View>
  );
};

AccountPaymentWebViewScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

AccountPaymentWebViewScreen.defaultProps = {};

export default AccountPaymentWebViewScreen;
