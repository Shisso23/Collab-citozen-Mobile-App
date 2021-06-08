import CreateAction from '../action-utilities/action-creator';

const reducerName = 'user-auth';

const setIsLoading = CreateAction(reducerName, 'SET_IS_LOADING');
export const setIsLoadingAction = setIsLoading.action;

const setIsAuthenticated = CreateAction(reducerName, 'SET_IS_AUTHENTICATED');
export const setIsAuthenticatedAction = setIsAuthenticated.action;

const setIsServerOffline = CreateAction(reducerName, 'SET_SERVER-OFFLINE');
export const setIsServerOfflineAction = setIsServerOffline.action;

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isServerOffline: false,
};

export default function userAuthReducer(state = initialState, action) {
  switch (action.type) {
    case setIsAuthenticated.actionType:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case setIsLoading.actionType:
      return {
        ...state,
        isLoading: action.payload,
      };
    case setIsServerOffline.actionType:
      return {
        ...state,
        isServerOffline: action.payload,
      };
    default:
      return state;
  }
}
