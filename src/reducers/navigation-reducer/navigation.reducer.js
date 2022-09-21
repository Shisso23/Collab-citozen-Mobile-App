import CreateAction from '../action-utilities/action-creator';

const reducerName = 'navigation';

const setTabBarVisible = CreateAction(reducerName, 'SET_TAB_BAR_VISIBLE');
export const setTabBarVisibleAction = setTabBarVisible.action;

const initialState = {
  tabBarVisible: true,
};

export const navigationSelector = (reducers) => reducers.navigationReducer;

export default function navigationReducer(state = initialState, action) {
  switch (action.type) {
    case setTabBarVisible.actionType:
      return {
        ...state,
        tabBarVisible: action.payload,
      };
    default:
      return state;
  }
}
