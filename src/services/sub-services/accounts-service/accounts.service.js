import { accounts } from '../../../dummy-data/accounts';
import { mockRequest } from '../../../dummy-data/mock-api';
import { constructAccountModels } from '../../../models';

const getAccounts = () => {
  const url = '';
  return mockRequest(accounts)
    .get(url)
    .then((apiResponse) => constructAccountModels(apiResponse.data.Data));
};

export default {
  getAccounts,
};
