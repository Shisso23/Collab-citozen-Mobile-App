import { metersService } from '../../services';
import {
  setAccountMeterReadingsAction,
  setIsLoadingAccountMeterReadingsAction,
} from './account-meters.reducer';

export const getMeterReadingsAction =
  async ({ meterObjId }) =>
  async (dispatch) => {
    dispatch(setIsLoadingAccountMeterReadingsAction(true));
    return metersService
      .getMeterReadings({ meterObjId })
      .then((meterReadings) => {
        dispatch(setAccountMeterReadingsAction(meterReadings));
        return meterReadings;
      })
      .finally(() => dispatch(setIsLoadingAccountMeterReadingsAction(false)));
  };

export default {
  getMeterReadingsAction,
};
