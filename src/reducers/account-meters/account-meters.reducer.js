import CreateAction from '../action-utilities/action-creator';

const reducerName = 'meterReadings';

const setAccountMeterReadings = CreateAction(reducerName, 'SET_ACCOUNT_METER_READINGS');
export const setAccountMeterReadingsAction = setAccountMeterReadings.action;

const setIsLoadingAccountMeterReadings = CreateAction(
  reducerName,
  'SET_IS_LOADING_ACCOUNT_METER_READINGS',
);
export const setIsLoadingAccountMeterReadingsAction = setIsLoadingAccountMeterReadings.action;

const initialState = {
  meterReadings: [],
  isLoadingMeterReadings: false,
  isLoadingAccountMeters: false,
  accountMeters: [],
};

export const meterReadingsSelector = (rootReducer) => rootReducer.meterReadingsReducer;

export default function accountsReducer(state = initialState, action) {
  switch (action.type) {
    case setAccountMeterReadings.actionType:
      return {
        ...state,
        meterReadings: action.payload,
      };
    case setIsLoadingAccountMeterReadings.actionType:
      return {
        ...state,
        isLoadingMeterReadings: action.payload,
      };
    default:
      return state;
  }
}
