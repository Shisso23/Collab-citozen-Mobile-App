import _ from 'lodash';

export const contactsModel = (_apiContactsModel = {}) => ({
  objId: _.get(_apiContactsModel, 'obj_id', ''),
  name: _.get(_apiContactsModel, 'contact_name', ''),
  number: _.get(_apiContactsModel, 'contact_number', ''),
  email: _.get(_apiContactsModel, 'contact_email', ''),
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
    return [];
  }
};
