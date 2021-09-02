import { contactsService } from '../../services';
import { setContactDetailsAction, setIsLoadingContactDetailsAction } from './contacts.reducer';

export const getContactDetailsAction = (location) => async (dispatch) => {
  dispatch(setIsLoadingContactDetailsAction(true));
  const contactDetails = await dispatch(
    setContactDetailsAction(contactsService.getContactDetails(location)),
  );
  dispatch(setIsLoadingContactDetailsAction(false));
  return contactDetails;
};
