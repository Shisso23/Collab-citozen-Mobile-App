import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  subscribeToChannelsUrl: () => `${apiUrl}/Records/CreateUpdateRecord`,
};
