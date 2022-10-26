import axios from 'axios';
import _ from 'lodash';
import paymentUrls from './payment.urls';

const paymentAuthAdapter = axios.create({
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json',
  },
  responseType: 'json',
});

// Interceptors are here to help  us log the requests
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

const getUserToken = async ({ username, password }) => {
  const url = paymentUrls.getUserTokenUrl();

  return paymentAuthAdapter.post(url, { username, password }).then((response) => {
    console.log({ response });
    return _.get(response, 'data', null);
  });
};

const getAccountDetails = async ({ accountNumber, token }) => {
  const url = paymentUrls.getAccountDetailsUrl();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return paymentAuthAdapter
    .post(
      url,
      {
        ACCOUNTNUMBER: accountNumber,
      },
      config,
    )
    .then((response) => {
      return _.get(response, 'data', null);
    });
};

const initiatePayment = async ({ accountNumber, amount, token, authToken }) => {
  const url = paymentUrls.initPaymentUrl();
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  return paymentAuthAdapter
    .post(
      url,
      {
        ACCOUNTNUMBER: accountNumber,
        AMOUNT: amount,
        token,
        clientReference: 'accountrefernce0001',
        successUrl: 'https://citizen.collaboratoronline.com',
        failedUrl: 'https://citizen.collaboratoronline.com',
        cancelledUrl: 'https://citizen.collaboratoronline.com',
      },
      config,
    )
    .then((response) => {
      return _.get(response, 'data', null);
    });
};

export default {
  getUserToken,
  getAccountDetails,
  initiatePayment,
};
