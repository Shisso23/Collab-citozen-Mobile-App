import CreateAction from '../action-utilities/action-creator';

const reducerName = 'myChannels';

const setMyChannels = CreateAction(reducerName, 'SET_MY_CHANNELS');
export const setMyChannelsAction = setMyChannels.action;

const setIsLoadingMyChannels = CreateAction(reducerName, 'SET_IS_LOADING_MY_CHANNELS');
export const setIsLoadingMyChannelsAction = setIsLoadingMyChannels.action;

const initialState = {
  myChannels: [],
  isLoadingMyChannels: false,
};

export const myChannelsSelector = (reducers) => reducers.myChannelsReducer;

export default function newsFeedsReducer(state = initialState, action) {
  switch (action.type) {
    case setMyChannels.actionType:
      return {
        ...state,
        myChannels: action.payload,
      };
    case setIsLoadingMyChannels.actionType:
      return {
        ...state,
        isLoadingMyChannels: action.payload,
      };
    default:
      return state;
  }
}
