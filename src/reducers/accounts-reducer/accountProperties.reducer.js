import CreateAction from '../action-utilities/action-creator';

const reducerName = 'accounts';

const setAccounts = CreateAction(reducerName, 'SET_ACCOUNTS');
export const setAccountsAction = setAccounts.action;

const setIsLoadingAccountsRequest = CreateAction(reducerName, 'SET_IS_LOADING_ACCOUNT_REQUESTS');
export const setIsLoadingAccountsRequestAction = setIsLoadingAccountsRequest.action;

const initialState = {
  accounts: [],
  isLoadingAccountsRequest: false,
};

export const accountsPropertySelector = (rootReducer) => rootReducer.accountsReducer;

export default function accountsPropertyReducer(state = initialState, action) {
  switch (action.type) {
    case setAccounts.actionType:
      return {
        ...state,
        accounts: action.payload,
      };
    case setIsLoadingAccountsRequest.actionType:
      return {
        ...state,
        isLoadingAccountsRequest: action.payload,
      };
    default:
      return state;
  }
}
