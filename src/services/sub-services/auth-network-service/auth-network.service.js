import ax from 'axios';

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

createAttachTokenInterceptor(authNetworkService, storageService.getAccessToken);
createNetworkErrorHandlerInterceptor(authNetworkService);

// Interceptors are here to help  us log the requests
if (__DEV__) {
  authNetworkService.interceptors.request.use(
    (requestConfig) => {
      const { method, url, data, headers } = requestConfig;
      console.log(`🤔 ${method.toUpperCase()} ${url}`, { data, headers }); // eslint-disable-line no-console
      return requestConfig;
    },
    (error) => {
      console.log('❌', error); // eslint-disable-line no-console
      return Promise.reject(error);
    },
  );
  authNetworkService.interceptors.response.use(
    (response) => {
      const {
        data,
        headers,
        config: { url, method },
      } = response;
      console.log(`✅ ${method.toUpperCase()} "${url}"`, { data, headers }); // eslint-disable-line no-console
      return response;
    },
    (error) => {
      console.log('❌', error); // eslint-disable-line no-console
      return Promise.reject(error);
    },
  );
}

export default authNetworkService;
