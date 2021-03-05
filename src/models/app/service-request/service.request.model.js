import _ from 'lodash';
import srUrls from '../../../services/sub-services/service-request-service/service-request.urls';
import storageService from '../../../services/sub-services/storage-service/storage.service';

const constructAddress = (_apiServiceRequestModel) => {
  const streetName = _.get(_apiServiceRequestModel, 'street_name', '');
  const streetNumber = _.get(_apiServiceRequestModel, 'street_number', '');
  const suburb = _.get(_apiServiceRequestModel, 'suburb', '');
  return `${streetNumber} ${streetName}, ${suburb}`;
};

const getServiceRequestImageUrl = (_apiServiceRequestModel, token) => {
  const fileId = _.get(_apiServiceRequestModel, 'files[0].file_id');
  const objId = _.get(_apiServiceRequestModel, 'obj_id');
  if (!fileId) {
    return null;
  }

  const uri = srUrls.viewSrImageUrl(objId, fileId);

  return {
    uri,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const serviceRequestModel = (_apiServiceRequestModel = {}, accessToken) => ({
  id: _.get(_apiServiceRequestModel, 'obj_id', ''),
  serviceType: _.get(_apiServiceRequestModel, 'service_type_id', ''),
  serviceDescription: _.get(_apiServiceRequestModel, 'description', ''),
  address: constructAddress(_apiServiceRequestModel).trim(),
  requestedDate: _.get(_apiServiceRequestModel, 'request_date', '').replace('.', ''),
  referenceNumber: _.get(_apiServiceRequestModel, 'on_premises_ref', ''),
  avatarUrl: `https://loremflickr.com/320/240/landscape?random=${_.random(1000)}`,
  serviceRequestImage: getServiceRequestImageUrl(_apiServiceRequestModel, accessToken),
  status: _.get(_apiServiceRequestModel, 'status', ''),
});

export const constructServiceRequestModels = async (apiServiceRequests) => {
  const token = await storageService.getAccessToken();
  return apiServiceRequests.map((serviceRequest) => serviceRequestModel(serviceRequest, token));
};
