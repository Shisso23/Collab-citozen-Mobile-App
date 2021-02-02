import RNBootSplash from 'react-native-bootsplash';
import { userAuthService } from '../../services';
import { getAccountsAction } from '../accounts-reducer/accounts.actions';
import { getMunicipalitiesAction } from '../municipalities-reducer/municipalities.actions';
import { setIsAuthenticatedAction } from '../user-auth-reducer/user-auth.reducer';
import { getUserAction } from '../user-reducer/user.actions';

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
  return (dispatch) => {
    return Promise.all([
      dispatch(getUserAction()),
      dispatch(getAccountsAction()),
      dispatch(getMunicipalitiesAction()),
    ]);
  };
};
