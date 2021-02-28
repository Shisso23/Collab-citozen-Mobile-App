import React from 'react';
import { Linking, TouchableOpacity, View, ViewPropTypes } from 'react-native';
import { Text } from 'react-native-elements';
import useTheme from '../../../theme/hooks/useTheme';

const RegisterLink = ({ containerStyle }) => {
  const { Layout, Common } = useTheme();
  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={[Layout.center]}
        delayPressIn={0}
        onPress={() =>
          Linking.openURL('https://consumercollab.collaboratoronline.com/collab/CreateAccount.aspx')
        }
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
