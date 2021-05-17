import React from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

import { LoadingComponent } from '../../../components/molecules';
import OnBackPressHeader from '../../../components/atoms/on-back-press-header';
import config from '../../../config';

const TermsAndConditionsScreen = () => {
  return (
    <View style={styles.container}>
      <OnBackPressHeader arrowColor="#000000" />
      <WebView
        startInLoadingState
        renderLoading={() => <LoadingComponent />}
        source={{ uri: `${config.webSiteUrl}/privacy-policy` }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

TermsAndConditionsScreen.propTypes = {};

TermsAndConditionsScreen.defaultProps = {};

export const TermsAndConditionsNavKey = 'TermsAndConditions';
export default TermsAndConditionsScreen;
