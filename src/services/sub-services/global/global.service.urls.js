import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  globalFunctionUrl: () => `${apiUrl}/Function/execFunction`,
  createUpdateRecordUrl: () => `${apiUrl}/Records/CreateUpdateRecord`,
};
