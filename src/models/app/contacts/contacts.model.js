import _ from 'lodash';

export const contactsModel = (_apiContactsModel = {}) => ({
  name: _.get(_apiContactsModel, 'name', ''),
  number: _.get(_apiContactsModel, 'number', ''),
});
