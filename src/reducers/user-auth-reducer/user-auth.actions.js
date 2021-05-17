import { userAuthService } from '../../services';
import { setIsAuthenticatedAction, setIsLoadingAction } from './user-auth.reducer';

export const signOutAction = () => {
  return (dispatch) => {
    userAuthService.signOut().then(() => {
      dispatch(setIsAuthenticatedAction(false));
    });
  };
};

export const forogtPasswordAction = (formData) => {
  return (dispatch) => {
    dispatch(setIsLoadingAction(true));
    return userAuthService
      .forgotPassword(formData)
      .finally(() => dispatch(setIsLoadingAction(false)));
  };
};

export const RegisterAction = (formData) => {
  return (dispatch) => {
    dispatch(setIsLoadingAction(true));
    return userAuthService.register(formData).finally(() => dispatch(setIsLoadingAction(false)));
  };
};
