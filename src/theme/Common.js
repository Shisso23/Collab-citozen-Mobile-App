import { StyleSheet } from 'react-native';
import { DefaultTheme } from '@react-navigation/native';
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
    blackText: {
      color: Colors.black,
    },
    defaultBackGround: {
      backgroundColor: DefaultTheme.colors.background,
    },
    drawerUserText: {
      color: Colors.white,
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
    headerIcon: {
      height: 100,
      width: '100%',
    },
    headerLogo: {
      width: 200,
    },
    headerView: {
      borderColor: DefaultTheme.colors.background,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderWidth: 10,
      bottom: 0,
      position: 'absolute',
      width: '100%',
    },
    link: {
      color: Colors.white,
      fontWeight: 'bold',
    },
    loginErrorStyle: {
      color: Colors.white,
      fontFamily: FontFamily.primary,
      fontSize: FontSize.small,
    },
    loginLogo: {
      color: Colors.white,
      fontSize: 25,
    },
    loginTextInput: {
      backgroundColor: Colors.white,
      borderRadius: 10,
      height: 50,
      opacity: 0.8,
    },
    textInput: {
      backgroundColor: Colors.transparent,
    },
    whiteText: {
      color: Colors.white,
    },
    textInputWithShadow: {
      backgroundColor: DefaultTheme.colors.background,
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
