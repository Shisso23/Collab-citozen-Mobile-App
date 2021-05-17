/* eslint-disable camelcase */
import _ from 'lodash';

export const registrationUserModel = (_apiRegistrationsModel = {}) => ({
  firstName: _.get(_apiRegistrationsModel, 'firstName', ''),
  lastName: _.get(_apiRegistrationsModel, 'lastName', ''),
  mobileNumber: _.get(_apiRegistrationsModel, 'mobileNumber', ''),
  email: _.get(_apiRegistrationsModel, 'email', ''),
  password: _.get(_apiRegistrationsModel, 'password', ''),
  confirmPassword: _.get(_apiRegistrationsModel, 'password_confirmation', ''),
  termsAndConditions: _.get(_apiRegistrationsModel, 'terms_and_conditions', false),
});

export const apiRegistrationUserModel = (_appRegistrationsModel = {}) => ({
  Name: _.get(_appRegistrationsModel, 'firstName', ''),
  Surname: _.get(_appRegistrationsModel, 'lastName', ''),
  Cell: _.get(_appRegistrationsModel, 'mobileNumber', ''),
  Email: _.get(_appRegistrationsModel, 'email', ''),
  Password: _.get(_appRegistrationsModel, 'password', ''),
});
