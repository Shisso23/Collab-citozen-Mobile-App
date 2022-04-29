import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  newsFeedActivityUrl: () => `${apiUrl}/Records/CreateUpdateRecord`,
  execFunctionUrl: () => `${apiUrl}/function/execfunction`,
};
