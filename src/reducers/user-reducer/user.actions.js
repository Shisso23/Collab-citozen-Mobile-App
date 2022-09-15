import _ from 'lodash';
import { setUserAction } from './user.reducer';
import { flashService, userService } from '../../services';

export const getUserAction = () => async (dispatch) => {
  try {
    const user = await userService.getUser();
    dispatch(setUserAction(user));
  } catch (error) {
    flashService.error(_.get(error, 'message', ''));
  }
};
