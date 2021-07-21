import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  getChannelsWithAccountsUrl: () => `${apiUrl}/channels`,
  statementsUrl: () => `${apiUrl}/statements`,
  validateUrl: () => `${apiUrl}/validate`,
};
