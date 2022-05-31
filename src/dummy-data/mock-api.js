/* eslint-disable no-unused-vars */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Moment from 'moment';
import appConfig from '../config';
import globalServiceUrls from '../services/sub-services/global/global.service.urls';

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

// mocking create Notification
mockAdapter.onPost(globalServiceUrls.createUpdateRecordUrl()).reply((config) => {
  const { data } = config;

  let responseStatus;
  let response;

  if (data) {
    response = {
      sucess: true,
    };
    responseStatus = 200;
  } else {
    response = {
      sucess: false,
    };
    responseStatus = 500;
  }
  return [responseStatus, response];
});

// mocking get channels with admin users api
mockAdapter.onGet(globalServiceUrls.globalFunctionUrl()).reply(() => {
  const response = {
    accounts_applicable: true,
    banner_images: [],
    code: 'WC033',
    interest_types: [],
    logo_image: [],
    name: 'Cape Agulhas Local Municipality',
    obj_id: 556521,
    adminUserIds: [556521, 556524, 556523, 556522],
  };

  const responseStatus = 200;

  return [responseStatus, response];
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
