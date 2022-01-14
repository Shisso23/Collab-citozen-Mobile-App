import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
// eslint-disable-next-line import/no-cycle
import useTheme from '../../../theme/hooks/useTheme';
import { NotificationHeader } from '../../headers';

const HeaderBackGround = (props) => {
  const { backButton, onBack } = props;

  const navigation = useNavigation();
  const { Images, Common, Gutters, Layout, Colors } = useTheme();
  const handleOnPress = () => {
    if (onBack && backButton) {
      return onBack();
    }
    if (backButton) {
      return navigation.goBack();
    }

    return navigation.toggleDrawer();
  };
  return (
    <ImageBackground
      source={Images.skylineBackground}
      resizeMode="cover"
      style={[Common.headerIcon, Layout.column]}
    >
      <IconButton
        icon={backButton ? 'arrow-left' : 'menu'}
        size={30}
        color={Colors.white}
        onPress={handleOnPress}
        style={Gutters.largeTMargin}
      />
      <NotificationHeader style={styles.notificationHeader} />
    </ImageBackground>
  );
};

HeaderBackGround.propTypes = {
  backButton: PropTypes.bool,
  onBack: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

HeaderBackGround.defaultProps = {
  backButton: false,
  onBack: false,
};

const styles = StyleSheet.create({
  notificationHeader: { position: 'absolute', right: 0, top: '37%' },
});

export default HeaderBackGround;
