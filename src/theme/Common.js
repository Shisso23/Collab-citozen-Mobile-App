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
    textInput: {
      backgroundColor: Colors.transparent,
    },
    textInputWithShadow: {
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      elevation: 2,
      shadowColor: Colors.black,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });
