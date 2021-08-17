import ax from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import userAuthUrls from '../user-auth-service/user-auth.urls';
import userAuthUtils from '../user-auth-service/user-auth.utils';
import {
  createAttachTokenInterceptor,
  createNetworkErrorHandlerInterceptor,
} from '../utils/interceptors';
import storageService from '../storage-service/storage.service';

const authNetworkService = ax.create({
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json',
  },
  responseType: 'json',
});

const refreshTokenLogic = () => {
  const _tryToRefreshToken = async (refreshOAuthData) => {
    const tokenUrl = userAuthUrls.tokenUrl();
    const result = await ax.post(tokenUrl, refreshOAuthData);
    return result;
  };

  const _storeNewTokens = (apiResponse) => {
    return userAuthUtils.storeAccessToken(apiResponse);
  };

  return Promise.resolve()
    .then(userAuthUtils.constructOAuthTokenRefreshData)
    .then(_tryToRefreshToken)
    .then(_storeNewTokens)
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.warn(error.message);
    });
};

createAttachTokenInterceptor(authNetworkService, storageService.getAccessToken);
createAuthRefreshInterceptor(authNetworkService, refreshTokenLogic);
createNetworkErrorHandlerInterceptor(authNetworkService);

export default authNetworkService;
