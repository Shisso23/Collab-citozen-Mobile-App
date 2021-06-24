import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import { formatTime } from '../../../helpers/time.helper';

const ServiceRequestDetails = ({ serviceRequest }) => {
  const { Gutters, Layout, Fonts } = useTheme();

  const _setImageUrl = (item) => {
    return _.isEmpty(item.serviceRequestImage) ? null : item.serviceRequestImage;
  };

  return (
    <View style={[Layout.row, Gutters.regularHMargin]}>
      <Avatar.Image rounded size={50} source={_setImageUrl(serviceRequest)} />
      <View style={[Gutters.regularHMargin, Layout.column, Gutters.smallTMargin]}>
        <Text style={[Fonts.textLarge, Gutters.tinyMargin]}>{`${serviceRequest.serviceType}`}</Text>

        <Text
          style={[Fonts.textRegular, Gutters.tinyMargin]}
        >{`Reference Number: ${serviceRequest.referenceNumber}`}</Text>
        <Text
          style={[Fonts.textRegular, Gutters.tinyMargin]}
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
  );
};

const styles = StyleSheet.create({
  button: {
    color: Colors.primary,
    width: 200,
  },
});

ServiceRequestDetails.propTypes = {
  serviceRequest: PropTypes.object.isRequired,
};

ServiceRequestDetails.defaultProps = {};
export default ServiceRequestDetails;
