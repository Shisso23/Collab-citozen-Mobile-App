import { setUserAction } from './user.reducer';
import { flashService, userService } from '../../services';

export const getUserAction = () => async (dispatch) => {
  try {
    const user = await userService.getUser();
    console.log({ user });
    dispatch(setUserAction(user));
  } catch (error) {
    flashService.error(error.message);
  }
};
