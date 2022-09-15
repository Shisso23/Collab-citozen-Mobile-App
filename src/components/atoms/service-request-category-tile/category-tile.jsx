import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const { width } = Dimensions.get('window');

const CategoryTile = ({ categoryObject, size, onPress }) => {
  const { Layout, Gutters, Common } = useTheme();
  const { iconName, iconSet, name } = categoryObject;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        Layout.alignItemsStart,
        Gutters.tinyMargin,
        Gutters.regularBMargin,
        Common.viewWithShadow,
      ]}
    >
      <View
        style={[
          styles.contentContainer,
          Layout.alignitemsCenter,
          Layout.justifyContentCenter,
          Gutters.tinyadding,
        ]}
      >
        <Icon
          name={iconName}
          type={iconSet}
          size={size}
          color={Colors.darkgray}
          containerStyle={Gutters.tinyVMargin}
        />
        <Text numberOfLines={2} style={[styles.description, Gutters.smallPadding]}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.shadow,
    borderRadius: 11,
    height: width * 0.28,
    width: width * 0.27,
  },
  contentContainer: {
    borderRadius: 15,
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  description: {
    color: Colors.black,
    fontSize: 11,
    textAlign: 'center',
  },
});

CategoryTile.propTypes = {
  categoryObject: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    iconName: PropTypes.string.isRequired,
    iconSet: PropTypes.string.isRequired,
    favourite: PropTypes.bool.isRequired,
    serviceTypes: PropTypes.array.isRequired,
  }).isRequired,
  size: PropTypes.number,
  onPress: PropTypes.any.isRequired,
};

CategoryTile.defaultProps = {
  size: 38,
};

export default CategoryTile;
