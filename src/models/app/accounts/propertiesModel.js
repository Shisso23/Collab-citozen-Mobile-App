import _ from 'lodash';

export const propertiesModel = (_apiAccountModel = {}) => ({
  id: _.get(_apiAccountModel, 'obj_id', ''),
  municipalityCode: _.get(_apiAccountModel, 'municipality_code', ''),
  number: _.get(_apiAccountModel, 'property_reference', ''),
  name: _.get(_apiAccountModel, 'property_name', ''),
  streetName: _.get(_apiAccountModel, 'street_name', ''),
  streetNumber: _.get(_apiAccountModel, 'street_number', ''),
  suburb: _.get(_apiAccountModel, 'suburb', ''),
  postalCode: _.get(_apiAccountModel, 'postal_code', ''),
});

export const constructAccountModels = (apiAccounts) =>
  apiAccounts.map((account) => propertiesModel(account));
