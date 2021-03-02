import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import { Image } from 'react-native-elements';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const LoginLogo = ({ contentContainerStyle }) => {
  const { Gutters, Images, Layout } = useTheme();
  return (
    <View style={contentContainerStyle}>
      <Image
        source={Images.collaboratorLogoText}
        resizeMode="contain"
        style={styles.collaboratorLogo}
        containerStyle={[Gutters.largeHMargin, Layout.alignSelfCenter]}
        placeholderStyle={styles.placeholder}
      />
    </View>
  );
};
LoginLogo.propTypes = {
  contentContainerStyle: ViewPropTypes.style,
};

LoginLogo.defaultProps = {
  contentContainerStyle: {},
};

const styles = StyleSheet.create({
  collaboratorLogo: {
    height: 180,
    width: 270,
  },
  placeholder: {
    backgroundColor: Colors.transparent,
  },
});
export default LoginLogo;
