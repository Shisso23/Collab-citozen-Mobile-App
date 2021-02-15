import _ from 'lodash';

import {
  constructServiceRequestModels,
  serviceRequestModel,
  apiCreateServiceRequestModel,
} from '../../../models';
import globalUrl from '../global/global.service.urls';
import { apiFunctionWithUniqName } from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';
import srUrls from './service-request.urls';

const createServiceRequest = async (createServiceRequestForm, userInfo) => {
  const url = srUrls.createSrUrl();
  const apiModel = apiCreateServiceRequestModel(createServiceRequestForm, userInfo);
  try {
    const apiResponse = await authNetworkService.post(url, apiModel);
    return serviceRequestModel(apiResponse.data.Data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(JSON.stringify(err, null, 2));
    throw err;
  }
};

const getServiceRequests = async () => {
  const url = globalUrl.globalFunctionUrl();
  const data = await apiFunctionWithUniqName('get_service_requests');
  const apiResponse = await authNetworkService.post(url, data);
  const serviceRequests = _.get(apiResponse.data, 'service_requests', []);
  return constructServiceRequestModels(serviceRequests);
};

export default {
  createServiceRequest,
  getServiceRequests,
};
