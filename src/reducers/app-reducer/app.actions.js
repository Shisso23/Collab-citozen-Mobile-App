import RNBootSplash from 'react-native-bootsplash';

import { userAuthService } from '../../services';
import { getAccountsPropertyAction } from '../accounts-reducer/accountProperties.actions';
import {
  setIsAuthenticatedAction,
  setIsServerOfflineAction,
} from '../user-auth-reducer/user-auth.reducer';
import { getUserAction } from '../user-reducer/user.actions';
import { getMyChannelsAction } from '../my-channels/my-channels.actions';

export const initAppAction = () => {
  return async (dispatch) => {
    const { doTokenExistInLocalStorage } = userAuthService;
    await dispatch(loadAppDataAction());
    const tokensExist = await doTokenExistInLocalStorage();
    if (tokensExist) {
      await dispatch(getMyChannelsAction());
      dispatch(isAuthenticatedFlowAction()).catch(() => {
        dispatch(setIsServerOfflineAction(true));
        dispatch(setIsAuthenticatedAction(false));
      });
    }
    setTimeout(() => {
      RNBootSplash.hide({ fade: true });
    }, 5500); // force process to run a bit later.
    // ensures that the login screen is not shown when the user is authenticated.
  };
};

export const isAuthenticatedFlowAction = () => {
  return (dispatch) => {
    return Promise.all([dispatch(loadAppDataForSignedInUserAction())]).finally(() => {
      dispatch(setIsAuthenticatedAction(true));
      dispatch(setIsServerOfflineAction(false));
    });
  };
};

export const loadAppDataAction = () => {
  return () => {
    return Promise.all([]);
  };
};

export const loadAppDataForSignedInUserAction = () => {
  return (dispatch) => {
    return Promise.all([dispatch(getUserAction()), dispatch(getAccountsPropertyAction())]);
  };
};
