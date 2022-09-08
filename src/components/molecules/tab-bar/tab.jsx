import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import _ from 'lodash';
import { useTheme } from '../../../theme';
import { Colors } from '../../../theme/Variables';

const tabIcons = {
  Home: { icon: 'home', type: 'feather', iconColor: Colors.white },
  ServiceRequests: { icon: 'pluscircleo', type: 'antdesign', iconColor: Colors.primary },
  Profile: { icon: 'user-circle', type: 'font-awesome-5', iconColor: Colors.white },
};

const { width } = Dimensions.get('window');

const Tab = ({ route, navigation, isFocused }) => {
  const { Layout, Gutters, Common } = useTheme();

  const name = _.get(route, 'name');
  const iconName = _.get(tabIcons, `${name}.icon`);
  const iconType = _.get(tabIcons, `${name}.type`);
  const iconColor = _.get(tabIcons, `${name}.iconColor`);

  const onTabPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <Pressable onPress={onTabPress} disabled={isFocused}>
      {({ pressed }) => (
        <View
          style={[
            Layout.rowCenter,
            Gutters.smallVPadding,
            styles.tabContainer,
            isFocused && styles.tabContainerFocused,
            pressed && Common.pressed,
          ]}
        >
          <Icon name={iconName} type={iconType} color={iconColor} size={name==='ServiceRequests'? 32: 27} />
          {isFocused && <Text style={[Gutters.smallLMargin, styles.tabText]}>{name}</Text>}
        </View>
      )}
    </Pressable>
  );
};

export default Tab;

const styles = StyleSheet.create({
  tabContainer: {
    paddingHorizontal: width <= 320 ? 20 : 30,
    paddingVertical: width <= 320 ? 8 : 10,
  },
  tabContainerFocused: {
    backgroundColor: Colors.primary10Percent,
    borderRadius: 23,
  },
  tabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

Tab.propTypes = {
  route: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
  isFocused: PropTypes.bool.isRequired,
};
