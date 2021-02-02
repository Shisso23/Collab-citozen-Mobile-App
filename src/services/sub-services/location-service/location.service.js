import axios from 'axios';
import appConfig from '../../../config';
import { removeCountryFromAddress } from '../../../helpers/location-helpers';

const googleMapsApi = axios.create({
  timeout: 5000,
  baseURL: 'https://maps.googleapis.com/maps/api',
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
  const { data } = await googleMapsApi.get('/geocode/json', { params });
  const formattedAddress = data.results[0].formatted_address;
  return removeCountryFromAddress(formattedAddress);
};

export default {
  getAddressFromCoordinates,
};
