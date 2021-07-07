/* eslint-disable camelcase */
import _ from 'lodash';

export function userModel(_apiUserModel) {
  return {
    user_id: _.get(_apiUserModel, 'user_id'),
    email: _.get(_apiUserModel, 'email_address', ''),
    firstName: _.get(_apiUserModel, 'first_name', ''),
    lastName: _.get(_apiUserModel, 'surname', ''),
    avatar: `https://loremflickr.com/320/240/landscape?random=${_.random(1000)}`,
    mobileNumber: _.get(_apiUserModel, 'mobile_number', ''),
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  };
}

export const apiUserModel = (_appUserModel = {}) => ({
  user: {
    email: _.get(_appUserModel, 'email', ''),
    name: _.get(_appUserModel, 'name', ''),
    lastName: _.get(_appUserModel, 'lastName', ''),
  },
});
