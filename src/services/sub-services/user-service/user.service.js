import authNetworkService from '../auth-network-service/auth-network.service';
import { userModel, apiUserModel } from '../../../models';
import globalUrl from '../global/global.service.urls';
import { apiFunctionWithUniqName } from '../../../helpers/api-function-name.helper';

const getUser = async () => {
  const url = globalUrl.globalFunctionUrl();
  const _createAndReturnUserModel = ({ data }) => {
    if (!data.profile) {
      throw Error('Could not get user profile');
    }
    return userModel(data.profile);
  };
  const data = await apiFunctionWithUniqName('get_user_profile');
  const apiResponse = await authNetworkService.post(url, data);
  return _createAndReturnUserModel(apiResponse);
};

const updateUser = ({ formData }) => {
  const url = globalUrl.globalFunctionUrl();
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
