import React from 'react';
import { Text, View, ViewPropTypes } from 'react-native';
import useTheme from '../../../theme/hooks/useTheme';

const LoginLogo = ({ contentContainerStyle }) => {
  const { Gutters, Common, Fonts, Layout } = useTheme();
  return (
    <View style={contentContainerStyle}>
      <Text
        style={[Fonts.titleRegular, Common.loginLogo, Layout.alignSelfCenter, Gutters.largeMargin]}
      >
        Collab Citizen
      </Text>
    </View>
  );
};
LoginLogo.propTypes = {
  contentContainerStyle: ViewPropTypes.style,
};

LoginLogo.defaultProps = {
  contentContainerStyle: {},
};
export default LoginLogo;
