import {
  setIsLoadingAction,
  setNotificationAction,
  setUnOpenedNotificationsAction,
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
    return notificationService
      .getUnOpenedNotifications()
      .then((unOpenedNotifications) =>
        dispatch(setUnOpenedNotificationsAction(unOpenedNotifications)),
      );
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
