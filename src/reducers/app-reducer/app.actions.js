import { userAuthService } from '../../services';
import { setIsAuthenticatedAction } from '../user-auth-reducer/user-auth.reducer';

export const initAppAction = () => {
  return async (dispatch) => {
    const { doTokensExistInLocalStorage } = userAuthService;
    await dispatch(loadAppDataAction());
    const tokensExist = await doTokensExistInLocalStorage();
    if (tokensExist) {
      await dispatch(isAuthenticatedFlowAction());
    }
    // hide splash
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
