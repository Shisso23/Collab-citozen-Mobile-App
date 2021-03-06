import { CardStyleInterpolators } from '@react-navigation/stack';
import React from 'react';
// eslint-disable-next-line import/no-cycle
import HeaderBackGround from '../components/atoms/header-background';

export default ({ Colors, FontFamily }) => {
  return {
    globalNavigatorScreenOptions: {
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      // eslint-disable-next-line react/jsx-filename-extension
      header: (props) => <HeaderBackGround {...props} />,
      headerShown: true,
      headerBackTitleVisible: false,
      headerTransitionPreset: 'fade-in-place',
      transitionConfig: () => {
        return {
          transitionSpec: {
            duration: 50,
          },
        };
      },
      headerStyle: {
        backgroundColor: Colors.secondary,
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
        },
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTitleStyle: {
        fontFamily: FontFamily.secondary,
        color: Colors.white,
      },
      headerTintColor: Colors.white,
      cardStyle: {
        backgroundColor: Colors.white,
      },
    },
  };
};
