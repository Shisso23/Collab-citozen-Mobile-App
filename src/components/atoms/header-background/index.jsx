import React from 'react';
import { ImageBackground } from 'react-native';
import { IconButton } from 'react-native-paper';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-cycle
import useTheme from '../../../theme/hooks/useTheme';

const HeaderBackGround = (props) => {
  const { scene, backButton } = props;
  const { navigation } = scene.descriptor;
  const { Images, Common, Gutters, Layout, Colors } = useTheme();
  return (
    <ImageBackground source={Images.skylineBackground} style={[Common.headerIcon, Layout.column]}>
      <IconButton
        icon={backButton ? 'arrow-left' : 'menu'}
        size={30}
        color={Colors.white}
        onPress={() => (backButton ? navigation.goBack() : navigation.toggleDrawer())}
        style={[Gutters.largeTMargin]}
      />
    </ImageBackground>
  );
};

HeaderBackGround.propTypes = {
  scene: PropTypes.object.isRequired,
  backButton: PropTypes.bool,
};

HeaderBackGround.defaultProps = {
  backButton: false,
};

export default HeaderBackGround;
