import _ from 'lodash';

export const accountsModel = (_apiAccountModel = {}) => ({
  id: _.get(_apiAccountModel, 'obj_id', ''),
  municipalityCode: _.get(_apiAccountModel, 'municipality_code', ''),
  number: _.get(_apiAccountModel, 'account_number', ''),
  name: _.get(_apiAccountModel, 'account_name', ''),
  streetName: _.get(_apiAccountModel, 'street_name', ''),
  streetNumber: _.get(_apiAccountModel, 'street_number', ''),
  suburb: _.get(_apiAccountModel, 'suburb', ''),
  postalCode: _.get(_apiAccountModel, 'postal_code', ''),
});

export const constructAccountModels = (apiAccounts) =>
  apiAccounts.map((account) => accountsModel(account));
