import { StyleSheet } from 'react-native';

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */

export default ({ Colors, FontFamily, MetricsSizes, FontSize }) =>
  StyleSheet.create({
    backgroundPrimary: {
      backgroundColor: Colors.primary,
    },
    backgroundReset: {
      backgroundColor: Colors.transparent,
    },
    backgroundWhite: {
      backgroundColor: Colors.white,
    },
    drawerStyle: {
      borderBottomRightRadius: 20,
      borderTopRightRadius: 20,
    },
    errorStyle: {
      color: Colors.danger,
      fontFamily: FontFamily.primary,
      fontSize: FontSize.small,
    },
    fabAlignment: {
      bottom: 0,
      margin: MetricsSizes.large,
      position: 'absolute',
      right: 0,
    },
    headerLogo: {
      width: 200,
    },
    link: {
      color: Colors.secondary,
      fontWeight: 'bold',
    },
    loginErrorStyle: {
      color: Colors.white,
      fontFamily: FontFamily.primary,
      fontSize: FontSize.small,
    },
    loginLogo: {
      color: Colors.white,
    },
    loginTextInput: {
      backgroundColor: Colors.white,
      borderRadius: 10,
      height: 50,
    },
    textInput: {
      backgroundColor: Colors.transparent,
    },
  });
