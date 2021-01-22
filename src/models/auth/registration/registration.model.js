/* eslint-disable camelcase */
import _ from 'lodash';

export const registrationUserModel = (_apiRegistrationsModel = {}) => ({
  email: _.get(_apiRegistrationsModel, 'email', ''),
  name: _.get(_apiRegistrationsModel, 'name', ''),
  password: _.get(_apiRegistrationsModel, 'password', ''),
  confirmPassword: _.get(_apiRegistrationsModel, 'password_confirmation', ''),
  termsAndConditions: _.get(_apiRegistrationsModel, 'terms_and_conditions', false),
});

export const apiRegistrationUserModel = (_appRegistrationsModel = {}) => ({
  user: {
    email: _.get(_appRegistrationsModel, 'email', ''),
    name: _.get(_appRegistrationsModel, 'name', ''),
    password: _.get(_appRegistrationsModel, 'password', ''),
    password_confirmation: _.get(_appRegistrationsModel, 'confirmPassword', ''),
    terms_and_conditions: _.get(_appRegistrationsModel, 'termsAndConditions', false),
  },
});
