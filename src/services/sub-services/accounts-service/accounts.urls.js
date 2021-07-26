import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  getChannelsWithAccountsUrl: () => `${apiUrl}/function/execfunction`,
  statementsUrl: () => `${apiUrl}/statements`,
  validateUrl: () => `${apiUrl}/validate`,
};
