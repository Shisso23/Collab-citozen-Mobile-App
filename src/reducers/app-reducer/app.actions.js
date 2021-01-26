import RNBootSplash from 'react-native-bootsplash';
import { userAuthService } from '../../services';
import { setIsAuthenticatedAction } from '../user-auth-reducer/user-auth.reducer';

export const initAppAction = () => {
  return async (dispatch) => {
    const { doTokenExistInLocalStorage } = userAuthService;
    await dispatch(loadAppDataAction());
    const tokensExist = await doTokenExistInLocalStorage();
    if (tokensExist) {
      await dispatch(isAuthenticatedFlowAction());
    }
    RNBootSplash.hide({ fade: true });
  };
};

export const isAuthenticatedFlowAction = () => {
  return (dispatch) => {
    return Promise.all([dispatch(loadAppDataForSignedInUserAction())]).finally(() => {
      dispatch(setIsAuthenticatedAction(true));
    });
  };
};

export const loadAppDataAction = () => {
  return () => {
    return Promise.all([]);
  };
};

export const loadAppDataForSignedInUserAction = () => {
  return () => {
    return Promise.all([]);
  };
};
