import _ from 'lodash';

import notificationUrls from './notification.urls';
import authNetworkService from '../auth-network-service/auth-network.service';
import {
  apiFunctionWithUniqName,
  createNotificationActivityData,
  notificationActivityData,
} from '../../../helpers/api-function-name.helper';
import { flashService } from '../../index';
import globalServiceUrls from '../global/global.service.urls';

export const getNotifications = async () => {
  const data = await apiFunctionWithUniqName('get_user_notifications');
  const notificationUrl = notificationUrls.notificationUrl();
  const returnNotification = (apiResponse) => _.get(apiResponse, 'data');
  return authNetworkService.post(notificationUrl, data).then((response) => {
    if (!_.get(response, 'data', false)) {
      flashService.info('There is currently no notifications.');
    }
    return returnNotification(response);
  });
};

export const openNotification = (notificationIds, dateTime, userId) => {
  let data;
  if (notificationIds.length === 1) {
    data = `<Objects>${notificationActivityData({
      notificationId: notificationIds[0],
      userId,
      action: 'Opened',
      dateTime,
    })}</Objects>`;
  } else {
    data = `<Objects>${notificationIds
      .map((id) =>
        notificationActivityData({
          notificationId: id,
          userId,
          action: 'Opened',
          dateTime,
        }),
      )
      .join('')}</Objects>`;
  }
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

const deleteNotification = async (notificationIds, dateTime, userId) => {
  let data;
  if (notificationIds.length === 1) {
    data = `<Objects>${notificationActivityData({
      notificationId: notificationIds[0],
      userId,
      action: 'Deleted',
      dateTime,
    })}</Objects>`;
  } else {
    data = `<Objects>${notificationIds
      .map((id) =>
        notificationActivityData({
          notificationId: id,
          userId,
          action: 'Deleted',
          dateTime,
        }),
      )
      .join('')}</Objects>`;
  }
  const deleteNotificationUrl = notificationUrls.deleteNotificationUrl();
  const response = await authNetworkService.post(deleteNotificationUrl, data);
  return response;
};

const createNotification = async (formData, channelRef) => {
  const data = formData.interestTypes.map((interestType) =>
    createNotificationActivityData({
      title: formData.title,
      description: formData.description,
      interestTypeRef: interestType.obj_id,
      channelRef,
    }),
  );
  const createNotificationUrl = globalServiceUrls.createUpdateRecordUrl();
  return Promise.all(
    data.map(async (notificationData) => {
      const response = await authNetworkService.post(createNotificationUrl, notificationData);
      return response;
    }),
  );
};

export default {
  getNotifications,
  openNotification,
  getUnOpenedNotifications,
  deleteNotification,
  createNotification,
};
