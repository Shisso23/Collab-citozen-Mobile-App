import React, { useEffect, useState } from 'react';
import { ImageBackground, Text } from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { exitAppOnHardwarePressListener } from '../../../helpers';
import { handleNotificationOpenedBackGround } from '../../../hooks/notification-background/notification-background';
import FeatureTilesContainer from '../../../components/molecules/feature-tiles';
import { myChannelsSelector } from '../../../reducers/my-channels/my-channels.reducer';
import { getMyChannelsAction } from '../../../reducers/my-channels/my-channels.actions';
import {
  getCurrentPositionAction,
  getAddressFromRegionAction,
} from '../../../reducers/location-reducer/location.actions';

const HomeScreen = () => {
  const { Gutters, Layout, Images, Colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { myChannels } = useSelector(myChannelsSelector);
  const [accountApplicableChannels, setAccountApplicableChannels] = useState([]);
  const notificationOpenedBackGround = handleNotificationOpenedBackGround();

  const _loadMyChannels = () => {
    dispatch(getMyChannelsAction()).then(() => {
      setAccountApplicableChannels(
        myChannels.filter((channel) => _.get(channel, 'accountApplicable', null) === true),
      );
    });
  };

  useFocusEffect(exitAppOnHardwarePressListener);
  useFocusEffect(
    React.useCallback(() => {
      PushNotification.setApplicationIconBadgeNumber(0);
      _loadMyChannels();
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
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill, Gutters.regularTPadding]}
        resizeMode="cover"
      >
        <Text style={[Gutters.regularMargin, ...[{ textAlign: 'center', color: Colors.black }]]}>
          Welcome to ColabCitizen, designed to facilitate a quicker, more responsive service
          delivery, content sharing and broadcasting platform.
        </Text>
        <FeatureTilesContainer
          onAccountsTilePress={navigateToAccounts}
          onChannelTilePress={navigateToChannels}
          onContactsTilePress={navigateToContacts}
          onNewsTilePress={navigateTonews}
          onServiceRequestTilePress={navigateToServiceRequests}
          accountsTileVisible={accountApplicableChannels.length > 0}
        />
      </ImageBackground>
    </>
  );
};
HomeScreen.propTypes = {};
HomeScreen.defaultProps = {};
export default HomeScreen;
