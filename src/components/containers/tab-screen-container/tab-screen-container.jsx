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

// import TabScreenContainerHeader from './components/tab-screen-container-header';
import { Colors } from '../../../theme/Variables';

const { height, width } = Dimensions.get('window');

const TabScreenContainer = ({ children, scrollOffset: parentScrollOffset }) => {
  const screenHeight = Dimensions.get('window').height;
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
      return <>{children}</>;
    }

    return (
      <>
        <Animated.ScrollView onScroll={scrollEvent} style={styles.scrollViewWrapper}>
          <View style={{ height: screenHeight + screenHeight * 0.05 }} />
          <SafeAreaView>{children}</SafeAreaView>
        </Animated.ScrollView>
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
