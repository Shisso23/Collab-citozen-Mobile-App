import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { List } from 'react-native-paper';
import { Text } from 'react-native-elements';

import useTheme from '../../../theme/hooks/useTheme';

const ServiceTypesView = ({ onServiceTypeSelected, category }) => {
  const { Gutters, Common, Layout, Fonts } = useTheme();
  const handleServiceTypeSelected = (serviceType) => () => {
    onServiceTypeSelected(serviceType);
  };

  return (
    <View style={styles.viewItemsTypesContainer}>
      <Text style={[Fonts.textLarge, styles.categoryText, Gutters.smallBMargin]}>
        {category.name}
      </Text>
      {category.serviceTypes.map((serviceTypeObject) => {
        return (
          <View
            key={`${serviceTypeObject.id}`}
            style={[Common.viewWithShadow, Gutters.smallBMargin]}
          >
            <List.Item
              style={Layout.fill}
              title={serviceTypeObject.name}
              titleNumberOfLines={3}
              onPress={handleServiceTypeSelected(serviceTypeObject)}
              titleStyle={Common.cardTitle}
            />
          </View>
        );
      })}
    </View>
  );
};

ServiceTypesView.propTypes = {
  category: PropTypes.object.isRequired,
  onServiceTypeSelected: PropTypes.func.isRequired,
};

ServiceTypesView.defaultProps = {};

const styles = StyleSheet.create({
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ServiceTypesView;
