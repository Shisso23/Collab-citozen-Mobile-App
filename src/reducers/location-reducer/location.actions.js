import { Platform } from 'react-native';
import HMSLocation from '@hmscore/react-native-hms-location';
import { hasGmsSync } from 'react-native-device-info';

import flashService from '../../services/sub-services/flash-service/flash.service';
import locationService from '../../services/sub-services/location-service/location.service';
import { setIsLoadingAction, setRegionAction, setSelectedAddressAction } from './location.reducer';
import { getCurrentPosition } from './location.utils';

export const clearLocationAction = () => (dispatch) => {
  dispatch(setRegionAction(null));
  dispatch(setSelectedAddressAction(''));
};

const locationRequest = {
  priority: HMSLocation.FusedLocation.Native.PriorityConstants.PRIORITY_HIGH_ACCURACY,
  interval: 10000,
  numUpdates: 2147483647,
  fastestInterval: 10000,
  expirationTime: 3372036854775807.0,
  smallestDisplacement: 0.0,
  maxWaitTime: 0,
  needAddress: false,
  language: '',
  countryCode: '',
};

export const getCurrentPositionAction = () => async (dispatch) => {
  dispatch(setIsLoadingAction(true));

  try {
    if (Platform.OS === 'ios' || hasGmsSync()) {
      const region = await getCurrentPosition();
      dispatch(setRegionAction(region));
      await dispatch(getAddressFromRegionAction(region));
    } else {
      await HMSLocation.FusedLocation.Native.requestLocationUpdates(1, locationRequest);

      HMSLocation.FusedLocation.Events.addFusedLocationEventListener(async (locationResult) => {
        const { latitude } = locationResult.lastLocation;
        const { longitude } = locationResult.lastLocation;
        const region = { latitude, longitude, longitudeDelta: 0.011, latitudeDelta: 0.011 };
        dispatch(setRegionAction(region));

        // await dispatch(getAddressFromRegionAction(region)); //TODO
      });
    }
  } catch (err) {
    console.log({ err });
    flashService.error(err.message);
  } finally {
    setIsLoadingAction(false);
  }
};

export const setCurrentPositionAction = () => async (dispatch) => {
  dispatch(setIsLoadingAction(true));
  try {
    let region;
    if (Platform.OS === 'ios' || hasGmsSync()) {
      region = await getCurrentPosition();
    } else {
      const pos = await HMSLocation.FusedLocation.Native.requestLocationUpdates(1, locationRequest);
      console.log({ pos });
      const { latitude } = pos;
      const { longitude } = pos;
      region = { latitude, longitude, longitudeDelta: 0.011, latitudeDelta: 0.011 };
    }
    dispatch(setRegionAction(region));
  } catch (err) {
    flashService.error(err.message);
  } finally {
    setIsLoadingAction(false);
  }
};

export const getAddressFromRegionAction = (newRegion) => async (dispatch) => {
  dispatch(setRegionAction(newRegion));
  try {
    const address = await locationService.getAddressFromCoordinates(newRegion);
    dispatch(setSelectedAddressAction(address));
    return address;
  } catch (err) {
    flashService.error(err.message);
    return null;
  }
};
