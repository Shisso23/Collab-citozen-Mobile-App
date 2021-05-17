import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { CheckBox, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import useTheme from '../../../theme/hooks/useTheme';

const TermsAndConditions = ({ checked, onPress }) => {
  const navigation = useNavigation();
  const { Common, Colors, Layout } = useTheme();

  return (
    <View style={[Layout.row, Layout.alignItemsCenter, Common.textInputWithShadow]}>
      <CheckBox
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={checked}
        onPress={onPress}
        checkedColor={Colors.primary}
      />
      <Text>I agree to the</Text>
      <TouchableOpacity delayPressIn={0} onPress={() => navigation.navigate('TermsAndConditions')}>
        <Text style={[Common.linkBlack]}> Terms and Conditions</Text>
      </TouchableOpacity>
    </View>
  );
};

TermsAndConditions.propTypes = {
  checked: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

TermsAndConditions.defaultProps = {
  checked: false,
};

export default TermsAndConditions;
