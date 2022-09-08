import React, { useEffect } from 'react';
import { ImageBackground, Text } from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';

import NewsArticlesList from '../../../components/molecules/news-articles/news-articles-list.component';
import useTheme from '../../../theme/hooks/useTheme';
import { exitAppOnHardwarePressListener } from '../../../helpers';
import { handleNotificationOpenedBackGround } from '../../../hooks/notification-background/notification-background';
import FeatureTilesContainer from '../../../components/molecules/feature-tiles';

const HomeScreen = () => {
  const { Gutters, Fonts, Layout, Images, Colors } = useTheme();
  const navigation = useNavigation();
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
  const navigateToAccounts = () => {
    navigation.navigate('Accounts');
  };

  const navigateTonews = () => {
    navigation.navigate('News');
  };

  const navigateToChannels = () => {
    navigation.navigate('ViewSubscribeToChannels');
  };

  const navigateToContacts = () => {
    navigation.navigate('ContactDetails');
  };

  const navigateToServiceRequests = () => {
    navigation.navigate('ServiceRequests');
  };
  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill, Gutters.regularTPadding]}
        resizeMode="cover"
      >
        <Text style={[Gutters.regularMargin, { textAlign: 'center', color: Colors.black }]}>
          Welcome to ColabCitizen, designed to facilitate a quicker, more responsive service
          delivery, content sharing and broadcasting platform.
        </Text>
        <FeatureTilesContainer
          onAccountsTilePress={navigateToAccounts}
          onChannelTilePress={navigateToChannels}
          onContactsTilePress={navigateToContacts}
          onNewsTilePress={navigateTonews}
          onServiceRequestTilePress={navigateToServiceRequests}
        />
        {/* <NewsArticlesList /> */}
      </ImageBackground>
    </>
  );
};
HomeScreen.propTypes = {};
HomeScreen.defaultProps = {};
export default HomeScreen;
