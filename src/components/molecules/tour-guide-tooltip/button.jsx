/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';

import styles from './styles';

export const Button = ({ wrapperStyle, style, children, ...rest }) => (
  <View style={[styles.button, wrapperStyle]}>
    <Text style={[styles.buttonText, style]} testID="TourGuideButtonText" {...rest}>
      {children}
    </Text>
  </View>
);
