import React from 'react';
import { TouchableOpacity, View, ViewPropTypes } from 'react-native';
import { Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../../theme/hooks/useTheme';

const LoginLink = ({ containerStyle }) => {
  const navigation = useNavigation();
  const { Layout, Common } = useTheme();
  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={[Layout.center]}
        delayPressIn={0}
        onPress={() => navigation.goBack()}
      >
        <Text style={[Common.link]}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

LoginLink.propTypes = {
  containerStyle: ViewPropTypes.style,
};

LoginLink.defaultProps = {
  containerStyle: {},
};

export default LoginLink;
