import CreateAction from '../action-utilities/action-creator';

const reducerName = 'contacts';

const setContactDetails = CreateAction(reducerName, 'SET_CONTACTS_DETAILS');
export const setContactDetailsAction = setContactDetails.action;

const setIsLoadingContactDetails = CreateAction(reducerName, 'SET_IS_LOADING_CONTACTS_DETAILS');
export const setIsLoadingContactDetailsAction = setIsLoadingContactDetails.action;

const initialState = {
  contactDetails: [],
  isLoadingContactDetails: false,
};

export const contactsSelector = (reducers) => reducers.contactsReducer;

export default function contactsReducer(state = initialState, action) {
  switch (action.type) {
    case setContactDetails.actionType:
      return {
        ...state,
        contactDetails: action.payload,
      };
    case setIsLoadingContactDetails:
      return {
        ...state,
        isLoadingContactDetails: action.payload,
      };
    default:
      return state;
  }
}
