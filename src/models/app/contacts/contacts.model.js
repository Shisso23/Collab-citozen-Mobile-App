import _ from 'lodash';

export const contactsModel = (_apiContactsModel = {}) => ({
  name: _.get(_apiContactsModel, 'name', ''),
  number: _.get(_apiContactsModel, 'number', ''),
});

export const constructContactsModels = (apiContacts) =>
  apiContacts.map((contact) => contactsModel(contact));
