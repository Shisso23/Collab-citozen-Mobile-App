import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../theme/Variables';
import Tab from './tab';
import { useTheme } from '../../../theme';

const TAB_BAR_HEIGHT = 65;
const screenWidth = Dimensions.get('screen').width;

const TabBar = (props) => {
  const { Layout, Gutters } = useTheme();
  const { state, navigation } = props;
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.backgroundWrapper}>
      <View
        style={[
          styles.tabBarWrapper,
          Layout.rowCenter,
          Layout.justifyContentBetween,
          Gutters.largeHPadding,
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
    width: screenWidth,
  },
});
