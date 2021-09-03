import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';

import { getCurrentPositionAction } from '../../../../reducers/location-reducer/location.actions';
import { getMunicipalitiesAction } from '../../../../reducers/municipalities-reducer/municipalities.actions';
import { getUnsubscribedChannelsByLocationAction } from '../../../../reducers/unsubscribed-channels/unsubscribed-channels.actions';
import { flashService } from '../../../../services';
import SelectLocation from '../../../../components/molecules/select-location';

const SelectLocationScreen = () => {
  const { params } = useRoute();
  const fromSubscribedChannels = params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [regionChange, setRegionChange] = useState({
    latitude: 30.5595,
    longitude: 22.9375,
    latitudeDelta: 0.011,
    longitudeDelta: 0.011,
  });

  const _handleBackPress = () => {
    if (fromSubscribedChannels) {
      navigation.navigate('ViewSubscribeToChannels');
      dispatch(getCurrentPositionAction());
    } else {
      navigation.navigate('ServiceRequests');
      dispatch(getCurrentPositionAction());
    }
  };

  const _handlePickLocation = () => {
    if (fromSubscribedChannels) {
      dispatch(
        getUnsubscribedChannelsByLocationAction(regionChange.longitude, regionChange.latitude),
      );
      return navigation.navigate('SubscribeToChannels');
    }
    return dispatch(getMunicipalitiesAction(regionChange.longitude, regionChange.latitude)).then(
      (channels) => {
        if (channels.length === 0 || Object.keys(channels).length === 0) {
          return flashService.info('There are no channels at this location!');
        }
        return navigation.navigate('CreateServiceRequest');
      },
    );
  };

  return (
    <SelectLocation
      _handleBackPress={_handleBackPress}
      _handlePickLocation={_handlePickLocation}
      onRegionChange={setRegionChange}
    />
  );
};

export default SelectLocationScreen;
