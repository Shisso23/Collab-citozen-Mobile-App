import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../theme/Variables';
import Tab from './tab';
import { useTheme } from '../../../theme';

const TAB_BAR_HEIGHT = 65;

const TabBar = (props) => {
  const { Layout } = useTheme();
  const { state, navigation } = props;
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.backgroundWrapper}>
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
    </View>
  );
};

export default TabBar;

TabBar.propTypes = {
  navigation: PropTypes.any.isRequired,
  state: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  backgroundWrapper: {
    backgroundColor: Colors.transparent,
    bottom: 0,
    position: 'absolute',
  },
  tabBarWrapper: {
    backgroundColor: Colors.softBlue,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    width: '100%',
  },
});
