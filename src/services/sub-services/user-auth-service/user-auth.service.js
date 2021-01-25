import _ from 'lodash';
import authUrls from './user-auth.urls';
import authUtils from './user-auth.utils';
import networkService from '../network-service/network.service';
import {
  apiRegistrationUserModel,
  registrationUserModel,
  apiForgotPasswordModel,
  forgotPasswordModel,
  apiSignInModel,
} from '../../../models';

const signIn = ({ formData }) => {
  const signInUrl = authUrls.tokenUrl();
  const apiModel = apiSignInModel(formData);
  const signInData = authUtils.constructSignInData(apiModel);
  return networkService.post(signInUrl, signInData).then(authUtils.storeAccessToken);
};

const signOut = () => {
  // any other signOut logic
  return authUtils.removeAccessToken();
};

const register = ({ formData }) => {
  const registerUrl = authUrls.registerUrl();
  const apiModel = apiRegistrationUserModel(formData);
  return networkService.post(registerUrl, apiModel).catch((err) => {
    err.errors = registrationUserModel(err.errors);
    return Promise.reject(err);
  });
};

const forgotPassword = ({ formData }) => {
  const forgotPasswordUrl = authUrls.forgotPasswordUrl();
  const apiModel = apiForgotPasswordModel(formData);

  return networkService.post(forgotPasswordUrl, apiModel).catch((err) => {
    err.errors = forgotPasswordModel(err.errors);
    return Promise.reject(err);
  });
};

const doTokenExistInLocalStorage = () => {
  const _trueIfExist = (accessToken) => {
    return !_.isNull(accessToken);
  };
  return authUtils.getAccessToken().then(([accessToken]) => {
    return _trueIfExist(accessToken);
  });
};

export default {
  signIn,
  signOut,
  register,
  forgotPassword,
  doTokenExistInLocalStorage,
};
