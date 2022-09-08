import React, { useState } from 'react';
import { Animated, Dimensions, Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '../../../../theme/Variables';
import { useTheme } from '../../../../theme';

const { width } = Dimensions.get('window');

type TabScreenContainerHeaderProps = {
  scrollOffset: any;
  title: String;
  StickyHeader?: React.ReactElement | React.ReactElement[];
  stickyHeaderSize?: number;
};

const TabScreenContainerHeader: React.FC<TabScreenContainerHeaderProps> = ({
  scrollOffset,
  title,
  StickyHeader,
  stickyHeaderSize,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { Common, Layout } = useTheme();

  const [titleWidth, setTitleWidth] = useState(0);

  const openDrawer = () => navigation.openDrawer();

  return (
    <View>
      <Animated.View
        style={[
          styles.animatedHeaderWrapper,
          {
            height: (width <= 320 ? 90 : 110) + insets.top + (stickyHeaderSize || 0),
          },
          {
            transform: [
              {
                translateY: scrollOffset.interpolate({
                  inputRange: [0, 200],
                  outputRange: [0, width <= 320 ? -40 : -60],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <View style={Layout.row}>
          <Animated.View
            style={[
              {
                transform: [
                  {
                    translateX: scrollOffset.interpolate({
                      inputRange: [0, 200],
                      outputRange: [15, width / 2 - titleWidth / 2],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.Text
              onLayout={(e) => !titleWidth && setTitleWidth(e.nativeEvent.layout.width)}
              allowFontScaling={false}
              style={[
                styles.animatedHeaderText,
                {
                  transform: [
                    {
                      scale: scrollOffset.interpolate({
                        inputRange: [0, 200],
                        outputRange: [1, 0.6],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}
            >
              {title}
            </Animated.Text>
          </Animated.View>
        </View>
        {StickyHeader}
      </Animated.View>
      <View
        style={[
          styles.drawerButtonWrapper,
          {
            top:
              Platform.OS === 'ios'
                ? insets.top + (width <= 320 ? 20 : 14)
                : insets.top + (width <= 320 ? 26 : 20),
          },
        ]}
      >
        <Pressable onPress={openDrawer} hitSlop={20}>
          {({ pressed }) => (
            <Image
              source={require('../../../../assets/icons/menu-icon.png')}
              style={[styles.drawerButtonIcon, pressed && Common.pressed]}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default TabScreenContainerHeader;

const styles = StyleSheet.create({
  animatedHeaderText: {
    color: Colors.text,
    fontSize: width * 0.082,
    fontWeight: 'bold',
    paddingBottom: 8,
  },
  animatedHeaderWrapper: {
    justifyContent: 'flex-end',
    backgroundColor: Colors.primaryBackground,
    flexDirection: 'column',
    marginBottom: 6,
    width: width,
  },
  drawerButtonIcon: {
    height: width <= 320 ? 14 : 16,
    tintColor: Colors.text,
    width: width <= 320 ? 18 : 20,
  },
  drawerButtonWrapper: {
    left: 20,
    position: 'absolute',
  },
});
