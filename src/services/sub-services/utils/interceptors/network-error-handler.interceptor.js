import _ from 'lodash';
import {
  ClientNetworkError,
  ServerNetworkError,
  ServerNotFoundError,
} from '../../../../exceptions';
import { signOutAction } from '../../../../reducers/user-auth-reducer/user-auth.actions';
import store from '../../../../reducers/store';

const createNetworkErrorHandlerInterceptor = (axiosInstance) => {
  const _serverResponded = (error) => {
    return error.response;
  };
  const _noResponseFromServer = (error) => {
    return error.request;
  };
  const _serverSideError = (statusCode) => statusCode >= 500;
  const _clientSideError = (statusCode) => statusCode >= 400;

  return axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      let exception;
      if (_serverResponded(error)) {
        const statusCode = _.get(error, 'response.status');
        if (statusCode === 401) {
          store.dispatch(signOutAction());
        } else if (_serverSideError(statusCode)) {
          exception = new ServerNetworkError(statusCode, error.response.data);
        } else if (_clientSideError(statusCode)) {
          exception = new ClientNetworkError(statusCode, error.response.data);
        }
      } else if (_noResponseFromServer(error)) {
        exception = new ServerNotFoundError('Server is probably offline');
      } else {
        exception = new Error('Something terrible happened');
      }
      return Promise.reject(exception);
    },
  );
};
export default createNetworkErrorHandlerInterceptor;
