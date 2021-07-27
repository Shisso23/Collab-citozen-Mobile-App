/* eslint-disable no-unused-vars */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Moment from 'moment';
import appConfig from '../config';

const { apiUrl } = appConfig;

// mock midleware while we do not have a backend.
export const mockApi = axios.create({
  withCredentials: false,
  timeout: 20000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
});
const mockAdapter = new MockAdapter(mockApi, { delayResponse: 400 });

// mocking channelsWIth validated Accounts api
mockAdapter.onPost(`${apiUrl}/function/execfunction`).reply(() => {
  const response = 200;
  const data = {
    Channels: [
      {
        objectId: 601083,
        name: 'Prepaid Vendor Off',
        category: 'Financial Services',
        code: 'WC043',
        status: 'pending',
        accounts: [
          {
            obj_id: '212',
            account_number: '0123456789',
            account_name: 'Hyacinthe',
            status: 'Requested',
            statements: [
              {
                file_id: '12345',
                obj_id: '1234',
              },
            ],
          },
        ],
      },
      {
        objectId: 601084,
        name: 'Account Enquiries',
        category: 'Financial Services',
        code: 'WC044',
        status: 'Subscribed',
        accounts: [
          {
            obj_id: '213',
            account_number: '0123456789',
            account_name: 'Shisso',
            status: 'Requested',
            statements: [
              {
                file_id: '12345',
                obj_id: '1234',
              },
            ],
          },
          {
            obj_id: '214',
            account_number: '0123456789',
            account_name: 'Frans',
            status: 'Granted',
            statements: [
              {
                file_id: '12345',
                obj_id: '1234',
              },
            ],
          },
        ],
      },
    ],
  };

  return [response, data];
});

// mocking getAccountStatements api
mockAdapter.onGet(`${apiUrl}/statements`).reply(() => {
  // const { accountId } = JSON.parse(config.data);
  const data = {
    statements: [
      {
        objectId: '123',
        address: '129 Rosile street, Brooklyn',
        paid_amount: 3000,
        date: Moment(new Date()).format('DD MM YYYY'),
        statementUrl: 'http://www.africau.edu/images/default/sample.pdf',
      },
      {
        objectId: '124',
        address: '34 joubert street, Moreleta',
        paid_amount: 800,
        date: Moment(new Date()).format('DD MM YYYY'),
        statementUrl: 'https://efb.gr/wp-content/uploads/2019/10/dummy.pdf',
      },
      {
        objectId: '125',
        address: '445 main street, monument park',
        paid_amount: 2100.35,
        date: Moment(new Date()).format('DD MM YYYY'),
        statementUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
  };
  const responseStatus = 200;
  return [responseStatus, data];
});

// mocking validate account api
mockAdapter.onGet(`${apiUrl}/validate`).reply((config) => {
  const { email, accountNumber } = JSON.parse(config.data);
  const data = true;
  const responseStatus = 200;

  return [responseStatus, data];
});

const bloat = (response) => {
  return {
    data: {
      Code: 0,
      Message: 'Success',
      DetailedMessages: null,
      CollaboratorUri: 'https://api.collaboratoronline.com/webAPIConsumer/api',
      Data: response,
    },
  };
};

const timoutValue = 2000;
export const mockRequest = (response) => {
  return {
    post: (_url, _data, _config) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(bloat(response));
        }, timoutValue);
      }),
    get: (_url, _config) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(bloat(response));
        }, timoutValue);
      }),
  };
};
