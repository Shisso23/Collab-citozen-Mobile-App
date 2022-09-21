import { setTabBarVisibleAction } from './navigation.reducer';

export const setTabBarVisibilityAction = async (visible) => async (dispatch) => {
  return dispatch(setTabBarVisibleAction(visible));
};
