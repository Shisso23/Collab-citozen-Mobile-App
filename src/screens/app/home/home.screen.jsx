import React, { useEffect } from 'react';
import { ImageBackground, Text, ScrollView, Dimensions } from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import { useDispatch } from 'react-redux';

import useTheme from '../../../theme/hooks/useTheme';
import { handleNotificationOpenedBackGround } from '../../../hooks/notification-background/notification-background';
import FeatureTilesContainer from '../../../components/molecules/feature-tiles';
import { setTabBarVisibilityAction } from '../../../reducers/navigation-reducer/navigation.actions';
import {
  getCurrentPositionAction,
  getAddressFromRegionAction,
} from '../../../reducers/location-reducer/location.actions';

const HomeScreen = () => {
  const { Gutters, Layout, Images, Colors } = useTheme();
  const screenHeight = Dimensions.get('window').height;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const notificationOpenedBackGround = handleNotificationOpenedBackGround();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setTabBarVisibilityAction(true));
      PushNotification.setApplicationIconBadgeNumber(0);
    }, []),
  );

  useEffect(() => {
    notificationOpenedBackGround();
    dispatch(getCurrentPositionAction()).then(async (position) => {
      dispatch(getAddressFromRegionAction(position));
    });
  }, []);

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
    <ScrollView
      contentContainerStyle={[
        Gutters.largeBPadding,
        {
          height: screenHeight + screenHeight * 0.03,
        },
      ]}
    >
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill, Gutters.regularTPadding]}
        resizeMode="cover"
      >
        <Text style={[Gutters.regularMargin, ...[{ textAlign: 'center', color: Colors.black }]]}>
          Welcome to Collab Citizen, designed to facilitate a quicker, more responsive service
          delivery, content sharing and broadcasting platform.
        </Text>
        <FeatureTilesContainer
          onAccountsTilePress={navigateToAccounts}
          onChannelTilePress={navigateToChannels}
          onContactsTilePress={navigateToContacts}
          onNewsTilePress={navigateTonews}
          onServiceRequestTilePress={navigateToServiceRequests}
        />
      </ImageBackground>
    </ScrollView>
  );
};
HomeScreen.propTypes = {};
HomeScreen.defaultProps = {};
export default HomeScreen;
