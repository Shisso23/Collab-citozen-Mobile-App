import authNetworkService from '../auth-network-service/auth-network.service';
import { userModel, apiUserModel } from '../../../models';
import userUrls from './user.urls';
import storageService from '../storage-service/storage.service';

const getUser = async () => {
  const url = userUrls.userUrl();
  const _createAndReturnUserModel = ({ data }) => {
    if (!data.profile) {
      throw Error('Could not get user profile');
    }
    return userModel(data.profile);
  };
  const email = await storageService.getEmail();
  const data = {
    taskID: 0,
    uniqName: 'GetUserProfile',
    InputValues: `<valRoot><val>${email}</val></valRoot>`,
  };
  const apiResponse = await authNetworkService.post(url, data);
  return _createAndReturnUserModel(apiResponse);
};

const updateUser = ({ formData }) => {
  const url = userUrls.userUrl();
  const apiUser = apiUserModel(formData);
  return authNetworkService.patch(url, apiUser).catch((error) => {
    error.errors = userModel(error.errors);
    // eslint-disable-next-line no-console
    console.warn(error);
    return Promise.reject(error);
  });
};

export default {
  getUser,
  updateUser,
};
