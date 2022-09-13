import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const { width } = Dimensions.get('window');

const CategoryTile = ({ categoryObject, size, onPress }) => {
  const { Layout, Gutters, Common } = useTheme();
  const { iconName, iconSetName, name } = categoryObject;

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
          type={iconSetName}
          size={size}
          containerStyle={Gutters.smallBMargin}
        />
        <Text style={[styles.description]}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.shadow,
    borderRadius: 10,
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
    fontSize: 13,
    textAlign: 'center',
  },
});

CategoryTile.propTypes = {
  // TODO verify after real data
  categoryObject: PropTypes.shape({
    objId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    channelName: PropTypes.string.isRequired,
    channelObjectID: PropTypes.number.isRequired,
    iconName: PropTypes.string.isRequired,
    iconSetName: PropTypes.string.isRequired,
    favorite: PropTypes.bool.isRequired,
    serviceTypes: PropTypes.array.isRequired,
    municipalityCode: PropTypes.string.isRequired,
  }).isRequired,
  size: PropTypes.number,
  onPress: PropTypes.any.isRequired,
};

CategoryTile.defaultProps = {
  size: 38,
};

export default CategoryTile;
