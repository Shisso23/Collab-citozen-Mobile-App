import React, { useState, createRef } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Tab } from 'react-native-elements';
import PropTypes from 'prop-types';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import StatementsTabContent from '../../../components/molecules/add-account/statements-tab-content';
import MetersTabContent from '../../../components/molecules/meters/meters-tab-content';
import SubmitReadingActionSheetContent from '../../../components/molecules/meters/submit-reading-actionsheet-content';

const AccountDetailsScreen = ({ route }) => {
  const accountDetails = _.get(route, 'params.account', {});
  const accountChannel = _.get(route, 'params.accountChannel.name', '');
  const statements = _.get(route, 'params.statements', []);
  const actionSheetRef = createRef();
  const [tabIndex, setTabIndex] = useState(0);
  const { Gutters, Fonts, Layout, Images } = useTheme();

  const renderSubmitButtonContent = (type) => {
    return (
      <>
        <View
          style={[
            styles.submitButtonContent,
            Layout.alignItemsCenter,
            Layout.justifyContentCenter,
            Gutters.smallBMargin,
          ]}
        >
          <Text style={styles.submitButtonText}>{type === 'reading' ? '767' : 'R'}</Text>
        </View>
        <Text style={styles.submitButtonText}>
          {type === 'reading' ? 'Submit a reading' : 'Make a payment'}
        </Text>
      </>
    );
  };
  const openActionSheet = () => {
    return actionSheetRef.current.setModalVisible(true);
  };

  const onSubmitReadingPress = () => {
    openActionSheet();
  };
  const onMakePaymentPress = () => {};

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill]}
        resizeMode="cover"
      >
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>Account</Text>
        <Text style={[styles.accountDetails, Gutters.smallLMargin]}>
          {_.get(accountDetails, 'accountNumber', '')}
        </Text>
        <Text style={[styles.accountDetails, Gutters.tinyVMargin, Gutters.smallLMargin]}>
          {accountChannel}
        </Text>
        <Tab
          value={tabIndex}
          onChange={(index) => {
            setTabIndex(index);
          }}
          indicatorStyle={{ backgroundColor: Colors.softBlue }}
        >
          <Tab.Item
            titleStyle={[{ color: tabIndex === 0 ? Colors.black : Colors.gray }, styles.tabItem]}
            title="Statements"
          />
          <Tab.Item
            titleStyle={[{ color: tabIndex === 1 ? Colors.black : Colors.gray }, styles.tabItem]}
            title="Meters"
          />
        </Tab>
        {tabIndex === 0 ? (
          <StatementsTabContent account={accountDetails} statements={statements} />
        ) : (
          <MetersTabContent />
        )}
        <TouchableOpacity
          onPress={tabIndex === 0 ? onMakePaymentPress : onSubmitReadingPress}
          style={[
            styles.submitButton,
            Layout.alignItemsCenter,
            Layout.justifyContentCenter,
            Gutters.largeMargin,
            Gutters.smallVPadding,
          ]}
        >
          {renderSubmitButtonContent(tabIndex === 0 ? 'payment' : 'reading')}
        </TouchableOpacity>
      </ImageBackground>
      <ActionSheet ref={actionSheetRef} gestureEnabled>
        <SubmitReadingActionSheetContent />
      </ActionSheet>
    </>
  );
};
const styles = StyleSheet.create({
  accountCard: { width: '42%' },
  accountDetails: { color: Colors.darkgray, fontSize: 15 },
  submitButton: { backgroundColor: Colors.softBlue, borderRadius: 10 },
  submitButtonContent: {
    borderColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1.5,
    height: 38,
    width: 38,
  },
  submitButtonText: { color: Colors.white, fontWeight: '600' },
  tabItem: { fontSize: 14 },
});

AccountDetailsScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

export default AccountDetailsScreen;
