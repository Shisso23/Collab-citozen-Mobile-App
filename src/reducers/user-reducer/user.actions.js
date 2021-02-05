import { setUserAction } from './user.reducer';
import { flashService, userService } from '../../services';

export const getUserAction = () => async (dispatch) => {
  try {
    const user = await userService.getUser();
    dispatch(setUserAction(user));
  } catch (error) {
    flashService.error(error.message);
  }
};
