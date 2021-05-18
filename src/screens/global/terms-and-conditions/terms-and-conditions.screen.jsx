import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

import { LoadingComponent } from '../../../components/molecules';
import OnBackPressHeader from '../../../components/atoms/on-back-press-header';
import config from '../../../config';
import useTheme from '../../../theme/hooks/useTheme';

const TermsAndConditionsScreen = () => {
  const { Layout } = useTheme();
  return (
    <View style={Layout.fill}>
      <OnBackPressHeader arrowColor="#000000" />
      <WebView
        startInLoadingState
        renderLoading={() => <LoadingComponent />}
        source={{ uri: `${config.webSiteUrl}/privacy-policy` }}
      />
    </View>
  );
};

TermsAndConditionsScreen.propTypes = {};

TermsAndConditionsScreen.defaultProps = {};

export const TermsAndConditionsNavKey = 'TermsAndConditions';
export default TermsAndConditionsScreen;
