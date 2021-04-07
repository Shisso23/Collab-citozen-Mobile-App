import _ from 'lodash';
import async from 'async';
import srUrls from '../../../services/sub-services/service-request-service/service-request.urls';
import storageService from '../../../services/sub-services/storage-service/storage.service';
import locationService from '../../../services/sub-services/location-service/location.service';

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
    timeout: 20000,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getLocationNameFromGpsCoordinates = async (gpsCoordinates) => {
  const indexComma = gpsCoordinates.indexOf(',');
  const latt = gpsCoordinates.substring(6, indexComma - 1);
  const long = gpsCoordinates.substring(indexComma + 1, gpsCoordinates.length - 1);
  const address = await locationService.getAddressFromCoordinates({
    latitude: latt,
    longitude: long,
  });
  return address;
};

export const serviceRequestModel = (_apiServiceRequestModel = {}, accessToken) => ({
  id: _.get(_apiServiceRequestModel, 'obj_id', ''),
  serviceType: _.get(_apiServiceRequestModel, 'service_type_id', ''),
  serviceDescription: _.get(_apiServiceRequestModel, 'description', ''),
  address: constructAddress(_apiServiceRequestModel).trim(),
  requestedDate: _.get(_apiServiceRequestModel, 'request_date', '').replace('.', ''),
  referenceNumber: _.get(_apiServiceRequestModel, 'on_premises_ref', ''),
  serviceRequestImage: getServiceRequestImageUrl(_apiServiceRequestModel, accessToken),
  status: _.get(_apiServiceRequestModel, 'status', ''),
});

export const constructServiceRequestModels = async (apiServiceRequests) => {
  const token = await storageService.getAccessToken();
  return async.map(apiServiceRequests, async (serviceRequest, done) => {
    const model = serviceRequestModel(serviceRequest, token);
    try {
      model.gpsAddress = await getLocationNameFromGpsCoordinates(
        _.get(serviceRequest, 'gps_coordinates'),
      );
    } catch (e) {
      model.gpsAddress = 'Address not found';
    }
    done(null, model);
  });
};
