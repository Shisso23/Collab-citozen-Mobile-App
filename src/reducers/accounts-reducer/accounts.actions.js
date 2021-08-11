import _ from 'lodash';
import accountsService from '../../services/sub-services/accounts-service/accounts.service';
import {
  setAccountChannelsAction,
  setIsLoadingAccountChannelsAction,
  setIsLoadingAddAccountAction,
  setAddAccountAction,
  setDeleteccountAction,
  setIsLoadingDeleteAccountAction,
  setAccountValidAction,
  setIsLoadingValidateAccountAction,
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

export const addAccountAction = (channelId, userId, accountNumber) => (dispatch) => {
  dispatch(setIsLoadingAddAccountAction(true));
  return accountsService
    .addAccount(channelId, userId, accountNumber)
    .then(async (response) => {
      dispatch(setAddAccountAction(response));
      const channels = await dispatch(getChannelsWithValidAccountsAction());
      const currentChannel = channels.find(
        (channel) => _.get(channel, 'objectId', '') === channelId,
      );
      const accounts = _.get(currentChannel, 'accounts', []);
      return accounts;
    })
    .finally(() => dispatch(setIsLoadingAddAccountAction(false)));
};

export const deleteAccountAction = (channelId, userId, accountNumber) => (dispatch) => {
  dispatch(setIsLoadingDeleteAccountAction(true));
  return accountsService
    .deleteAccount(channelId, userId, accountNumber)
    .then(async (response) => {
      dispatch(setDeleteccountAction(response));
      const channels = await dispatch(getChannelsWithValidAccountsAction());
      const currentChannel = channels.find(
        (channel) => _.get(channel, 'objectId', '') === channelId,
      );
      const accounts = _.get(currentChannel, 'accounts', []);
      return accounts;
    })
    .finally(() => dispatch(setIsLoadingDeleteAccountAction(false)));
};

export const validateAccountAction = (accountNumber, channelId) => (dispatch) => {
  dispatch(setIsLoadingValidateAccountAction(true));
  return accountsService
    .validateAccount(accountNumber, channelId)
    .then((response) => {
      const accountValid = _.get(response, 'Account_Validation', null)[0].account_valid || false;
      dispatch(setAccountValidAction(accountValid));
      return accountValid;
    })
    .finally(() => dispatch(setIsLoadingValidateAccountAction(false)));
};

export default {
  addAccountAction,
  deleteAccountAction,
  getChannelsWithValidAccountsAction,
  validateAccountAction,
};
