import _ from 'lodash';
import storageService from '../storage-service/storage.service';
import appConfig from '../../../config';

const storeAccessToken = (apiResponse) => {
  const accessToken = _.get(apiResponse, 'data', null);
  return Promise.all([storageService.storeAccessToken(accessToken)]);
};

const removeAccessAndRefreshTokens = () => {
  return Promise.all([storageService.removeAccessToken(), storageService.removeRefreshToken()]);
};

const getAccessAndRefreshTokens = () => {
  return Promise.all([storageService.getAccessToken(), storageService.getRefreshToken()]);
};

const constructSignInData = ({ username, password }) => ({
  username,
  password,
});

const constructOAuthTokenRefreshData = () => {
  return storageService.getRefreshToken().then((refreshToken) => ({
    grant_type: 'refresh_token',
    client_id: appConfig.clientId,
    client_secret: appConfig.clientSecret,
    refresh_token: refreshToken,
  }));
};

export default {
  storeAccessToken,
  constructSignInData,
  constructOAuthTokenRefreshData,
  removeAccessAndRefreshTokens,
  getAccessAndRefreshTokens,
};
