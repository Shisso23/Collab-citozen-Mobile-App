import accountsNewService from '../../services/sub-services/accounts-service/accounts.new.service';
import {
  setAccountChannelsAction,
  setAccountStatementsAction,
  setIsLoadingAccountChannelsAction,
  setIsLoadingAccountStatementsAction,
  setIsLoadingAccountValidAction,
  setAccountValidAction,
} from './accounts_new.reducer';

export const getChannelsWithValidAccountsAction = () => (dispatch) => {
  dispatch(setIsLoadingAccountChannelsAction(true));
  return accountsNewService
    .getChannelsWithValidAccounts()
    .then((channels) => {
      dispatch(setAccountChannelsAction(channels));
    })
    .finally(() => dispatch(setIsLoadingAccountChannelsAction(false)));
};

export const getAccountStatementsAction = (accountId) => (dispatch) => {
  dispatch(setIsLoadingAccountStatementsAction(true));
  return accountsNewService
    .getAccountStatements(accountId)
    .then((statements) => {
      dispatch(setAccountStatementsAction(statements));
    })
    .finally(() => dispatch(setIsLoadingAccountStatementsAction(false)));
};

export const validateAccountAction = (email, accountNumber) => (dispatch) => {
  dispatch(setIsLoadingAccountValidAction, true);
  return accountsNewService
    .validateAccount(email, accountNumber)
    .then((isValid) => {
      dispatch(getChannelsWithValidAccountsAction());
      dispatch(setAccountValidAction(isValid));
    })
    .finally(() => dispatch(setIsLoadingAccountValidAction(false)));
};

export default {
  validateAccountAction,
  getAccountStatementsAction,
  getChannelsWithValidAccountsAction,
};
