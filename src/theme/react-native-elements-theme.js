import { Colors, FontFamily, FontSize } from './Variables';
import Common from './Common';

const theme = {
  colors: {
    primary: Colors.primary,
  },
  Text: {
    style: {
      fontFamily: FontFamily.primary,
      fontSize: FontSize.regular,
    },
    h1style: {
      fontFamily: FontFamily.secondary,
      fontSize: 30,
    },
    h2style: {
      fontFamily: FontFamily.secondary,
      fontSize: 26,
    },
    h3style: {
      fontFamily: FontFamily.secondary,
      fontSize: 22,
    },
    h4style: {
      fontFamily: FontFamily.secondary,
      fontSize: 18,
    },
  },
  Button: {
    raised: true,
    color: Colors.primary,
    titleStyle: {
      fontFamily: FontFamily.secondary,
    },
    buttonStyle: {
      height: 45,
    },
  },
  Input: {
    errorStyle: Common.errorStyle,
    containerStyle: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  SearchBar: {
    containerStyle: {
      backgroundColor: Colors.warning,
      paddingLeft: 0,
      paddingRight: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#000',
    },
  },
};

export default theme;
