import React from 'react';
import { TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import PropTypes from 'prop-types';

import { useNavigation } from '@react-navigation/native';
import useTheme from '../../../theme/hooks/useTheme';

const OnBackPressHeader = ({ arrowColor }) => {
  const navigation = useNavigation();
  const { Gutters } = useTheme();

  const _handleBackPress = () => {
    navigation.pop();
  };

  return (
    <TouchableOpacity>
      <IconButton
        icon="arrow-left"
        size={30}
        color={arrowColor}
        onPress={_handleBackPress}
        style={[Gutters.largeTMargin]}
      />
    </TouchableOpacity>
  );
};

OnBackPressHeader.propTypes = {
  arrowColor: PropTypes.string,
};

OnBackPressHeader.defaultProps = {
  arrowColor: '#ffffff',
};

export default OnBackPressHeader;
