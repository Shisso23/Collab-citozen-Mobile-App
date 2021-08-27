import CreateAction from '../action-utilities/action-creator';

const reducerName = 'accounts';

const setAccountChannels = CreateAction(reducerName, 'SET_ACCOUNT_CHANNELS');
export const setAccountChannelsAction = setAccountChannels.action;

const setIsLoadingAccountChannels = CreateAction(reducerName, 'SET_IS_LOADING_ACCOUNT_CHANNELS');
export const setIsLoadingAccountChannelsAction = setIsLoadingAccountChannels.action;

const setAddAccount = CreateAction(reducerName, 'SET_ADD_ACCOUNT');
export const setAddAccountAction = setAddAccount.action;

const setIsLoadingAddAccount = CreateAction(reducerName, 'SET_IS_LOADING_ADD_ACCOUNT');
export const setIsLoadingAddAccountAction = setIsLoadingAddAccount.action;

const setDeleteAccount = CreateAction(reducerName, 'SET_DELETE_ACCOUNT');
export const setDeleteccountAction = setDeleteAccount.action;

const setIsLoadingDeleteAccount = CreateAction(reducerName, 'SET_IS_LOADING_DELETE_ACCOUNT');
export const setIsLoadingDeleteAccountAction = setIsLoadingDeleteAccount.action;

const setAccountValid = CreateAction(reducerName, 'SET_ACCOUNT_VALID');
export const setAccountValidAction = setAccountValid.action;

const setIsLoadingValidateAccount = CreateAction(reducerName, 'SET_IS_LOADING_VALIDATE_ACCOUNT');
export const setIsLoadingValidateAccountAction = setIsLoadingValidateAccount.action;

const setDeleteAccountPreview = CreateAction(reducerName, 'SET_DELETE_ACCOUNT_PREVIEW');
export const setDeleteAccountPreviewAction = setDeleteAccountPreview.action;

const initialState = {
  accountChannels: [],
  isLoadingAccountChannels: false,
  isLoadingAccountStatements: false,
  isLoadingAddAccount: false,
  isLoadingDeleteAccount: false,
  statements: [],
  accountValid: null,
  isLoadingValidateAccount: false,
  deleteAccountPreview: true,
  account: false,
};

export const accountsSelector = (rootReducer) => rootReducer.accountsReducer;

export default function accountsReducer(state = initialState, action) {
  switch (action.type) {
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
    case setIsLoadingAddAccount.actionType:
      return {
        ...state,
        isLoadingAddAccount: action.payload,
      };
    case setAddAccount.actionType:
      return {
        ...state,
        account: action.payload,
      };
    case setDeleteAccount.actionType:
      return {
        ...state,
        account: action.payload,
      };
    case setIsLoadingDeleteAccount.actionType:
      return {
        ...state,
        isLoadingDeleteAccount: action.payload,
      };

    case setIsLoadingValidateAccount.actionType:
      return {
        ...state,
        isLoadingValidateAccount: action.payload,
      };
    case setAccountValid.actionType:
      return {
        ...state,
        accountValid: action.payload,
      };
    case setDeleteAccountPreview.actionType:
      return {
        ...state,
        deleteAccountPreview: action.payload,
      };
    default:
      return state;
  }
}
