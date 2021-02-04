import { mockRequest } from '../../../dummy-data/mock-api';
import { serviceRequests, createServiceRequest_ } from '../../../dummy-data/service-requests';
import { constructServiceRequestModels, serviceRequestModel } from '../../../models';

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

const getServiceRequests = () => {
  const url = '';
  return mockRequest(serviceRequests)
    .get(url)
    .then((apiResponse) => constructServiceRequestModels(apiResponse.data.Data));
};

export default {
  createServiceRequest,
  getServiceRequests,
};
