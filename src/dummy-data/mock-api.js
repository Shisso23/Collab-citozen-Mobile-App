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

// mocking pin locations while backend is not returning data reliably
mockAdapter.onPost(`${apiUrl}/function/execfunction`).reply((config) => {
  const data = {
    radius_service_requests: [
      {
        obj_id: 773171,
        channel_ref: '685861',
        channel_name: 'Demo Channel',
        service_type: 'Pothole',
        description: 'There is a massive pothole in front of my driveway',
        gps_coordinates: 'POINT(18.374044205993414 -33.80176645233222)',
        request_date: '2022-03-14 06:33',
        status: 'Assigned',
        service_type_ref: '',
      },
      {
        obj_id: 773337,
        channel_ref: '685861',
        channel_name: 'Demo Channel',
        service_type: 'Account Enquiry',
        description: 'Test',
        gps_coordinates: 'POINT(18.378870841115713 -33.811022228274766)',
        request_date: '2022-03-14 08:07',
        status: 'Initial',
        service_type_ref: '',
      },
      {
        obj_id: 774412,
        channel_ref: '685861',
        channel_name: 'Demo Channel',
        service_type: 'Health Services',
        description: 'Demo',
        gps_coordinates: 'POINT(18.37123090000003 -33.80760730000001)',
        request_date: '2022-03-15 14:30',
        status: 'Initial',
        service_type_ref: '',
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
