import { metersService } from '../../services';
import {
  setAccountMeterReadingsAction,
  setAccountMetersAction,
  setIsLoadingAccountMeterReadingsAction,
  setIsLoadingAccountMetersAction,
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

export const getAccountMetersAction = (accountNumber) => (dispatch) => {
  dispatch(setIsLoadingAccountMetersAction(true));
  return metersService
    .getAccountMeters(accountNumber)
    .then((accountMeters) => {
      dispatch(setAccountMetersAction(accountMeters));
      return accountMeters;
    })
    .finally(() => dispatch(setIsLoadingAccountMetersAction(false)));
};

export default {
  getElectricityMeterReadingsAction,
  getWaterMeterReadingsAction,
  getAccountMetersAction,
};
