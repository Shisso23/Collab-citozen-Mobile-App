/* eslint-disable camelcase */
import _ from 'lodash';

export const userModel = (_apiUserModel = {}) => ({
  email: _.get(_apiUserModel, 'email', ''),
  name: _.get(_apiUserModel, 'name', ''),
});

export const apiUserModel = (_appUserModel = {}) => ({
  user: {
    email: _.get(_appUserModel, 'email', ''),
    name: _.get(_appUserModel, 'name', ''),
  },
});
