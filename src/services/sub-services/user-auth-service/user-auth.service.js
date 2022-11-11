import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
import storageService from '../storage-service/storage.service';
import config from '../../../config';

const signIn = async (formData) => {
  const { authenticationFailed, storeAccessToken, constructSignInData } = authUtils;
  const signInUrl = authUrls.tokenUrl();
  const apiModel = apiSignInModel(formData);
  const signInData = constructSignInData(apiModel);

  const apiResponse = await networkService.post(signInUrl, signInData);
  if (authenticationFailed(apiResponse)) {
    const errorMessage = _.get(apiResponse, 'data');
    throw new Error(errorMessage);
  }
  if (formData.email === `${config.appSignIn}`) {
    AsyncStorage.setItem('registerToken', `${_.get(apiResponse, 'data', null)}`);
  } else {
    await Promise.all([storeAccessToken(apiResponse)]);
  }
};

const signOut = () => {
  return Promise.all([storageService.removeAccessToken()]);
};

const register = async (formData) => {
  const registerUrl = authUrls.registerUrl();
  const apiModel = apiRegistrationUserModel(formData);
  const token = await AsyncStorage.getItem('registerToken');
  const authConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return networkService.post(registerUrl, apiModel, authConfig).catch((err) => {
    err.errors = registrationUserModel(err.errors);
    return Promise.reject(err);
  });
};

const forgotPassword = (formData) => {
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
