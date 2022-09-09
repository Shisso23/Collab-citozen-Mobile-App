import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { Text, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const { width } = Dimensions.get('window');

const FeatureTile = ({
  backgroundImage,
  description,
  imageHeight,
  imageWidth,
  onPress,
  visible,
}) => {
  const { Layout, Gutters, Common, Images, Fonts } = useTheme();

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
      <ImageBackground
        source={backgroundImage}
        style={[
          {
            height: '100%',
            width: '100%',
            borderRadius: 15,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'flex-end',
          },
          Gutters.regularBPadding,
        ]}
        resizeMode="cover"
      >
        <Text style={[ Fonts.titleTiny, styles.description,]}>{description}</Text>
      </ImageBackground>
    </TouchableOpacity>
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
});

FeatureTile.propTypes = {
  backgroundImage: PropTypes.any.isRequired,
  imageWidth: PropTypes.number.isRequired,
  imageHeight: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  onPress: PropTypes.any.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default FeatureTile;
