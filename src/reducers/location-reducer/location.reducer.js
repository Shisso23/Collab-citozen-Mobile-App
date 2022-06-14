import CreateAction from '../action-utilities/action-creator';

const reducerName = 'location';

const setRegion = CreateAction(reducerName, 'SET_REGION');
export const setRegionAction = setRegion.action;

const setIsLoading = CreateAction(reducerName, 'SET_IS_LOADING');
export const setIsLoadingAction = setIsLoading.action;

const setIsLoadingAddress = CreateAction(reducerName, 'SET_IS_LOADING_ADDRESS');
export const setIsLoadingAddressAction = setIsLoadingAddress.action;

const setSelectedAddress = CreateAction(reducerName, 'SET_SELECTED_ADDRESS');
export const setSelectedAddressAction = setSelectedAddress.action;

const initialState = {
  isLoading: false,
  region: null,
  selectedAddress: '',
  isLoadingAddress: false,
};

export const locationSelector = (reducers) => reducers.locationReducer;

export default function locationReducer(state = initialState, action) {
  switch (action.type) {
    case setRegion.actionType:
      return {
        ...state,
        region: action.payload,
      };
    case setIsLoading.actionType:
      return {
        ...state,
        isLoading: action.payload,
      };

    case setIsLoadingAddress.actionType:
      return {
        ...state,
        isLoadingAddress: action.payload,
      };

    case setSelectedAddress.actionType:
      return {
        ...state,
        selectedAddress: action.payload,
      };
    default:
      return state;
  }
}
