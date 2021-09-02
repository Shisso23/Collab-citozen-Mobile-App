import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  contactsUrl: () => `${apiUrl}/contacts`,
};
