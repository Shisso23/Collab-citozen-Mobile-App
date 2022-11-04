import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';
import { TourGuideZone, useTourGuideController } from 'rn-tourguide';

import AsyncStorage from '@react-native-async-storage/async-storage';
import useTheme from '../../../theme/hooks/useTheme';
import { myChannelsSelector } from '../../../reducers/my-channels/my-channels.reducer';
import { getMyChannelsAction } from '../../../reducers/my-channels/my-channels.actions';
import FeatureTile from '../../atoms/feature-tile';
import { tourGuideData } from '../../../helpers/tour-guide.data';
import config from '../../../config';

const FeatureTilesContainer = ({
  onChannelTilePress,
  onServiceRequestTilePress,
  onNewsTilePress,
  onContactsTilePress,
  onAccountsTilePress,
  handleZoneChange,
}) => {
  const screenHeight = Dimensions.get('window').height;
  const { Gutters, Layout, Images } = useTheme();
  const dispatch = useDispatch();
  const [accountApplicableChannels, setAccountApplicableChannels] = useState([]);
  const { myChannels } = useSelector(myChannelsSelector);
  const isSmallHeightDevice = screenHeight <= 700;

  const { canStart, start, eventEmitter } = useTourGuideController('channel');

  const accountGuide = useTourGuideController('account');

  useFocusEffect(
    React.useCallback(() => {
      _loadMyChannels();
    }, []),
  );

  useEffect(() => {
    setAccountApplicableChannels(
      myChannels.filter((channel) => _.get(channel, 'accountApplicable', null) === true),
    );
  }, [JSON.stringify(myChannels)]);

  useEffect(() => {
    if (accountGuide.canStart) {
      accountGuide.eventEmitter.on('stepChange', handleOnStepChange);
      accountGuide.eventEmitter.on('stepChange', handleOnStop);
      AsyncStorage.getItem(config.accountTourEnabled).then((response) => {
        if (response === 'true') {
          accountGuide.start();
        }
      });
      return () => {
        accountGuide.eventEmitter.off('stepChange', handleOnStepChange);
      };
    }
    return () => null;
  }, [accountGuide.canStart]);

  useEffect(() => {
    if (canStart) {
      eventEmitter.on('stepChange', handleOnStepChange);
      eventEmitter.on('stepChange', handleOnStop);
      AsyncStorage.getItem(config.isFirstTimeUserKey).then((response) => {
        if (response === 'true') {
          start();
        }
      });
      return () => {
        eventEmitter.off('stepChange', handleOnStepChange);
      };
    }
    return () => null;
  }, [canStart]);

  const handleOnStop = async () => {
    await AsyncStorage.setItem(config.isFirstTimeUserKey, `${false}`);
    await AsyncStorage.setItem(config.accountTourEnabled, `${false}`);
  };

  const handleOnStepChange = (data) => {
    if (data) {
      handleZoneChange(data.order);
    }
  };

  const _loadMyChannels = () => {
    dispatch(getMyChannelsAction()).then((response) => {
      setAccountApplicableChannels(
        response.filter((channel) => _.get(channel, 'accountApplicable', null) === true),
      );
    });
  };

  const renderfeatureTiles = () => {
    return (
      <View
        style={[
          styles.tilesContainer,
          Layout.row,
          Layout.alignItemsCenter,
          Layout.justifyContentCenter,
        ]}
      >
        <TourGuideZone tourKey="channel" zone={0} text="Take a tour?" borderRadius={16}>
          <></>
        </TourGuideZone>
        <TourGuideZone
          tourKey="channel"
          zone={1}
          text={`${tourGuideData.channel}🎉`}
          borderRadius={16}
          tooltipBottomOffset={screenHeight}
          shape="circle"
        >
          <FeatureTile
            description="Channels"
            backgroundImage={Images.channels}
            onPress={onChannelTilePress}
          />
        </TourGuideZone>
        <TourGuideZone
          zone={2}
          tourKey="channel"
          text={`${tourGuideData.serviceRequest}🎉`}
          borderRadius={16}
          tooltipBottomOffset={screenHeight - screenHeight * 0.7}
          shape="circle"
        >
          <FeatureTile
            description={'Service\nRequests'}
            backgroundImage={Images.serviceRequestImage}
            onPress={onServiceRequestTilePress}
          />
        </TourGuideZone>
        <TourGuideZone
          tourKey="channel"
          zone={3}
          text={`${tourGuideData.news}🎉`}
          borderRadius={16}
          tooltipBottomOffset={screenHeight - screenHeight * 1.2}
          shape="circle"
        >
          <FeatureTile
            description="News"
            backgroundImage={Images.newsImage}
            onPress={onNewsTilePress}
          />
        </TourGuideZone>
        <TourGuideZone
          tourKey="channel"
          zone={4}
          text={`${tourGuideData.contacts}🎉`}
          borderRadius={16}
          tooltipBottomOffset={screenHeight - screenHeight * 1.2}
          shape="circle"
        >
          <FeatureTile
            description="Contacts"
            backgroundImage={Images.contactsImage}
            onPress={onContactsTilePress}
            shape="circle"
          />
        </TourGuideZone>

        {isSmallHeightDevice && (
          <TourGuideZone tourKey="channel" zone={5} text="Continue?" borderRadius={16}>
            <></>
          </TourGuideZone>
        )}

        {accountApplicableChannels.length > 0 && (
          <TourGuideZone
            tourKey="account"
            zone={0}
            text={`${tourGuideData.accounts}🎉`}
            borderRadius={16}
            tooltipBottomOffset={screenHeight - screenHeight * 0.85}
            shape="circle"
          >
            <FeatureTile
              description="Accounts"
              backgroundImage={Images.accountsImage}
              onPress={onAccountsTilePress}
            />
          </TourGuideZone>
        )}
      </View>
    );
  };

  return (
    <View style={Gutters.smallTMargin}>
      <View style={[styles.categoriesView, Layout.rowBetween, Layout.alignItemsStart]}>
        {renderfeatureTiles()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tilesContainer: {
    flexWrap: 'wrap',
  },
});

FeatureTilesContainer.propTypes = {
  onChannelTilePress: PropTypes.func.isRequired,
  onServiceRequestTilePress: PropTypes.func.isRequired,
  onNewsTilePress: PropTypes.func.isRequired,
  onContactsTilePress: PropTypes.func.isRequired,
  onAccountsTilePress: PropTypes.func.isRequired,
  handleZoneChange: PropTypes.func.isRequired,
};

export default FeatureTilesContainer;
