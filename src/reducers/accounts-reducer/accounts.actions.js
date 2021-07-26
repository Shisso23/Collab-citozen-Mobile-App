import accountsService from '../../services/sub-services/accounts-service/accounts.service';
import {
  setAccountChannelsAction,
  setAccountStatementsAction,
  setIsLoadingAccountChannelsAction,
  setIsLoadingAccountStatementsAction,
  setIsLoadingAccountValidAction,
  setAccountValidAction,
} from './accounts.reducer';

export const getChannelsWithValidAccountsAction = () => (dispatch) => {
  dispatch(setIsLoadingAccountChannelsAction(true));
  return accountsService
    .getChannelsWithValidAccounts()
    .then((channels) => {
      dispatch(setAccountChannelsAction(channels));
    })
    .finally(() => dispatch(setIsLoadingAccountChannelsAction(false)));
};

export const getAccountStatementsAction = (accountId) => (dispatch) => {
  dispatch(setIsLoadingAccountStatementsAction(true));
  return accountsService
    .getAccountStatements(accountId)
    .then((statements) => {
      dispatch(setAccountStatementsAction(statements));
    })
    .finally(() => dispatch(setIsLoadingAccountStatementsAction(false)));
};

export const validateAccountAction = (channelId, userId, accountNumber) => (dispatch) => {
  dispatch(setIsLoadingAccountValidAction(true));
  return accountsService
    .validateAccount(channelId, userId, accountNumber)
    .then((response) => {
      dispatch(getChannelsWithValidAccountsAction());
      dispatch(setAccountValidAction(response));
      return response;
    })
    .finally(() => dispatch(setIsLoadingAccountValidAction(false)));
};

export default {
  validateAccountAction,
  getAccountStatementsAction,
  getChannelsWithValidAccountsAction,
};
