import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  getChannelsWithAccountsUrl: () => `${apiUrl}/function/execfunction`,
  validateUrl: () => `${apiUrl}/Records/CreateUpdateRecord`,
  viewPdfUrl: (fileId, objectId) => `${apiUrl}/File/Get?objid=${objectId}&fileid=${fileId}`,
};
