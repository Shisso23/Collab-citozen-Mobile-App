/* eslint-disable camelcase */
import _ from 'lodash';

export const signInModel = (_apiSignInModel = {}) => ({
  email: _.get(_apiSignInModel, 'email', ''),
  password: _.get(_apiSignInModel, 'password', ''),
});

export const apiSignInModel = (_appSignInModel = {}) => ({
  email: _.get(_appSignInModel, 'email', ''),
  password: _.get(_appSignInModel, 'password', ''),
});
