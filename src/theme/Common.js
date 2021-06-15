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
    buttonContainer: {
      bottom: 0,
      position: 'absolute',
    },
    buttonPickLocation: {
      height: 70,
      justifyContent: 'center',
    },
    defaultBackGround: {
      backgroundColor: DefaultTheme.colors.background,
    },
    drawerStyle: {
      borderBottomRightRadius: 20,
      borderTopRightRadius: 20,
    },
    drawerUserText: {
      color: Colors.white,
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
    googleAutoCompleteInput: {
      backgroundColor: DefaultTheme.colors.background,
      color: Colors.darkgray,
      fontSize: 16,
      height: 38,
      position: 'absolute',
      width: '100%',
    },
    headerIcon: {
      height: 100,
      width: '100%',
    },
    headerLogo: {
      width: 200,
    },
    headerSelectLocation: {
      height: 120,
      width: '100%',
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
    inputContainer: {
      borderBottomWidth: 0,
    },
    link: {
      color: Colors.white,
      fontWeight: 'bold',
    },
    linkBlack: {
      color: Colors.black,
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
    pickLocation: {
      fontFamily: FontFamily.primary,
      fontSize: FontSize.large,
    },
    pinContainer: {
      left: '47%',
      position: 'absolute',
      top: '48%',
    },
    registerErrorStyle: {
      color: Colors.white,
      fontFamily: FontFamily.primary,
      fontSize: FontSize.small,
    },
    registerTextInputWithShadow: {
      backgroundColor: DefaultTheme.colors.background,
    },
    statusIndicator: {
      borderRadius: 5,
      height: 7,
      width: 7,
    },
    textInput: {
      backgroundColor: Colors.transparent,
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
    whiteText: {
      color: Colors.white,
    },
  });
