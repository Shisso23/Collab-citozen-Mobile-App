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
  setDeleteAccountPreviewAction,
} from './accounts.reducer';

export const getChannelsWithValidAccountsAction = (userData) => (dispatch) => {
  dispatch(setIsLoadingAccountChannelsAction(true));
  return accountsService
    .getChannelsWithValidAccounts(userData)
    .then((channels) => {
      dispatch(setAccountChannelsAction(channels));
      return channels;
    })
    .catch((error) => error)
    .finally(() => dispatch(setIsLoadingAccountChannelsAction(false)));
};

export const addAccountAction = (channelId, user, accountNumber) => (dispatch) => {
  const userId = _.get(user, 'user_id', '');
  dispatch(setIsLoadingAddAccountAction(true));
  return accountsService
    .addAccount(channelId, userId, accountNumber)
    .then(async (response) => {
      dispatch(setAddAccountAction(response));
      const channels = await dispatch(getChannelsWithValidAccountsAction(user));
      const currentChannel = channels.find(
        (channel) => _.get(channel, 'objectId', '') === channelId,
      );
      const accounts = _.get(currentChannel, 'accounts', []);
      return accounts;
    })
    .finally(() => dispatch(setIsLoadingAddAccountAction(false)));
};

export const deleteAccountAction = (channelId, user, accountNumber) => (dispatch) => {
  const userId = _.get(user, 'user_id', '');
  dispatch(setIsLoadingDeleteAccountAction(true));
  return accountsService
    .deleteAccount(channelId, userId, accountNumber)
    .then(async (response) => {
      dispatch(setDeleteccountAction(response));
      const channels = await dispatch(getChannelsWithValidAccountsAction(user));
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

export const previewDeleAccountAction = (shoudlPreview) => {
  return (dispatch) => dispatch(setDeleteAccountPreviewAction(shoudlPreview));
};

export default {
  addAccountAction,
  deleteAccountAction,
  getChannelsWithValidAccountsAction,
  validateAccountAction,
  previewDeleAccountAction,
};
