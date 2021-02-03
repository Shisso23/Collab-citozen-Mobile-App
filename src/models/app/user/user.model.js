/* eslint-disable camelcase */
import _ from 'lodash';

export function userModel(_apiUserModel) {
  return {
    email: _.get(_apiUserModel, 'email', ''),
    firstName: _.get(_apiUserModel, 'first_name', ''),
    lastName: _.get(_apiUserModel, 'surname', ''),
    avatar: _.get(_apiUserModel, 'avatarUrl', ''),
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  };
}

export const apiUserModel = (_appUserModel = {}) => ({
  user: {
    email: _.get(_appUserModel, 'email', ''),
    name: _.get(_appUserModel, 'name', ''),
  },
});
