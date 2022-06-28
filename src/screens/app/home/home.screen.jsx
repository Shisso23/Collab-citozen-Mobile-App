import React, { useEffect } from 'react';
import { ImageBackground, Text } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';

import NewsArticlesList from '../../../components/molecules/news-articles/news-articles-list.component';
import useTheme from '../../../theme/hooks/useTheme';
import { exitAppOnHardwarePressListener } from '../../../helpers';
import { handleNotificationOpenedBackGround } from '../../../hooks/notification-background/notification-background';

const HomeScreen = () => {
  const { Gutters, Fonts, Layout, Images } = useTheme();
  const notificationOpenedBackGround = handleNotificationOpenedBackGround();

  useFocusEffect(exitAppOnHardwarePressListener);
  useFocusEffect(
    React.useCallback(() => {
      PushNotification.setApplicationIconBadgeNumber(0);
    }, []),
  );
  useEffect(() => {
    notificationOpenedBackGround();
  });
  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill]}
        resizeMode="cover"
      >
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>News</Text>
        <NewsArticlesList />
      </ImageBackground>
    </>
  );
};
HomeScreen.propTypes = {};
HomeScreen.defaultProps = {};
export default HomeScreen;
