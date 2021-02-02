import Geolocation from 'react-native-geolocation-service';

const LATITUDE_DELTA = 0.011;
const LONGITUDE_DELTA = 0.011;

export const getCurrentPosition = () => {
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
};
