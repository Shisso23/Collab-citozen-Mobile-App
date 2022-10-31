import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { LoadingComponent } from '../../../components/molecules';
import OnBackPressHeader from '../../../components/atoms/on-back-press-header';
import useTheme from '../../../theme/hooks/useTheme';

const AccountPaymentWebViewScreen = ({ route }) => {
  const redirectUrl = _.get(route, 'params.redirectUrl', '');
  const { Layout } = useTheme();
  return (
    <View style={Layout.fill}>
      <OnBackPressHeader arrowColor="#000000" />
      <WebView
        startInLoadingState
        renderLoading={() => <LoadingComponent />}
        source={{ uri: `${redirectUrl}` }}
      />
    </View>
  );
};

AccountPaymentWebViewScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

AccountPaymentWebViewScreen.defaultProps = {};

export default AccountPaymentWebViewScreen;
