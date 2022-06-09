import Geolocation from 'react-native-geolocation-service';
import { hasHmsSync } from 'react-native-device-info';
import HMSLocation from '@hmscore/react-native-hms-location';

const LATITUDE_DELTA = 0.011;
const LONGITUDE_DELTA = 0.011;

let locationRequest;
if (hasHmsSync()) {
  HMSLocation.LocationKit.Native.init()
    .then((resp) => resp)
    .catch((err) => console.warn(err.message));
  locationRequest = {
    priority: HMSLocation.FusedLocation.Native.PriorityConstants.PRIORITY_HIGH_ACCURACY,
    interval: 60000,
    numUpdates: 2147483647,
    fastestInterval: 30000.0,
    expirationTime: 3372036854775807.0,
    smallestDisplacement: 0.0,
    maxWaitTime: 0,
    needAddress: false,
    language: 'en',
    countryCode: 'ZA',
  };
}

export const getCurrentPosition = () => {
  if (!hasHmsSync) {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const region = {
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          resolve(region);
        },
        (error) => {
          reject(error);
          // eslint-disable-next-line no-console
          console.warn(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  }

  return new Promise((resolve, reject) => {
    HMSLocation.FusedLocation.Native.requestLocationUpdates(1, locationRequest).then(
      () => {
        HMSLocation.FusedLocation.Events.addFusedLocationEventListener((locationResult) => {
          const { latitude, longitude } = locationResult.lastLocation;
          const region = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          resolve(region);
        });
      },
      (error) => {
        reject(error);
      },
    );
  });
};
