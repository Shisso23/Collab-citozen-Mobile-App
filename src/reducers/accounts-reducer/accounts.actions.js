import _ from 'lodash';
import accountsService from '../../services/sub-services/accounts-service/accounts.service';
import {
  setAccountChannelsAction,
  setIsLoadingAccountChannelsAction,
  setIsLoadingAddAccountAction,
  setAddAccountAction,
  setDeleteccountAction,
  setIsLoadingDeleteAccountAction,
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
      const currentChannel = channels.find((channel) => _.get(channel, 'obj_id', '') === channelId);
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
      const currentChannel = channels.find((channel) => _.get(channel, 'obj_id', '') === channelId);
      const accounts = _.get(currentChannel, 'accounts', []);
      return accounts;
    })
    .finally(() => dispatch(setIsLoadingDeleteAccountAction(false)));
};

export default {
  addAccountAction,
  deleteAccountAction,
  getChannelsWithValidAccountsAction,
};
