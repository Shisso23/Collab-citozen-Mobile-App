import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { Colors } from '../../../theme/Variables';

const { height, width } = Dimensions.get('window');

const TabScreenContainer = ({
  children,
  title,
  scrollOffset: parentScrollOffset,
  StickyHeader,
  stickyHeaderSize,
}) => {
  const isFocused = useIsFocused();
  const { top } = useSafeAreaInsets();

  const [scrollOffset] = useState(new Animated.Value(0));

  const scrollEvent = Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffset } } }], {
    useNativeDriver: true,
  });

  const handleUnhandledTouches = () => {
    Keyboard.dismiss();
    return false;
  };

  const renderChildrenInScrollView = () => {
    if (parentScrollOffset) {
      return (
        <>
          {children}
          {/* <TabScreenContainerHeader
            scrollOffset={parentScrollOffset || scrollOffset}
            title={title}
            StickyHeader={StickyHeader}
            stickyHeaderSize={stickyHeaderSize}
          /> */}
        </>
      );
    }

    return (
      <>
        <Animated.ScrollView onScroll={scrollEvent} style={styles.scrollViewWrapper}>
          <View style={{ height: (width <= 320 ? 80 : 110) + top }} />
          <SafeAreaView>{children}</SafeAreaView>
        </Animated.ScrollView>
        {/* <TabScreenContainerHeader scrollOffset={parentScrollOffset || scrollOffset} title={title} /> */}
      </>
    );
  };

  return (
    <View
      style={styles.tabScreenContainerWrapper}
      onStartShouldSetResponder={handleUnhandledTouches}
    >
      {isFocused && (
        <StatusBar barStyle="dark-content" backgroundColor={Colors.primaryBackground} />
      )}
      {renderChildrenInScrollView()}
    </View>
  );
};

export default TabScreenContainer;

const styles = StyleSheet.create({
  scrollViewWrapper: {
    height,
    position: 'absolute',
    top: 0,
    width,
  },
  tabScreenContainerWrapper: {
    backgroundColor: Colors.primaryBackground,
    flex: 1,
  },
});

TabScreenContainer.propTypes = {
  children: PropTypes.oneOf(PropTypes.element, PropTypes.arrayOf(PropTypes.element)).isRequired,
  title: PropTypes.any.isRequired,
  scrollOffset: PropTypes.any,
  StickyHeader: PropTypes.any,
  stickyHeaderSize: PropTypes.any,
};

TabScreenContainer.defaultProps = {
  scrollOffset: 0,
  StickyHeader: false,
  stickyHeaderSize: 0,
};
