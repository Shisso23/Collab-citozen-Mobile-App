/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

/**
 * Colors
 */
export const Colors = {
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  white: '#ffffff',
  black: '#000',
  text: '#212529',
  primary: '#609C3A',
  secondary: '#0D2B83',
  success: '#95F9E3',
  warning: '#f2a50a',
  error: '#C1666B',
  danger: '#C1666B',
  softBlue: '#3A609C',
  red: '#d01a1a',
  lightGreen: '#a9dfbf',
  lightBlue: '#aed6f1',
  cardBackground: '#FFFFFF',
  lightOrange: '#edbb99',
  lightMediumGray: '#d3d3d3',
  lightgray: '#e0e0e0',
  gray: '#7e7e7e',
  darkgray: '#5d5d5d',
  shadow: '#e3e3e3',
  commentsBubble: '#6e9e52',
};

export const NavigationColors = {
  primary: Colors.primary,
};

/**
 * FontSize
 */
export const FontSize = {
  small: 12,
  regular: 14,
  large: 18,
};

export const FontFamily = {
  primary: 'system font',
  secondary: 'system font',
};

/**
 * Metrics Sizes
 */
const tiny = 5; // 10
const small = tiny * 2; // 10
const regular = tiny * 3; // 15
const large = regular * 2; // 30
export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
};
