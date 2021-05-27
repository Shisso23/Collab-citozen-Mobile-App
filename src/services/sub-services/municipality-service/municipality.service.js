import _ from 'lodash';
import { constructMunicipalityModels } from '../../../models';
import {
  apiFunctionWithUniqName,
  apiFunctionWithUniqNameChannels,
} from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';
import globalUrl from '../global/global.service.urls';

const getMunicipalities = async () => {
  const url = globalUrl.globalFunctionUrl();
  const data = await apiFunctionWithUniqName('get_municipalities');
  const apiResponse = await authNetworkService.post(url, data);
  const municipalities = _.get(apiResponse.data, 'municipalities', []);
  return constructMunicipalityModels(municipalities);
};

const getChannlesByLocation = async (longitude, latitude) => {
  const url = globalUrl.globalFunctionUrl();
  const data = await apiFunctionWithUniqNameChannels(
    'get_channels_by_location',
    longitude,
    latitude,
  );
  const apiResponse = await authNetworkService.post(url, data);
  const channels = _.get(apiResponse.data, 'Channels', []);
  const channlesConstruct = constructMunicipalityModels(channels);
  return channlesConstruct;
};

export default {
  getMunicipalities,
  getChannlesByLocation,
};
