import _ from 'lodash';
import accountsUrls from './accounts.urls';

import {
  apiFunctionWithUniqName,
  dataValidateAccount,
} from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';
import { constructChannelModels } from '../../../models/app/accounts/account-channels.model';

const getChannelsWithValidAccounts = async () => {
  const url = accountsUrls.getChannelsWithAccountsUrl();
  const data = await apiFunctionWithUniqName('get_accounts');
  const apiResponse = await authNetworkService.post(url, data);
  const channelsModel = constructChannelModels(_.get(apiResponse, 'data.Channels', []));
  return channelsModel;
};

const validateAccount = async (channelId, userId, accountNumber) => {
  const url = accountsUrls.validateUrl();
  const data = dataValidateAccount({ accountNumber, channelId, userId });
  const apiResponse = await authNetworkService.post(url, data);
  return _.get(apiResponse, 'data', null);
};

export default {
  getChannelsWithValidAccounts,
  validateAccount,
};
