import CreateAction from '../action-utilities/action-creator';

const reducerName = 'accounts';

const setAccounts = CreateAction(reducerName, 'SET_ACCOUNTS');
export const setAccountsAction = setAccounts.action;

const initialState = {
  accounts: [],
};

export const accountsSelector = (rootReducer) => rootReducer.accountsReducer;

export default function accountsReducer(state = initialState, action) {
  switch (action.type) {
    case setAccounts.actionType:
      return {
        ...state,
        accounts: action.payload,
      };
    default:
      return state;
  }
}
