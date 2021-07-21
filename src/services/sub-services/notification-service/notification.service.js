import _ from 'lodash';

import notificationUrls from './notification.urls';
import authNetworkService from '../auth-network-service/auth-network.service';
import {
  apiFunctionWithUniqName,
  notificationActivityData,
} from '../../../helpers/api-function-name.helper';

export const getNotifications = async () => {
  const data = await apiFunctionWithUniqName('get_user_notifications');
  const notificationUrl = notificationUrls.notificationUrl();
  const returnNotification = (apiResponse) => _.get(apiResponse, 'data');
  return authNetworkService.post(notificationUrl, data).then((response) => {
    return returnNotification(response);
  });
};

export const openNotification = async (notificationId, dateTime, userId) => {
  const data = notificationActivityData({
    notificationId,
    userId,
    action: 'Opened',
    dateTime,
  });
  const openNotificationUrl = notificationUrls.openNotificationUrl();
  return authNetworkService.post(openNotificationUrl, data).then((response) => {
    return response;
  });
};

export const getUnOpenedNotifications = async () => {
  const data = await apiFunctionWithUniqName('get_unopened_notifications_count');
  const unOpenedNotificationUrl = notificationUrls.unOpenedNotificationsUrl();
  const unOpenedNotifications = (apiResponse) => _.get(apiResponse, 'data');

  const response = await authNetworkService
    .post(unOpenedNotificationUrl, data)
    .then(unOpenedNotifications);
  return response;
};

const deleteNotification = async (notificationId, dateTime, userId) => {
  const data = notificationActivityData({
    notificationId,
    userId,
    action: 'Deleted',
    dateTime,
  });
  const deleteNotificationUrl = notificationUrls.deleteNotificationUrl();
  const response = await authNetworkService.post(deleteNotificationUrl, data);
  return response;
};

export default {
  getNotifications,
  openNotification,
  getUnOpenedNotifications,
  deleteNotification,
};
