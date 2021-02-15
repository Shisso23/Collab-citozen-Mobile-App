import _ from 'lodash';
import { constructMunicipalityModels } from '../../../models';
import { apiFunctionWithUniqName } from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';
import globalUrl from '../global/global.service.urls';

const getMunicipalities = async () => {
  const url = globalUrl.globalFunctionUrl();
  const data = await apiFunctionWithUniqName('get_municipalities');
  const apiResponse = await authNetworkService.post(url, data);
  const municipalities = _.get(apiResponse.data, 'municipalities', []);
  return constructMunicipalityModels(municipalities);
};

export default {
  getMunicipalities,
};
