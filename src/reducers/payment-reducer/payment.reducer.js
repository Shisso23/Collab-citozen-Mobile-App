import CreateAction from '../action-utilities/action-creator';

const reducerName = 'payment';

const setPayAtToken = CreateAction(reducerName, 'SET-PAYAT-TOKEN');
export const setPayAtTokenAction = setPayAtToken.action;
const setIsLoadingGetPayAtToken = CreateAction(reducerName, 'SET-IS-LOADING-GET-PAYAT-TOKEN');
export const setIsLoadingGetPayAtTokenAction = setIsLoadingGetPayAtToken.action;
const initialState = {
  payAtAuthToken: null,
  isLoadingGetPayAtToken: false,
};

export default function paymentReducer(state = initialState, action) {
  switch (action.type) {
    case setPayAtTokenAction.actionType:
      return {
        ...state,
        payAtAuthToken: action.payload,
      };
    case setIsLoadingGetPayAtTokenAction.actionType:
      return {
        ...state,
        isLoadingGetPayAtToken: action.payload,
      };
    default:
      return state;
  }
}
