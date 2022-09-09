/* eslint-disable global-require */
/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default () => ({
  collaboratorLogo: require('../assets/images/Logo.png'),
  skylineBackground: require('../assets/images/skyline.png'),
  skylineBackground1: require('../assets/images/skyline1.png'),
  skylineBackground2: require('../assets/images/skyline2.png'),
  loginBackground: require('../assets/images/loginBackGround.png'),
  collaboratorLogoText: require('../assets/images/collboratorText.png'),
  serviceRequest: require('../assets/images/serviceRequest.png'),
  serverDown: require('../assets/images/serverDown.png'),
  avatarImage: require('../../ios/collaboratorapp/Images.xcassets/AppIcon.appiconset/1024.png'),
  avatarSelected: require('../assets/images/avatarSelected.png'),
  channels: require('../assets/images/channelsImage.png'),
  serviceRequestImage: require('../assets/images/serviceRequestImage.png'),
  contactsImage: require('../assets/images/contactsImage.png'),
  newsImage: require('../assets/images/newsImage.png'),
  accountsImage: require('../assets/images/accountsImage.png'),
});
