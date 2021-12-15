import { metersService } from '../../services';
import {
  setAccountMeterReadingsAction,
  setIsLoadingAccountMeterReadingsAction,
} from './account-meters.reducer';

export const getWaterMeterReadingsAction =
  ({ meterNumber, accountNumber }) =>
  (dispatch) => {
    dispatch(setIsLoadingAccountMeterReadingsAction(true));
    return metersService
      .getWaterMeterReadings({ meterNumber, accountNumber })
      .then((meterReadings) => {
        dispatch(setAccountMeterReadingsAction(meterReadings));
        return meterReadings;
      })
      .finally(() => dispatch(setIsLoadingAccountMeterReadingsAction(false)));
  };
export const getElectricityMeterReadingsAction =
  ({ meterNumber, accountNumber }) =>
  (dispatch) => {
    dispatch(setIsLoadingAccountMeterReadingsAction(true));
    return metersService
      .getElectricityMeterReadings({ meterNumber, accountNumber })
      .then((meterReadings) => {
        dispatch(setAccountMeterReadingsAction(meterReadings));
        return meterReadings;
      })
      .finally(() => dispatch(setIsLoadingAccountMeterReadingsAction(false)));
  };

export default {
  getElectricityMeterReadingsAction,
  getWaterMeterReadingsAction,
};
