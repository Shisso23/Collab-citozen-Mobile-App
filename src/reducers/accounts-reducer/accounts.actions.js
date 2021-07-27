import _ from 'lodash';
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
      return channels;
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
    .then(async (response) => {
      dispatch(setAccountValidAction(response));
      const channels = await dispatch(getChannelsWithValidAccountsAction());
      const currentChannel = channels.find((channel) => _.get(channel, 'obj_id', '') === channelId);
      const accounts = _.get(currentChannel, 'accounts', []);
      return accounts;
    })
    .finally(() => dispatch(setIsLoadingAccountValidAction(false)));
};

export default {
  validateAccountAction,
  getAccountStatementsAction,
  getChannelsWithValidAccountsAction,
};
