import CreateAction from '../action-utilities/action-creator';

const reducerName = 'notification';

const setNotification = CreateAction(reducerName, 'SET_NOTIFICATION');
export const setNotificationAction = setNotification.action;

const setIsLoading = CreateAction(reducerName, 'SET_IS_LOADING');
export const setIsLoadingAction = setIsLoading.action;

const setUnOpenedNotifications = CreateAction(reducerName, 'SET_UNOPENED_NOTIFICATIONS');
export const setUnOpenedNotificationsAction = setUnOpenedNotifications.action;

const initialState = {
  notifications: [],
  isLoading: false,
  unOpenedNotifications: {},
};

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case setNotification.actionType:
      return {
        ...state,
        notifications: action.payload,
      };
    case setIsLoading.actionType:
      return {
        ...state,
        isLoading: action.payload,
      };
    case setUnOpenedNotifications.actionType:
      return {
        ...state,
        unOpenedNotifications: action.payload,
      };
    default:
      return state;
  }
}
