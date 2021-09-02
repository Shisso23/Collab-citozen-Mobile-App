import { contactsService } from '../../services';
import { setContactDetailsAction, setIsLoadingContactDetailsAction } from './contacts.reducer';

export const getContactDetailsAction = (location) => async (dispatch) => {
  dispatch(setIsLoadingContactDetailsAction(true));
  const contactDetails = await contactsService.getContactDetails(location);
  dispatch(setContactDetailsAction(contactDetails));
  dispatch(setIsLoadingContactDetailsAction(false));
  return contactDetails;
};
