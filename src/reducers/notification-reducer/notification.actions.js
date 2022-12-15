import _ from 'lodash';
import moment from 'moment';
import {
  setIsLoadingAction,
  setNotificationAction,
  setUnOpenedNotificationsAction,
  setDeleteNotificationPreviewAction,
} from './notification.reducer';

import { notificationService } from '../../services';

export const getNotificationsAction = async () => {
  return async (dispatch) => {
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

export const openNotificationAction = async (notificationIds, dateTime, userId) => {
  return (dispatch) =>
    notificationService
      .openNotification(notificationIds, dateTime, userId)
      .then(() => dispatch(getUnOpenedNotificationsAction()));
};

export const deleteNotificationAction = async (notificationIds, dateTime, userId) => {
  return (dispatch) =>
    notificationService.deleteNotification(notificationIds, dateTime, userId).then(() => {
      const seenAt = moment(new Date()).format('yyyy-mm-DD hh:mm:ss');
      dispatch(openNotificationAction(notificationIds, seenAt, userId)).then(() => {
        dispatch(getUnOpenedNotificationsAction());
      });
    });
};

export const previewDeleNotificationAction = (shoudlPreview) => {
  return (dispatch) => dispatch(setDeleteNotificationPreviewAction(shoudlPreview));
};
