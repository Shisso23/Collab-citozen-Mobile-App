import { contactsService } from '../../services';
import { setChannelsContactsAction, setIsLoadingChannelsContactsAction } from './contacts.reducer';

export const getChannelsContactsAction = (location) => async (dispatch) => {
  dispatch(setIsLoadingChannelsContactsAction(true));
  const channelsContacts = await contactsService.getChannelsContacts(location);
  dispatch(setChannelsContactsAction(channelsContacts));
  dispatch(setIsLoadingChannelsContactsAction(false));
  return channelsContacts;
};
