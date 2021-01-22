import React from 'react';
import { TouchableOpacity, View, ViewPropTypes } from 'react-native';
import { Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../../theme/hooks/useTheme';

const RegisterLink = ({ containerStyle }) => {
  const navigation = useNavigation();
  const { Layout, Common } = useTheme();
  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={[Layout.center]}
        delayPressIn={0}
        onPress={() => navigation.push('Register')}
      >
        <Text style={[Common.link]}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

RegisterLink.propTypes = {
  containerStyle: ViewPropTypes.style,
};

RegisterLink.defaultProps = {
  containerStyle: {},
};

export default RegisterLink;
