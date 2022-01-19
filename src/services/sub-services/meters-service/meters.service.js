import _ from 'lodash';
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import metersUrls from './meters.urls';

import {
  dataGetMeterReadings,
  dataSubmitReading,
  dataValidateReading,
} from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';

import { constructMeterReadingsModels } from '../../../models/app/account-meters/account-meters.model';
import { flashService } from '../..';
import storageService from '../storage-service/storage.service';

const getMeterReadings = async ({ meterObjId }) => {
  const url = metersUrls.getMeterReadingsUrl();
  const data = dataGetMeterReadings({ meterObjId });
  try {
    const apiResponse = await authNetworkService.post(url, data);
    const readingsModel = constructMeterReadingsModels(
      _.get(apiResponse, 'data.Meter[0]', []), // TODO ask miguel if this is always going to return one meter with reading. It's Unnecessary to get the meter info here. Currently using the first meter
    );
    return readingsModel;
  } catch (error) {
    return flashService.error('No meter reading found!');
  }
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

const validateReading = async ({ readingValue, meterObjId }) => {
  const url = metersUrls.validateReadingUrl();
  const data = dataValidateReading({ meterObjId, readingValue });
  try {
    const apiResponse = await authNetworkService.post(url, data);
    flashService.success('Validated!');
    const validationResponse = _.get(
      apiResponse,
      'data.Meter_Reading_Validation[0].user_message',
      false,
    );

    if (validationResponse) {
      return { warning: true, message: validationResponse };
    }
    return { warning: false, message: '' };
  } catch (error) {
    flashService.error(`The meter reading is invalid! \n ${_.get(error, 'user_message', '')}`);
    return { warning: false, message: _.get(error, 'user_message', '') };
  }
};

const submitReading = async ({ channelRef, readingValue, meterObjId, photo }) => {
  const url = metersUrls.submitMeterReadingsUrl();
  const data = dataSubmitReading({ channelRef, readingValue, meterObjId });
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
  getMeterReadings,
  submitReading,
  validateReading,
};
