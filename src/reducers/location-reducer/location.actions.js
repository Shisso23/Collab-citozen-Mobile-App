// import { Platform } from 'react-native';
// import HMSLocation from '@hmscore/react-native-hms-location';
// import { hasGmsSync, hasHmsSync } from 'react-native-device-info';

import flashService from '../../services/sub-services/flash-service/flash.service';
import locationService from '../../services/sub-services/location-service/location.service';
import { setIsLoadingAction, setRegionAction, setSelectedAddressAction } from './location.reducer';
import { getCurrentPosition } from './location.utils';

export const clearLocationAction = () => (dispatch) => {
  dispatch(setRegionAction(null));
  dispatch(setSelectedAddressAction(''));
};
// let locationRequest;
// if (hasHmsSync()) {
//   locationRequest = {
//     priority: HMSLocation.FusedLocation.Native.PriorityConstants.PRIORITY_HIGH_ACCURACY,
//     interval: 60000,
//     numUpdates: 2147483647,
//     fastestInterval: 30000.0,
//     expirationTime: 3372036854775807.0,
//     smallestDisplacement: 0.0,
//     maxWaitTime: 0,
//     needAddress: false,
//     language: 'en',
//     countryCode: 'ZA',
//   };
// }

export const getCurrentPositionAction = async () => async (dispatch) => {
  dispatch(setIsLoadingAction(true));

  try {
    const region = await getCurrentPosition();
    dispatch(setRegionAction(region));
    await dispatch(getAddressFromRegionAction(region));
  } catch (err) {
    flashService.error(err.message);
  } finally {
    setIsLoadingAction(false);
  }
};

// export const setCurrentPositionAction = () => async (dispatch) => {
//   dispatch(setIsLoadingAction(true));
//   try {
//     let region;
//     if (Platform.OS === 'ios' || hasGmsSync()) {
//       region = await getCurrentPosition();
//     }
//     dispatch(setRegionAction(region));
//   } catch (err) {
//     flashService.error(err.message);
//   } finally {
//     setIsLoadingAction(false);
//   }
// };

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
