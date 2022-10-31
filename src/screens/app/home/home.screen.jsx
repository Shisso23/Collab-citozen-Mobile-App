import React, { useEffect, useRef } from 'react';
import { ImageBackground, Text, ScrollView, Dimensions } from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import { useDispatch } from 'react-redux';

import useTheme from '../../../theme/hooks/useTheme';
import { handleNotificationOpenedBackGround } from '../../../hooks/notification-background/notification-background';
import FeatureTilesContainer from '../../../components/molecules/feature-tiles';
import {
  getCurrentPositionAction,
  getAddressFromRegionAction,
} from '../../../reducers/location-reducer/location.actions';

const HomeScreen = () => {
  const { Gutters, Layout, Images, Colors } = useTheme();
  const screenHeight = Dimensions.get('window').height;
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const isSmallHeightDevice = screenHeight <= 700;
  const navigation = useNavigation();
  const notificationOpenedBackGround = handleNotificationOpenedBackGround();

  useFocusEffect(
    React.useCallback(() => {
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
  const handleGuideZoneChange = (zone) => {
    if (isSmallHeightDevice && zone === 5) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };
  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={[
        Gutters.largeBPadding,
        ...[
          {
            paddingBottom: screenHeight - screenHeight * 0.8,
            flexGrow: 1,
          },
        ],
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
          handleZoneChange={handleGuideZoneChange}
        />
      </ImageBackground>
    </ScrollView>
  );
};
HomeScreen.propTypes = {};
HomeScreen.defaultProps = {};
export default HomeScreen;
