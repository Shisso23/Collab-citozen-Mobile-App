import _ from 'lodash';

export const createServiceRequestModel = (_initialValues = {}) => ({
  account: _.get(_initialValues, 'account', null),
  serviceTypeCategory: _.get(_initialValues, 'serviceTypeCategory', ''),
  serviceType: _.get(_initialValues, 'serviceType', null),
  description: _.get(_initialValues, 'description', ''),
  location: _.get(_initialValues, 'location', null),
});
