import _ from 'lodash';
import metersUrls from './meters.urls';

import {
  dataGetAccountMeters,
  dataGetMeterReadings,
  dataSubmitReading,
} from '../../../helpers/api-function-name.helper';
// import authNetworkService from '../auth-network-service/auth-network.service'; TODO. USE THIS WHEN ENDPOINTS ARE AVAILABLE
import { mockApi } from '../../../dummy-data/mock-api';
import {
  constructMeterModels,
  constructMeterReadingsModels,
} from '../../../models/app/account-meters/account-meters.model';

const getAccountMeters = async (accountNumber) => {
  const url = metersUrls.getAccountMetersUrl();
  const data = dataGetAccountMeters(accountNumber);
  const apiResponse = await mockApi.post(url, data);
  const metersModel = constructMeterModels(_.get(apiResponse, 'data.Meters', []));
  return metersModel;
};

const getWaterMeterReadings = async ({ meterNumber, accountNumber }) => {
  const url = metersUrls.getWaterMeterReadingsUrl();
  const data = dataGetMeterReadings({ meterNumber, accountNumber, meterType: 'water' });
  const apiResponse = await mockApi.post(url, data);
  const readingsModel = constructMeterReadingsModels(_.get(apiResponse, 'data.readings', []));
  return readingsModel;
};

const getElectricityMeterReadings = async ({ meterNumber, accountNumber }) => {
  const url = metersUrls.getElectricityMeterReadingsUrl();
  const data = dataGetMeterReadings({ meterNumber, accountNumber, meterType: 'electricity' });
  const apiResponse = await mockApi.post(url, data);
  const readingsModel = constructMeterReadingsModels(_.get(apiResponse, 'data.readings', []));
  return readingsModel;
};

const submitReading = async ({ fileName, meterNumber }) => {
  const url = metersUrls.getMeterReadingsUrl();
  const data = await dataSubmitReading({ fileName, meterNumber });
  const apiResponse = await mockApi.post(url, data);
  return apiResponse;
};

export default {
  getAccountMeters,
  getWaterMeterReadings,
  getElectricityMeterReadings,
  submitReading,
};
