import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Tab } from 'react-native-elements';
import PropTypes from 'prop-types';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import StatementsTabContent from '../../../components/molecules/add-account/statements-tab-content';
import MetersTabContent from '../../../components/molecules/meters/meters-tab-content';

const AccountDetailsScreen = ({ route }) => {
  const accountDetails = _.get(route, 'params.account', {});
  const accountChannel = _.get(route, 'params.accountChannel.name', '');
  const channelRef = _.get(route, 'params.accountChannel.objectId', '');
  const statements = _.get(route, 'params.statements', []);
  const [tabIndex, setTabIndex] = useState(0);
  const { Gutters, Fonts, Layout, Images } = useTheme();
  const meters = _.get(accountDetails, 'meters', '');
  const accountNumber = _.get(accountDetails, 'accountNumber', '');

  const renderMakePaymentButtonContent = () => {
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
          <Text style={styles.submitButtonText}>R</Text>
        </View>
        <Text style={styles.submitButtonText}>Make a payment</Text>
      </>
    );
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
        <Text style={[styles.accountDetails, Gutters.smallLMargin]}>{accountNumber}</Text>
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
          {meters.length > 0 ? (
            <Tab.Item
              titleStyle={[{ color: tabIndex === 1 ? Colors.black : Colors.gray }, styles.tabItem]}
              title="Meters"
            />
          ) : (
            <View />
          )}
        </Tab>
        {tabIndex === 0 ? (
          <StatementsTabContent account={accountDetails} statements={statements} />
        ) : (
          <MetersTabContent meters={meters} accountNumber={accountNumber} channelRef={channelRef} />
        )}

        {false && ( // TODO remove this condition when we integrate payment
          <TouchableOpacity
            onPress={onMakePaymentPress}
            style={[
              styles.submitButton,
              Layout.alignItemsCenter,
              Layout.justifyContentCenter,
              Gutters.largeHMargin,
              Gutters.smallVPadding,
              Gutters.smallBMargin,
            ]}
          >
            {renderMakePaymentButtonContent()}
          </TouchableOpacity>
        )}
      </ImageBackground>
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
    height: 25,
    width: 25,
  },
  submitButtonText: { color: Colors.white, fontWeight: '600' },
  tabItem: { fontSize: 14 },
});

AccountDetailsScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

export default AccountDetailsScreen;
