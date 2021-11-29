import React from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const AccountDetailsScreen = ({ route }) => {
  const accountDetails = _.get(route, 'params.account', {});
  const accountChannel = _.get(route, 'params.accountChannel.name', '');
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
      </ImageBackground>
    </>
  );
};
const styles = StyleSheet.create({
  accountCard: { width: '42%' },
  accountDetails: { color: Colors.darkgray, fontSize: 15 },
});

AccountDetailsScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

export default AccountDetailsScreen;
