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

export default authNetworkService;
