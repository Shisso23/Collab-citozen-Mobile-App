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

// mocking get electricity meter readings api
mockAdapter.onPost(`${apiUrl}/function/getMeterReadings/electricity`).reply((config) => {
  const data = {
    readings: [
      {
        obj_id: 15362,
        type: 'electricity',
        readingNumber: 2895843,
        date: new Date(),
      },
      {
        obj_id: 12962,
        type: 'electricity',
        readingNumber: 2425865,
        date: new Date(),
      },
      {
        obj_id: 15372,
        type: 'electricity',
        readingNumber: 2737286,
        date: new Date(),
      },
    ],
  };
  const responseStatus = 200;

  return [responseStatus, data];
});

// mocking get water meter readings api
mockAdapter.onPost(`${apiUrl}/function/getMeterReadings/water`).reply((config) => {
  const data = {
    readings: [
      {
        obj_id: 15362,
        type: 'water',
        readingNumber: 2895880,
        date: new Date(),
      },
      {
        obj_id: 12962,
        type: 'water',
        readingNumber: 2425880,
        date: new Date(),
      },
      {
        obj_id: 15372,
        type: 'water',
        readingNumber: 2737221,
        date: new Date(),
      },
    ],
  };
  const responseStatus = 200;

  return [responseStatus, data];
});

// mocking get account meters api
mockAdapter.onPost(`${apiUrl}/function/getAccountMeters`).reply((config) => {
  const data = [
    {
      obj_id: 15362,
      type: 'electricity',
      meterNumber: 3279294326,
    },
    {
      obj_id: 12962,
      type: 'water',
      meterNumber: 1387482347,
    },
  ];
  const responseStatus = 200;

  return [responseStatus, data];
});

// mocking submit reading api
mockAdapter.onPost(`${apiUrl}/Records/CreateUpdateRecord/submitReading`).reply((config) => {
  const data = true;
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
