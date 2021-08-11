import _ from 'lodash';
import accountsUrls from './accounts.urls';

import {
  apiFunctionWithUniqName,
  dataCreateRecord,
  dataValidateAccount,
} from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';
import { constructChannelModels } from '../../../models/app/accounts/account-channels.model';

const getChannelsWithValidAccounts = async () => {
  const url = accountsUrls.execFunctionUrl();
  const data = await apiFunctionWithUniqName('get_accounts');
  const apiResponse = await authNetworkService.post(url, data);
  const channelsModel = constructChannelModels(_.get(apiResponse, 'data.Channels', []));
  return channelsModel;
};

const addAccount = async (channelId, userId, accountNumber) => {
  const url = accountsUrls.createRecordUrl();
  const data = dataCreateRecord({ accountNumber, channelId, userId, status: 'Requested' });
  const apiResponse = await authNetworkService.post(url, data);
  return _.get(apiResponse, 'data', null);
};

const deleteAccount = async (channelId, userId, accountNumber) => {
  const url = accountsUrls.createRecordUrl();
  const data = dataCreateRecord({ accountNumber, channelId, userId, status: 'Deleted' });
  const apiResponse = await authNetworkService.post(url, data);
  return _.get(apiResponse, 'data', null);
};

const validateAccount = async (accountNumber, channelId) => {
  const url = accountsUrls.execFunctionUrl();
  const data = await dataValidateAccount({ channelId, accountNumber });
  const apiResponse = await authNetworkService.post(url, data);
  return _.get(apiResponse, 'data', null);
};

export default {
  getChannelsWithValidAccounts,
  addAccount,
  deleteAccount,
  validateAccount,
};
