import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  notificationUrl: () => `${apiUrl}/function/execfunction`,
  openNotificationUrl: () => `${apiUrl}/Records/CreateUpdateRecord`,
  deleteNotificationUrl: () => `${apiUrl}/Records/CreateUpdateRecord`,
  unOpenedNotificationsUrl: () => `${apiUrl}/function/execfunction`,
};
