import _ from 'lodash';
import { mockRequest } from '../../../dummy-data/mock-api';
import { createServiceRequest_ } from '../../../dummy-data/service-requests';
import { constructServiceRequestModels, serviceRequestModel } from '../../../models';
import globalUrl from '../global/global.service.urls';
import { apiFunctionWithUniqName } from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';

const createServiceRequest = (createServiceRequestForm) => {
  const url = '';
  const apiModel = createServiceRequestForm;
  const mockResponse = createServiceRequest_(createServiceRequestForm);
  return mockRequest(mockResponse)
    .post(url, apiModel)
    .then((apiResponse) => {
      return serviceRequestModel(apiResponse.data.Data);
    });
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
