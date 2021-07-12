import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  notificationUrl: () => `${apiUrl}/notifications/`,
  seeNotificationUrl: () => `${apiUrl}/notifications/see`,
  hasUnseenUrl: () => `${apiUrl}/notifications/has_unseen`,
  deleteNotificationUrl: () => `${apiUrl}/notifications/delete`,
};
