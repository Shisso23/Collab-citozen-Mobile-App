import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const { width } = Dimensions.get('window');

const FeatureTile = ({ backgroundImage, description, onPress, visible }) => {
  const { Layout, Gutters, Common, Fonts } = useTheme();

  return (
    visible && (
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
        <ImageBackground
          source={backgroundImage}
          style={[
            styles.imageBackground,
            Layout.alignitemsCenter,
            Layout.justifyContentFlexEnd,
            Gutters.regularBPadding,
          ]}
          resizeMode="cover"
        >
          <Text style={[Fonts.titleTiny, styles.description]}>{description}</Text>
        </ImageBackground>
      </TouchableOpacity>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.shadow,
    borderRadius: 10,
    height: width * 0.4,
    width: width * 0.45,
  },
  description: {
    color: Colors.white,
    textAlign: 'center',
  },
  imageBackground: {
    borderRadius: 15,
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
});

FeatureTile.propTypes = {
  backgroundImage: PropTypes.any.isRequired,
  description: PropTypes.string.isRequired,
  onPress: PropTypes.any.isRequired,
  visible: PropTypes.bool,
};

FeatureTile.defaultProps = {
  visible: true,
};

export default FeatureTile;
