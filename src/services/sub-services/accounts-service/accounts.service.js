import _ from 'lodash';
import accountsUrls from './accounts.urls';

import {
  apiFunctionWithUniqName,
  dataValidateAccount,
} from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';

const getChannelsWithValidAccounts = async () => {
  const url = accountsUrls.getChannelsWithAccountsUrl();
  const data = await apiFunctionWithUniqName('get_accounts');
  const apiResponse = await authNetworkService.post(url, data);
  return _.get(apiResponse, 'data.Channels', null);
};

const getAccountStatements = async (accountId) => {
  const url = accountsUrls.statementsUrl();
  const apiResponse = await authNetworkService.post(url, { data: { accountId } });
  return _.get(apiResponse, 'data.statements', null);
};

const validateAccount = async (channelId, userId, accountNumber) => {
  const url = accountsUrls.validateUrl();
  const data = dataValidateAccount({ accountNumber, channelId, userId });
  const apiResponse = await authNetworkService.post(url, data);
  return _.get(apiResponse, 'data', null);
};

export default {
  getChannelsWithValidAccounts,
  getAccountStatements,
  validateAccount,
};
