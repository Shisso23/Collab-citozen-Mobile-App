import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'react-native-paper';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import { formatTime } from '../../../helpers/time.helper';

const screenWidth = Dimensions.get('screen').width;
const ServiceRequestDetails = ({ serviceRequest }) => {
  const { Gutters, Layout, Fonts } = useTheme();

  const _setImageUrl = (item) => {
    return _.isEmpty(item.serviceRequestImage) ? null : [item.serviceRequestImage].flat()[0];
  };

  return (
    <View style={[Layout.row, Gutters.regularHMargin]}>
      <Avatar.Image rounded size={50} source={_setImageUrl(serviceRequest)} />
      <View style={[Gutters.tinyLMargin, Layout.column]}>
        <View
          style={[
            Layout.rowBetween,
            Layout.alignItemsCenter,
            ...[{ width: screenWidth - screenWidth * 0.18, height: 50 }],
          ]}
        >
          <Text
            style={[Fonts.textLarge, Gutters.tinyMargin]}
          >{`${serviceRequest.serviceType}`}</Text>
        </View>
        <View style={Gutters.smallRMargin}>
          <Text
            style={[Fonts.textRegular, Gutters.tinyMargin]}
          >{`Reference Number: ${serviceRequest.referenceNumber}`}</Text>
          <Text
            style={[Fonts.textRegular, Gutters.tinyMargin, styles.desciptionText]}
          >{`Description: ${serviceRequest.serviceDescription}`}</Text>
          <Text style={[Fonts.textRegular, Gutters.tinyMargin]}>{`Date Registered: ${formatTime(
            serviceRequest.requestedDate,
          )}`}</Text>
          <Text style={[Fonts.textRegular, Gutters.tinyMargin]}>{`${serviceRequest.address}`}</Text>
          <Text
            style={[Fonts.textRegular, Gutters.tinyMargin, styles.button]}
          >{`${serviceRequest.status}`}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    color: Colors.primary,
    width: 200,
  },
  desciptionText: { flexWrap: 'wrap', maxWidth: '80%' },
});

ServiceRequestDetails.propTypes = {
  serviceRequest: PropTypes.object.isRequired,
};

ServiceRequestDetails.defaultProps = {};
export default ServiceRequestDetails;
