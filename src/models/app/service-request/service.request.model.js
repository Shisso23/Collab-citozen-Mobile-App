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

export const commentModel = (_apiCommentModel = {}) => {
  const serviceRequestId = _.get(_apiCommentModel, 'service_request_ref', '');
  const origin = _.get(_apiCommentModel, 'origin', '');
  return {
    _id: _.get(_apiCommentModel, 'obj_id', ''),
    serviceRequestId,
    origin,
    text: _.get(_apiCommentModel, 'comment', ''),
    createdAt: _.get(_apiCommentModel, 'Date', new Date()),
    user: {
      _id: origin === 'User' ? 1 : 2,
    },
  };
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
  channelId: _.get(_apiServiceRequestModel, 'channel_ref ', ''),
  channelName: _.get(_apiServiceRequestModel, 'channel_name ', ''),
  ownerId: _.get(_apiServiceRequestModel, 'created_by_user_id', null),
});

export const nearbyPinLocationModel = (_apiNearbyPinLocationsModel = {}) => ({
  id: _.get(_apiNearbyPinLocationsModel, 'obj_id', ''),
  channelId: _.get(_apiNearbyPinLocationsModel, 'channel_ref', ''),
  channelName: _.get(_apiNearbyPinLocationsModel, 'channel_name', ''),
  serviceType: _.get(_apiNearbyPinLocationsModel, 'service_type', ''),
  serviceDescription: _.get(_apiNearbyPinLocationsModel, 'description', ''),
  gpsCoordinates: _.get(_apiNearbyPinLocationsModel, 'gps_coordinates', ''),
  requestDate: _.get(_apiNearbyPinLocationsModel, 'request_date', '').replace('.', ''),
  status: _.get(_apiNearbyPinLocationsModel, 'status', ''),
  serviceTypeRef: _.get(_apiNearbyPinLocationsModel, 'service_type_ref', ''),
  ownerId: _.get(_apiNearbyPinLocationsModel, 'created_by_user_id', null),
});

export const construcCommentModels = async (apiComments) => {
  return async.map(apiComments, async (comment, done) => {
    const model = commentModel(comment);
    done(null, model);
  });
};

export const constructServiceRequestModels = async (apiServiceRequests) => {
  const token = await storageService.getAccessToken();
  return async.map(apiServiceRequests, async (serviceRequest, done) => {
    const model = serviceRequestModel(serviceRequest, token);
    model.gpsAddress = _.get(serviceRequest, 'sr_address', '');
    done(null, model);
  });
};

export const constructNearbyPinLocationsModels = async (apiPinLocations) => {
  return async.map(apiPinLocations, async (pinLocation, done) => {
    const model = nearbyPinLocationModel(pinLocation);
    done(null, model);
  });
};
