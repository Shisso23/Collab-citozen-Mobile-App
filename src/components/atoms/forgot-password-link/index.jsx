import React from 'react';
import { TouchableOpacity, View, ViewPropTypes } from 'react-native';
import { Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../../theme/hooks/useTheme';

const ForgotPasswordLink = ({ containerStyle }) => {
  const navigation = useNavigation();
  const { Layout, Common } = useTheme();
  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={[Layout.center]}
        delayPressIn={0}
        onPress={() => navigation.push('ForgotPassword')}
      >
        <Text style={[Common.link]}>Forgot Password</Text>
      </TouchableOpacity>
    </View>
  );
};

ForgotPasswordLink.propTypes = {
  containerStyle: ViewPropTypes.style,
};

ForgotPasswordLink.defaultProps = {
  containerStyle: {},
};

export default ForgotPasswordLink;
