import CreateAction from '../action-utilities/action-creator';

const reducerName = 'accounts';

const setAccountChannels = CreateAction(reducerName, 'SET_ACCOUNT_CHANNELS');
export const setAccountChannelsAction = setAccountChannels.action;

const setIsLoadingAccountChannels = CreateAction(reducerName, 'SET_IS_LOADING_ACCOUNT_CHANNELS');
export const setIsLoadingAccountChannelsAction = setIsLoadingAccountChannels.action;

const setAccountStatements = CreateAction(reducerName, 'SET_ACCOUNT_STATEMENTS');
export const setAccountStatementsAction = setAccountStatements.action;

const setIsLoadingAccountStatements = CreateAction(
  reducerName,
  'SET_IS_LOADING_ACCOUNT_STATEMENTS',
);
export const setIsLoadingAccountStatementsAction = setIsLoadingAccountStatements.action;

const setAccountValid = CreateAction(reducerName, 'SET_ACCOUNT_VALID');
export const setAccountValidAction = setAccountValid.action;

const setIsLoadingAccountValid = CreateAction(reducerName, 'SET_IS_LOADING_ACCOUNT_VALID');
export const setIsLoadingAccountValidAction = setIsLoadingAccountValid.action;

const initialState = {
  accountChannels: [],
  isLoadingAccountChannels: false,
  isLoadingAccountStatements: false,
  isLoadingAccountValid: false,
  statements: [],
  accountValid: false,
};

export const accountsSelector = (rootReducer) => rootReducer.accountsReducer;

export default function accountsReducer(state = initialState, action) {
  switch (action.type) {
    case setAccountStatements.actionType:
      return {
        ...state,
        statements: action.payload,
      };
    case setIsLoadingAccountStatements.actionType:
      return {
        ...state,
        isLoadingAccountStatements: action.payload,
      };

    case setAccountChannels.actionType:
      return {
        ...state,
        accountChannels: action.payload,
      };
    case setIsLoadingAccountChannels.actionType:
      return {
        ...state,
        isLoadingAccountChannels: action.payload,
      };
    case setIsLoadingAccountValid.actionType:
      return {
        ...state,
        isLoadingAccountValid: action.payload,
      };
    case setAccountValid.actionType:
      return {
        ...state,
        accountValid: action.payload,
      };
    default:
      return state;
  }
}
