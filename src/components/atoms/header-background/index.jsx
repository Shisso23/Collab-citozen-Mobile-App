import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';
// eslint-disable-next-line import/no-cycle
import useTheme from '../../../theme/hooks/useTheme';
import { NotificationHeader } from '../../headers';

const HeaderBackGround = (props) => {
  const { backButton, onBack } = props;

  const navigation = useNavigation();
  const { Images, Common, Gutters, Layout, Colors } = useTheme();
  const bannerImages = [
    Images.skylineBackground,
    Images.skylineBackground1,
    Images.skylineBackground2,
  ];
  const [currentImage, setCurrentImage] = useState(bannerImages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const shuffledImages = _.shuffle(bannerImages);
      setCurrentImage(shuffledImages[0]);
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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
      source={currentImage}
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
