import _ from 'lodash';
import storageService from '../storage-service/storage.service';
import appConfig from '../../../config';

const storeAccessToken = (apiResponse) => {
  const accessToken = _.get(apiResponse, 'data', null);
  return Promise.all([storageService.storeAccessToken(accessToken)]);
};

const getAccessToken = () => {
  return Promise.all([storageService.getAccessToken()]);
};

const constructSignInData = ({ username, password }) => ({
  username,
  password,
});

const authenticationFailed = (apiResponse) => {
  const responseMessage = _.get(apiResponse, 'data');
  return (
    responseMessage === 'Auth Failed' ||
    responseMessage === 'Object reference not set to an instance of an object.'
  );
};

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
  getAccessToken,
  authenticationFailed,
};
