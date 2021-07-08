import CreateAction from '../action-utilities/action-creator';

const reducerName = 'unsubscribedChannels';

const setUnsubscribedChannels = CreateAction(reducerName, 'SET_MUNICIPALITIES');
export const setUnsubscribedChannelsAction = setUnsubscribedChannels.action;

const initialState = {
  unsubscribedChannels: [],
};

export const unsubscribedChannelsSelector = (reducers) => reducers.unsubscribedChannelsReducer;

export default function unsubscribedChannelsReducer(state = initialState, action) {
  switch (action.type) {
    case setUnsubscribedChannels.actionType:
      return {
        ...state,
        unsubscribedChannels: action.payload,
      };
    default:
      return state;
  }
}
