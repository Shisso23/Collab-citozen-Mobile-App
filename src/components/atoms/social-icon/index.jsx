import React from 'react';
import { SafeAreaView } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import PropTypes from 'prop-types';

import _ from 'lodash';
import { useTheme } from '../../../theme';
import { Colors } from '../../../theme/Variables';

const SocialIcon = (props) => {
  const { Gutters, Layout, Images } = useTheme();
  const { onPress, iconName, iconType } = props;

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
        color={Colors.primary}
        style={Gutters.regularHMargin}
        {...props}
      />
      <Text style={Gutters.tinyTMargin}>{_.get(props, 'label', 'phone')}</Text>
    </SafeAreaView>
  );
};

export default SocialIcon;
SocialIcon.propTypes = {
  onPress: PropTypes.func,
  iconName: PropTypes.string,
  iconType: PropTypes.string,
};

SocialIcon.defaultProps = {
  onPress: () => {},
  iconName: 'phone',
  iconType: 'material-community',
};
