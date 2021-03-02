import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  createSrUrl: () => `${apiUrl}/Task/SaveNewTaskFeedback`,
  viewSrImageUrl: (objId, fileId) => `${apiUrl}/File/Get?objid=${objId}&fileid=${fileId}`,
};
