import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  getMeterReadingsUrl: () => `${apiUrl}/function/execfunction`,
  submitMeterReadingsUrl: () => `${apiUrl}/Records/CreateUpdateRecord`,
  upLoadFile: () => `${apiUrl}/file/post`,
};
