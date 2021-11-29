import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Tab } from 'react-native-elements';
import PropTypes from 'prop-types';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import StatementsTabContent from '../../../components/molecules/add-account/statements-tab-content';

const AccountDetailsScreen = ({ route }) => {
  const accountDetails = _.get(route, 'params.account', {});
  const accountChannel = _.get(route, 'params.accountChannel.name', '');
  const statements = _.get(route, 'params.statements', []);
  const [tabIndex, setTabIndex] = useState(0);
  const { Gutters, Fonts, Layout, Images } = useTheme();

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill, Gutters.smallLMargin]}
        resizeMode="cover"
      >
        <Text style={[Gutters.smallVMargin, Fonts.titleTiny]}>Account</Text>
        <Text style={styles.accountDetails}>{_.get(accountDetails, 'accountNumber', '')}</Text>
        <Text style={[styles.accountDetails, Gutters.tinyVMargin]}>{accountChannel}</Text>
        <Tab
          value={tabIndex}
          onChange={(index) => {
            setTabIndex(index);
          }}
          indicatorStyle={{ backgroundColor: Colors.primary }}
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
          <View />
        )}
      </ImageBackground>
    </>
  );
};
const styles = StyleSheet.create({
  accountCard: { width: '42%' },
  accountDetails: { color: Colors.darkgray, fontSize: 15 },
  tabItem: { fontSize: 14 },
});

AccountDetailsScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

export default AccountDetailsScreen;
