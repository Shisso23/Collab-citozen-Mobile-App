import { setUserAction } from './user.reducer';
import { flashService, firebaseService, userService } from '../../services';

export const getUserAction = () => async (dispatch) => {
  try {
    const user = await userService.getUser();
    dispatch(setUserAction(user));
  } catch (error) {
    flashService.error(error.message);
  }
};

export const updateFirebaseToken = () => {
  return () => {
    return firebaseService.getAndSetToken().then((firebaseToken) => {
      return userService.updateUserProfile({ firebaseToken });
    });
  };
};
