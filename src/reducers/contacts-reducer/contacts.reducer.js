import CreateAction from '../action-utilities/action-creator';

const reducerName = 'channelContacts';

const setChannelsContacts = CreateAction(reducerName, 'SET_CHANNELS_CONTACTS');
export const setChannelsContactsAction = setChannelsContacts.action;

const setIsLoadingChannelsContacts = CreateAction(reducerName, 'SET_IS_LOADING_CHANNELS_CONTACTS');
export const setIsLoadingChannelsContactsAction = setIsLoadingChannelsContacts.action;

const initialState = {
  channelsContacts: [],
  isLoadingChannelsContacts: false,
};

export const channelContactsSelector = (reducers) => reducers.channelContactsReducer;

export default function channelContactsReducer(state = initialState, action) {
  switch (action.type) {
    case setChannelsContacts.actionType:
      return {
        ...state,
        channelsContacts: action.payload,
      };
    case setIsLoadingChannelsContacts.actionType:
      return {
        ...state,
        isLoadingChannelsContacts: action.payload,
      };
    default:
      return state;
  }
}
