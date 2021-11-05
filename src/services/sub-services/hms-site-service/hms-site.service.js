import RNHMSSite from '@hmscore/react-native-hms-site';
import ax from 'axios';
import { flashService } from '../..';
import appConfig from '../../../config';

const hmsSiteService = ax.create({
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json',
  },
  responseType: 'json',
});

const apiKey = encodeURIComponent(appConfig.huaweiApiKey);

const queryAutoComplete = async ({ query, coords, northEastBounds, southwestBounds }) => {
  const defaultLocation = {
    query,
    location: coords,
    bounds: {
      northeast: northEastBounds,
      southwest: southwestBounds,
    },
    poiTypes: [RNHMSSite.LocationType.GEOCODE, RNHMSSite.LocationType.ADDRESS],
    radius: 1000,
  };

  return hmsSiteService
    .post(`${appConfig.hmsSiteApiUrl}/queryAutoComplete?key=${apiKey}`, {
      ...defaultLocation,
      query,
    })
    .then((results) => {
      return results;
    })
    .catch((error) => flashService.error(`Error ${error.message}`));
};

export default {
  queryAutoComplete,
};
