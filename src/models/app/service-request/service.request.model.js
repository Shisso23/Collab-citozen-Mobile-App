import _ from 'lodash';
import async from 'async';
import srUrls from '../../../services/sub-services/service-request-service/service-request.urls';
import storageService from '../../../services/sub-services/storage-service/storage.service';

const getServiceRequestImageUrl = (_apiServiceRequestModel, token) => {
  const objId = _.get(_apiServiceRequestModel, 'obj_id');

  const files = _.get(_apiServiceRequestModel, 'files', null);
  if (!files) {
    return null;
  }
  const srImages = files.map((file) => {
    const fileId = file.file_id;
    if (!fileId) {
      return null;
    }
    const uri = srUrls.viewSrImageUrl(objId, fileId);
    return {
      uri,
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  });
  return srImages;
};

export const serviceRequestModel = (_apiServiceRequestModel = {}, accessToken) => ({
  id: _.get(_apiServiceRequestModel, 'obj_id', ''),
  serviceType: _.get(_apiServiceRequestModel, 'service_type_id', ''),
  serviceDescription: _.get(_apiServiceRequestModel, 'description', ''),
  address: _.get(_apiServiceRequestModel, 'sr_address', ''),
  requestedDate: _.get(_apiServiceRequestModel, 'request_date', '').replace('.', ''),
  referenceNumber: _.get(_apiServiceRequestModel, 'on_premises_ref', ''),
  serviceRequestImage: getServiceRequestImageUrl(_apiServiceRequestModel, accessToken),
  status: _.get(_apiServiceRequestModel, 'status', ''),
});

export const constructServiceRequestModels = async (apiServiceRequests) => {
  const token = await storageService.getAccessToken();
  return async.map(apiServiceRequests, async (serviceRequest, done) => {
    const model = serviceRequestModel(serviceRequest, token);
    model.gpsAddress = _.get(serviceRequest, 'sr_address', '');
    done(null, model);
  });
};
