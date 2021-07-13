import {
  setIsLoadingAction,
  setNotificationAction,
  setUnseenNotificationsAction,
} from './notification.reducer';
import { notificationService } from '../../services';

export const getNotification = () => {
  return (dispatch) => {
    dispatch(setIsLoadingAction(true));
    return notificationService
      .getNotification()
      .then((notification) => dispatch(setNotificationAction(notification)))
      .finally(() => dispatch(setIsLoadingAction(false)));
  };
};

export const getUnseenNotificationAction = () => {
  return (dispatch) => {
    return notificationService
      .getUnseenNotification()
      .then((unseenNotifications) => dispatch(setUnseenNotificationsAction(unseenNotifications)));
  };
};

export const seeNotification = (notificationLinkId) => {
  return (dispatch) =>
    notificationService
      .seeNotification(notificationLinkId)
      .then(() => dispatch(getUnseenNotificationAction()));
};

export const deleteNotification = (notificationId) => {
  return (dispatch) =>
    notificationService.deleteNotification(notificationId).then(() => dispatch(getNotification()));
};
