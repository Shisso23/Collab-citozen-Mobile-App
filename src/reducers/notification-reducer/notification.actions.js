import _ from 'lodash';
import {
  setIsLoadingAction,
  setNotificationAction,
  setUnOpenedNotificationsAction,
  setDeleteNotificationPreviewAction,
} from './notification.reducer';

import { notificationService } from '../../services';

export const getNotificationsAction = () => {
  return (dispatch) => {
    dispatch(setIsLoadingAction(true));
    return notificationService
      .getNotifications()
      .then((notification) => dispatch(setNotificationAction(notification)))
      .finally(() => dispatch(setIsLoadingAction(false)));
  };
};

export const getUnOpenedNotificationsAction = () => {
  return (dispatch) => {
    return notificationService.getUnOpenedNotifications().then((unOpenedNotifications) => {
      const count = _.get(unOpenedNotifications, 'Count', []).reduce(
        (totalNotifications, notification) => {
          totalNotifications += _.get(notification, 'unopened_notifications_count', 0);
          return totalNotifications;
        },
        0,
      );
      return dispatch(setUnOpenedNotificationsAction(count));
    });
  };
};

export const openNotificationAction = (notificationId, dateTime, userId) => {
  return (dispatch) =>
    notificationService
      .openNotification(notificationId, dateTime, userId)
      .then(() => dispatch(getUnOpenedNotificationsAction()));
};

export const deleteNotificationAction = (notificationId, dateTime, userId) => {
  return (dispatch) =>
    notificationService
      .deleteNotification(notificationId, dateTime, userId)
      .then(() => dispatch(getNotificationsAction()));
};

export const previewDeleNotificationAction = (shoudlPreview) => {
  return (dispatch) => dispatch(setDeleteNotificationPreviewAction(shoudlPreview));
};
