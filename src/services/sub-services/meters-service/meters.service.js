import _ from 'lodash';
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import metersUrls from './meters.urls';

import {
  dataGetAccountMeters,
  dataGetMeterReadings,
  dataSubmitReading,
} from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';
import { mockApi } from '../../../dummy-data/mock-api';
import {
  constructMeterModels,
  constructMeterReadingsModels,
} from '../../../models/app/account-meters/account-meters.model';
import { flashService } from '../..';
import storageService from '../storage-service/storage.service';

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

const uploadMeterReadingPhoto = async (objId, photo) => {
  const fileUploadUrl = metersUrls.upLoadFile();
  try {
    const authToken = await storageService.getAccessToken();
    const path = Platform.OS === 'ios' ? photo.replace('file://', '') : photo;
    const response = await RNFetchBlob.fetch(
      'POST',
      `${fileUploadUrl}`,
      {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
      [
        { name: 'Obj_Id', data: `${objId}` },
        {
          name: 'Attachment',
          filename: `${objId}.jpg`,
          data: RNFetchBlob.wrap(path),
        },
      ],
    );
    return response;
  } catch (err) {
    console.warn(JSON.stringify(err, null, 2));
    throw err;
  }
};

const submitReading = async ({ channelRef, readingValue, meterNumber, photo }) => {
  const url = metersUrls.submitMeterReadingsUrl();
  const data = dataSubmitReading({ channelRef, readingValue, meterNumber });
  try {
    const apiResponse = await authNetworkService.post(url, data);
    await uploadMeterReadingPhoto(_.get(apiResponse, 'data', ''), photo);
    flashService.success('Successfully submitted!');

    return apiResponse;
  } catch (error) {
    return flashService.error(`Oops ${_.get(error, 'message', 'Something went wrong!')}`);
  }
};

export default {
  getAccountMeters,
  getWaterMeterReadings,
  getElectricityMeterReadings,
  submitReading,
};
