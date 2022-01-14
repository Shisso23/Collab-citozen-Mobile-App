import React, { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { Icon, Text } from 'react-native-elements';

import _ from 'lodash';
import { useTheme } from '../../../theme';
import { Colors } from '../../../theme/Variables';

const SocialIcon = (props) => {
  const { Gutters, Layout, Images } = useTheme();

  useLayoutEffect(() => {}, []);

  return (
    <SafeAreaView
      source={Images.serviceRequest}
      style={[Layout.alignItemsCenter, Layout.justifyContentCenter, Gutters.largeBPadding]}
    >
      <Icon
        onPress={_.get(props, 'onPress', () => {})}
        name={_.get(props, 'iconName', 'phone')}
        size={40}
        type={_.get(props, 'iconType', 'material-community')}
        color={Colors.primary}
        style={Gutters.regularHMargin}
        {...props}
      />
      <Text style={Gutters.tinyTMargin}>{_.get(props, 'label', 'phone')}</Text>
    </SafeAreaView>
  );
};

export default SocialIcon;
