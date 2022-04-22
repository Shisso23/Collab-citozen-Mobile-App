import _ from 'lodash';
import { flashService } from '../../../services';

export const contactsModel = (_apiContactsModel = {}) => ({
  objId: _.get(_apiContactsModel, 'obj_id', ''),
  name: _.get(_apiContactsModel, 'contact_name', ''),
  number: _.get(_apiContactsModel, 'contact_number', ''),
  email: _.get(_apiContactsModel, 'contact_email', ''),
  facebook: _.get(_apiContactsModel, 'facebook_account', ''),
  twitter: _.get(_apiContactsModel, 'twitter_account', ''),
  whatsapp: _.get(_apiContactsModel, 'whatsapp_number', ''),
  sms: _.get(_apiContactsModel, 'sms_number', ''),
  website: _.get(_apiContactsModel, 'website', ''),
});

export const constructContactsModels = (apiContacts) =>
  apiContacts.map((contact) => contactsModel(contact));

export const contactsChannelsModel = (_contactsChannelsModel = {}) => ({
  objId: _.get(_contactsChannelsModel, 'obj_id', ''),
  name: _.get(_contactsChannelsModel, 'name', ''),
  code: _.get(_contactsChannelsModel, 'code', ''),
  contacts: constructContactsModels(_.get(_contactsChannelsModel, 'contacts', '')),
});

export const constructContactsChannelsModel = (apiContactsChannelsModel) => {
  try {
    return apiContactsChannelsModel.map((channelContacts) =>
      contactsChannelsModel(channelContacts),
    );
  } catch (error) {
    flashService.info('No contacts information available!');
    return [];
  }
};
