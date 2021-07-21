import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
// eslint-disable-next-line import/no-cycle
import useTheme from '../../../theme/hooks/useTheme';
import { NotificationHeader } from '../../headers';

const HeaderBackGround = (props) => {
  const { backButton } = props;
  const navigation = useNavigation();
  const { Images, Common, Gutters, Layout, Colors } = useTheme();
  return (
    <ImageBackground source={Images.skylineBackground} style={[Common.headerIcon, Layout.column]}>
      <IconButton
        icon={backButton ? 'arrow-left' : 'menu'}
        size={30}
        color={Colors.white}
        onPress={() => (backButton ? navigation.goBack() : navigation.toggleDrawer())}
        style={Gutters.largeTMargin}
      />
      <NotificationHeader style={styles.notificationHeader} />
    </ImageBackground>
  );
};

HeaderBackGround.propTypes = {
  backButton: PropTypes.bool,
};

HeaderBackGround.defaultProps = {
  backButton: false,
};

const styles = StyleSheet.create({
  notificationHeader: { position: 'absolute', right: 0, top: '37%' },
});

export default HeaderBackGround;
