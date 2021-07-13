import _ from 'lodash';

import notificationUrls from './notification.urls';
// import authNetworkService from '../auth-network-service/auth-network.service';
import { mockApi } from '../../../mock-api/api';

export const getNotification = () => {
  const notificationUrl = notificationUrls.notificationUrl();
  const returnNotification = (apiResponse) => _.get(apiResponse, 'data');
  return mockApi.get(notificationUrl).then((response) => {
    return returnNotification(response);
  });
};

export const seeNotification = (notificationLinkId) => {
  const seeNotificationUrl = notificationUrls.seeNotificationUrl(notificationLinkId);
  return mockApi.get(seeNotificationUrl);
};

export const getUnseenNotification = () => {
  const hasUnseenNotificationUrl = notificationUrls.hasUnseenUrl();
  const returnHasUnseen = (apiResponse) => _.get(apiResponse, 'data');
  return mockApi.get(hasUnseenNotificationUrl).then(returnHasUnseen);
};

const deleteNotification = (notificationId) => {
  const deleteNotificationUrl = notificationUrls.deleteNotificationUrl(notificationId);
  return mockApi.delete(deleteNotificationUrl);
};

export default {
  getNotification,
  seeNotification,
  getUnseenNotification,
  deleteNotification,
};
