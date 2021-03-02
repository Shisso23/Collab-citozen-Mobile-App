import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import { formatTime } from '../../../helpers/time.helper';

const ServiceRequestDetails = ({ serviceRequest }) => {
  const { Gutters, Layout, Fonts } = useTheme();
  return (
    <View style={[Layout.row, Gutters.regularHMargin]}>
      <Avatar.Image rounded size={50} source={{ uri: serviceRequest.avatarUrl }} />
      <View style={[Gutters.regularHMargin, Layout.column, Gutters.smallTMargin]}>
        <Text style={[Fonts.textLarge]}>{`${serviceRequest.serviceType}`}</Text>

        <Text
          style={[Fonts.textRegular, Gutters.tinyVMargin]}
        >{`Com.Ref.NO: ${serviceRequest.referenceNumber}`}</Text>
        <Text
          style={[Fonts.textRegular, Gutters.tinyVMargin]}
        >{`Complaint: ${serviceRequest.serviceDescription}`}</Text>
        <Text style={[Fonts.textRegular, Gutters.tinyVMargin]}>{`Complaint Date: ${formatTime(
          serviceRequest.requestedDate,
        )}`}</Text>
        <Text style={[Fonts.textRegular, Gutters.tinyVMargin]}>{`${serviceRequest.address}`}</Text>
        <Text
          style={[Fonts.textRegular, Gutters.tinyVMargin, styles.button]}
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
