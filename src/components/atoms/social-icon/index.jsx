import React from 'react';
import { SafeAreaView } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import PropTypes from 'prop-types';

import _ from 'lodash';
import { useTheme } from '../../../theme';

const SocialIcon = (props) => {
  const { Gutters, Layout, Images } = useTheme();
  const { onPress, iconName, iconType, iconColor } = props;

  return (
    <SafeAreaView
      source={Images.serviceRequest}
      style={[Layout.alignItemsCenter, Layout.justifyContentCenter, Gutters.largeBPadding]}
    >
      <Icon
        onPress={onPress}
        name={iconName}
        size={40}
        type={iconType}
        color={iconColor}
        style={Gutters.regularHMargin}
        {...props}
      />
      <Text style={[Gutters.tinyTMargin, Gutters.largeBMargin]}>
        {_.get(props, 'label', 'phone')}
      </Text>
    </SafeAreaView>
  );
};

export default SocialIcon;
SocialIcon.propTypes = {
  onPress: PropTypes.func,
  iconName: PropTypes.string,
  iconColor: PropTypes.string.isRequired,
  iconType: PropTypes.string,
};

SocialIcon.defaultProps = {
  onPress: () => {},
  iconName: 'phone',
  iconType: 'material-community',
};
