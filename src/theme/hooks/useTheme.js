import * as DefaultVariables from '../Variables';
import Fonts from '../Fonts';
import Gutters from '../Gutters';
import Images from '../Images';
import Layout from '../Layout';
import Common from '../Common';
import Custom from '../Custom';

export default () => {
  const themeVariables = DefaultVariables;

  // Build the default theme
  const baseTheme = {
    Fonts: Fonts(themeVariables),
    Gutters: Gutters(themeVariables),
    Common: Common(themeVariables),
    Images: Images(themeVariables),
    Layout: Layout(themeVariables),
    Custom: Custom(themeVariables),
    ...themeVariables,
  };
  return baseTheme;
};
