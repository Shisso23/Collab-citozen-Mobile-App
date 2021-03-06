import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  createSrUrl: () => `${apiUrl}/Task/SaveNewTaskFeedback`,
  upLoadFile: () => `${apiUrl}/file/post`,
  viewSrImageUrl: (objId, fileId) => `${apiUrl}/File/Get?objid=${objId}&fileid=${fileId}`,
  deleteSRUrl: () => `${apiUrl}/Records/CreateUpdateRecord`,
  addNewComment: () => `${apiUrl}/Records/CreateUpdateRecord`,
  execFunctionUrl: () => `${apiUrl}/function/execfunction`,
};
