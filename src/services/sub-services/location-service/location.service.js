import axios from 'axios';
import { Platform } from 'react-native';
import { hasGmsSync, hasHmsSync } from 'react-native-device-info';
import appConfig from '../../../config';
import { removeCountryFromAddress } from '../../../helpers/location-helpers';

const googleMapsApi = axios.create({
  timeout: 5000,
  baseURL: 'https://maps.googleapis.com/maps/api',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  responseType: 'json',
});

const huaweiMapsApi = axios.create({
  timeout: 5000,
  baseURL: `https://siteapi.cloud.huawei.com/mapApi/v1/siteService`,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  responseType: 'json',
});

googleMapsApi.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params.key = appConfig.googleMapsApiKey;
  return config;
});

const getAddressFromCoordinates = async (region) => {
  const address = `${region.latitude},${region.longitude}`;
  const params = { address };
  let formattedAddress = '';
  if (hasGmsSync() || Platform.OS === 'ios') {
    const { data } = await googleMapsApi.get('/geocode/json', { params });
    formattedAddress = data.results[0].formatted_address;
  } else if (hasHmsSync()) {
    const parameters = {
      location: {
        lng: region.longitude,
        lat: region.latitude,
      },
      language: 'en',
      radius: 10,
    };
    try {
      const { data } = await huaweiMapsApi.post(
        `/reverseGeocode?key=${encodeURIComponent(`${appConfig.huaweiApiKey}`)}`,
        parameters,
      );
      formattedAddress = data.sites[0].formatAddress;
    } catch (error) {
      formattedAddress = '';
    }
  }
  return removeCountryFromAddress(formattedAddress);
};

export default {
  getAddressFromCoordinates,
};
