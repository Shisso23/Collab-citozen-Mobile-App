/* eslint-disable camelcase */
import _ from 'lodash';

export const forgotPasswordModel = (_apiForgotPasswordModel = {}) => ({
  email: _.get(_apiForgotPasswordModel, 'email', ''),
});

export const apiForgotPasswordModel = (_appForgotPasswordModel = {}) => ({
  email: _.get(_appForgotPasswordModel, 'email', ''),
});
