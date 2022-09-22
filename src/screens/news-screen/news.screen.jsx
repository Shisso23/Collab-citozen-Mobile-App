import React, { useEffect } from 'react';
import { ImageBackground, Text } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';

import { useDispatch } from 'react-redux';
import NewsArticlesList from '../../components/molecules/news-articles/news-articles-list.component';
import useTheme from '../../theme/hooks/useTheme';
import { exitAppOnHardwarePressListener } from '../../helpers';
import { handleNotificationOpenedBackGround } from '../../hooks/notification-background/notification-background';
import { setTabBarVisibilityAction } from '../../reducers/navigation-reducer/navigation.actions';

const NewsScreen = () => {
  const { Gutters, Fonts, Layout, Images } = useTheme();
  const dispatch = useDispatch();
  const notificationOpenedBackGround = handleNotificationOpenedBackGround();

  useFocusEffect(exitAppOnHardwarePressListener);
  useFocusEffect(
    React.useCallback(() => {
      dispatch(setTabBarVisibilityAction(true));
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
NewsScreen.propTypes = {};
NewsScreen.defaultProps = {};
export default NewsScreen;
