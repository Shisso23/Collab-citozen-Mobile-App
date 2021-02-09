import _ from 'lodash';
import { constructAccountModels } from '../../../models';
import globalUrl from '../global/global.service.urls';
import { apiFunctionWithUniqName } from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';

const getAccounts = async () => {
  const url = globalUrl.globalFunctionUrl();
  const data = await apiFunctionWithUniqName('get_accounts');
  const apiResponse = await authNetworkService.post(url, data);
  const accounts = _.get(apiResponse.data, 'accounts', []);
  return constructAccountModels(accounts);
};

export default {
  getAccounts,
};
