import ax from 'axios';
import querystring from 'querystring';
import _ from 'lodash';

import paymentAuthService from './payment-auth-util';
import config from '../../../config';

const paymentAuthAdapter = ax.create({
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json',
  },
  responseType: 'json',
});

if (__DEV__) {
  paymentAuthAdapter.interceptors.request.use(
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
  paymentAuthAdapter.interceptors.response.use(
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

const getPayAtAuthToken = async () => {
  const data = paymentAuthService.constructOAuthTokenData();
  return paymentAuthAdapter
    .post(config.payAtAuthUrl, querystring.stringify(data), {
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: config.payAtClientId,
        password: config.payAtClientSecret,
      },
    })
    .then((response) => _.get(response, 'data.access_token', null));
};

export default {
  getPayAtAuthToken,
};
