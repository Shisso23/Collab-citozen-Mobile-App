import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  createSrUrl: () => `${apiUrl}/Task/SaveNewTaskFeedback`,
};
