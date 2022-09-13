/* eslint-disable no-useless-catch */
import _ from 'lodash';
import Platform from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import {
  constructServiceRequestModels,
  apiCreateServiceRequestModel,
  construcCommentModels,
  constructNearbyPinLocationsModels,
} from '../../../models';
import globalUrl from '../global/global.service.urls';
import {
  apiFunctionWithUniqName,
  dataDeleteServiceRequest,
  dataServiceRequestComments,
  dataNewComment,
  dataNearbyPinLocations,
  dataConfirmAttachementsUploaded,
  dataFollowServiceRequest,
} from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';
import srUrls from './service-request.urls';
import { flashService } from '../../index';
import storageService from '../storage-service/storage.service';
import { mockApi } from '../../../dummy-data/mock-api';

const createServiceRequest = async (createServiceRequestForm, userInfo) => {
  const url = srUrls.createSrUrl();
  const apiModel = apiCreateServiceRequestModel(createServiceRequestForm, userInfo);
  try {
    return authNetworkService.post(url, apiModel);
  } catch (err) {
    throw err;
  }
};

const uploadServiceRequestPhoto = async (objId, photo) => {
  const fileUploadUrl = srUrls.upLoadFile();
  try {
    const authToken = await storageService.getAccessToken();
    const path = Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri;
    const response = await RNFetchBlob.fetch(
      'POST',
      `${fileUploadUrl}`,
      {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
      [
        { name: 'Obj_Id', data: `${objId}` },
        {
          name: 'Attachment',
          filename: `${objId}.jpg`,
          data: RNFetchBlob.wrap(path),
        },
      ],
    );
    return response;
  } catch (err) {
    throw err;
  }
};

const confirmCreateServiceRequest = async ({ uploadCompleted, serviceRequestId }) => {
  const url = globalUrl.createUpdateRecordUrl();
  const requestData = dataConfirmAttachementsUploaded({ uploadCompleted, serviceRequestId });
  return authNetworkService.post(url, requestData).then((response) => {
    return response;
  });
};

const followServiceRequest = async ({ userId, serviceRequestId, followed }) => {
  const url = globalUrl.createUpdateRecordUrl();
  const requestData = dataFollowServiceRequest({ userId, serviceRequestId, followed });
  return authNetworkService.post(url, requestData).then((response) => {
    return response;
  });
};

const getServiceRequests = async () => {
  const url = globalUrl.globalFunctionUrl();
  const data = await apiFunctionWithUniqName('get_service_requests');
  const apiResponse = await authNetworkService.post(url, data);
  const serviceRequests = _.get(apiResponse.data, 'service_requests', []);
  if (!serviceRequests) {
    throw Error('Could not load service requests.');
  }
  if (serviceRequests.length === 0) {
    flashService.info('You have no service requests.');
  }

  return constructServiceRequestModels(serviceRequests);
};

const deleteServiceRequest = async (channelId, serviceRequestId) => {
  const url = srUrls.deleteSRUrl();
  const data = dataDeleteServiceRequest({ serviceRequestId, channelId });
  const apiResponse = await authNetworkService.post(url, data);
  return _.get(apiResponse, 'data', null);
};

const getServiceRequestComments = async (serviceRequestId) => {
  const url = globalUrl.globalFunctionUrl();
  const data = dataServiceRequestComments(serviceRequestId);
  const apiResponse = await authNetworkService.post(url, data);
  return construcCommentModels(_.get(apiResponse, 'data.Feed', []));
};

const addNewComment = async (serviceRequestId, comment) => {
  const url = srUrls.addNewComment();
  const data = dataNewComment(serviceRequestId, comment);
  const apiResponse = await authNetworkService.post(url, data);
  return apiResponse;
};

const getServiceRequestPins = async (currentLatitude, currentLongitude) => {
  const url = srUrls.execFunctionUrl();
  const data = dataNearbyPinLocations(currentLatitude, currentLongitude);
  const apiResponse = await authNetworkService.post(url, data);
  const pinLocations = await constructNearbyPinLocationsModels(
    _.get(apiResponse, 'data.radius_service_requests', []),
  );

  return pinLocations;
};

const getServiceRequestCategories = async (currentLatitude, currentLongitude) => {
  const url = globalUrl.globalFunctionUrl();
  // const data = dataNearbyPinLocations(currentLatitude, currentLongitude);
  const apiResponse = await mockApi.post(url, {
    currentLatitude,
    currentLongitude,
  }); // TODO use real API
  const categories = _.get(apiResponse, 'data.categories', []);
  return categories;
};

export default {
  createServiceRequest,
  getServiceRequests,
  uploadServiceRequestPhoto,
  confirmCreateServiceRequest,
  deleteServiceRequest,
  getServiceRequestComments,
  addNewComment,
  getServiceRequestPins,
  followServiceRequest,
  getServiceRequestCategories,
};
