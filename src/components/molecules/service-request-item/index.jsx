import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import _ from 'lodash';
import { Avatar, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';

import useTheme from '../../../theme/hooks/useTheme';

const ServiceRequestItem = ({ item, onPress }) => {
  const { Common, Gutters, Fonts, Layout, Colors } = useTheme();

  const _setImageUrl = (serviceRequestItem) => {
    return !serviceRequestItem.serviceRequestImage
      ? null
      : serviceRequestItem.serviceRequestImage[0];
  };
  const _getStatusIndicator = (status) => {
    switch (status) {
      case 'Registered':
        return Colors.warning;
      case 'Initial':
        return Colors.warning;
      case 'Assigned':
        return Colors.primary;
      case 'Completed':
        return Colors.secondary;
      case 'Work in Progress':
        return Colors.warning;
      default:
        return Colors.error;
    }
  };

  return (
    <View style={[Common.textInputWithShadow, Gutters.tinyMargin, styles.serviceRequestItem]}>
      <List.Item
        title={item.serviceType}
        titleStyle={Common.cardTitle}
        description={() => (
          <View style={[Layout.column, Gutters.largeRMargin]}>
            <Text style={Common.cardDescription}>{item.gpsAddress}</Text>
            <View style={[Layout.rowHCenter, Gutters.tinyTPadding]}>
              <View
                style={[
                  Gutters.tinyHMargin,
                  Common.statusIndicator,
                  { backgroundColor: _getStatusIndicator(item.status) },
                ]}
              />
              <Text style={[Fonts.textRegular, Common.cardDescription]}>{item.status}</Text>
            </View>
          </View>
        )}
        onPress={onPress}
        left={() => (
          <View style={[Layout.justifyContentCenter]}>
            <Avatar.Image rounded size={50} source={_setImageUrl(item)} />
          </View>
        )}
        right={() => (
          <View style={[Layout.rowVCenter]}>
            {!_.isEmpty(item.serviceRequestImage) ? null : (
              <Icon
                color={Colors.red}
                size={20}
                name="camera"
                style={[Layout.alignSelfCenter, Gutters.smallHMargin]}
              />
            )}
          </View>
        )}
        descriptionNumberOfLines={10}
        descriptionStyle={[Gutters.largeRMargin]}
      />
    </View>
  );
};

ServiceRequestItem.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

ServiceRequestItem.defaultProps = {};

const styles = StyleSheet.create({
  serviceRequestItem: {
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default ServiceRequestItem;
