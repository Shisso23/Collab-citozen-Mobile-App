import _ from 'lodash';

import { constructServiceRequestModels, apiCreateServiceRequestModel } from '../../../models';
import globalUrl from '../global/global.service.urls';
import { apiFunctionWithUniqName } from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';
import srUrls from './service-request.urls';

const createServiceRequest = async (createServiceRequestForm, userInfo) => {
  const url = srUrls.createSrUrl();
  const fileUploadUrl = srUrls.upLoadFile();
  const apiModel = apiCreateServiceRequestModel(createServiceRequestForm, userInfo);
  try {
    const apiResponse = await authNetworkService.post(url, apiModel);
    const objID = _.get(apiResponse.data.Data, 'ObjID');
    const fileAttachment = _.get(createServiceRequestForm, 'imageUri');
    if (!fileAttachment) return;
    const formData = await _constructServiceRequestFormData(objID, fileAttachment);
    await authNetworkService.post(fileUploadUrl, formData, {
      headers: { Accept: `Content-Type': 'multipart/form-data` },
    });
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
  if (serviceRequests.length === 0 || !serviceRequests) {
    throw Error('Could not get service requests');
  }
  return constructServiceRequestModels(serviceRequests);
};

const _constructServiceRequestFormData = async (objId, file) => {
  const formData = new FormData();
  const fileType = file.type.substr(file.type.length - 3);
  formData.append('Obj_Id', objId);
  formData.append('Attachment', {
    uri: file.uri,
    name: `${objId}.${fileType}`,
  });
  return formData;
};

export default {
  createServiceRequest,
  getServiceRequests,
};
