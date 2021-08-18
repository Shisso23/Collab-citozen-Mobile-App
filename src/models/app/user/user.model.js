/* eslint-disable camelcase */
import _ from 'lodash';

export function userModel(_apiUserModel) {
  return {
    user_id: _.get(_apiUserModel, 'user_id'),
    email: _.get(_apiUserModel, 'email_address', ''),
    firstName: _.get(_apiUserModel, 'first_name', ''),
    lastName: _.get(_apiUserModel, 'surname', ''),
    avatar: `https://loremflickr.com/320/240/landscape?random=${_.random(1000)}`,
    idNumber: _.get(_apiUserModel, 'id_number', ''),
    telNumber: _.get(_apiUserModel, 'tel_number', ''),
    mobileNumber: _.get(_apiUserModel, 'mobile_number', ''),
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  };
}

export const apiUserModel = (_appUserModel = {}) => ({
  user: {
    email: _.get(_appUserModel, 'email', ''),
    name: _.get(_appUserModel, 'firstName', ''),
    lastName: _.get(_appUserModel, 'lastName', ''),
    idNumber: _.get(_appUserModel, 'idNumber'),
    telNumber: _.get(_appUserModel, 'telNumber'),
    mobileNumber: _.get(_appUserModel, 'mobileNumber'),
  },
});
