import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import { formatTime } from '../../../helpers/time.helper';

const ServiceRequestDetails = ({ serviceRequest }) => {
  const { Gutters, Layout, Fonts } = useTheme();
  return (
    <View style={[Layout.row]}>
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
        <Button
          mode="outlined"
          color={Colors.primary}
          style={styles.button}
          labelStyle={[Fonts.textSmall, { color: Colors.white }]}
        >
          {serviceRequest.status}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    width: 120,
  },
});

ServiceRequestDetails.propTypes = {
  serviceRequest: PropTypes.object.isRequired,
};

ServiceRequestDetails.defaultProps = {};
export default ServiceRequestDetails;
