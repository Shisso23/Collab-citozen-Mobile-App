import React, { useMemo } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import _ from 'lodash';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../theme/Variables';
import Tab from './tab';
import { useTheme } from '../../../theme';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 65;

const TabBar = ({ state, navigation }) => {
  const { Layout } = useTheme();
  const insets = useSafeAreaInsets();

  const shadowOptions = useMemo(
    () => ({
      width,
      height: TAB_BAR_HEIGHT + insets.bottom,
      color: Colors.shadow,
      border: 40,
      radius: 20,
      opacity: 0.1,
      x: 0,
      y: 0,
    }),
    [insets],
  );

  return (
    <View style={styles.backgroundWrapper}>
      <BoxShadow setting={shadowOptions}>
        <View
          style={[
            styles.tabBarWrapper,
            Layout.rowCenter,
            Layout.justifyContentAround,
            { height: TAB_BAR_HEIGHT + insets.bottom, paddingBottom: insets.bottom },
          ]}
        >
          {_.map(state.routes, (route, index) => (
            <Tab
              key={index}
              route={route}
              navigation={navigation}
              isFocused={state.index === index}
            />
          ))}
        </View>
      </BoxShadow>
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  backgroundWrapper: {
    backgroundColor: Colors.transparent,
    bottom: 0,
    position: 'absolute',
  },
  tabBarWrapper: {
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    width: '100%',
  },
});
