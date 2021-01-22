/**
 * This file contains all application's style relative to fonts
 */
import { StyleSheet } from 'react-native';

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default ({ FontSize, Colors }) =>
  StyleSheet.create({
    textCenter: {
      textAlign: 'center',
    },
    textJustify: {
      textAlign: 'justify',
    },
    textLarge: {
      color: Colors.text,
      fontSize: FontSize.large,
    },
    textLeft: {
      textAlign: 'left',
    },
    textRegular: {
      color: Colors.text,
      fontSize: FontSize.regular,
    },
    textRight: {
      textAlign: 'right',
    },
    textSmall: {
      color: Colors.text,
      fontSize: FontSize.small,
    },
    titleLarge: {
      color: Colors.text,
      fontSize: FontSize.large * 2,
      fontWeight: 'bold',
    },
    titleRegular: {
      color: Colors.text,
      fontSize: FontSize.regular * 2,
      fontWeight: 'bold',
    },
    titleSmall: {
      color: Colors.text,
      fontSize: FontSize.small * 2,
      fontWeight: 'bold',
    },
  });
