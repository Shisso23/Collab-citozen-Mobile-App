/* eslint-disable no-unused-vars */
import _ from 'lodash';
import contactsUrls from './contacts.urls';

// import {
//   dataCreateRecord,
//   dataValidateAccount,
//   dataGetAccounts,
// } from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';
import { mockApi } from '../../../dummy-data/mock-api';
import { contactsModel } from '../../../models/app/contacts/contacts.model';

const getContactDetails = async (location) => {
  const url = contactsUrls.contactsUrl();

  //   const data = await dataGetAccounts('get_contacts', location);
  const apiResponse = await mockApi.post(url, location);
  const contacts = contactsModel(_.get(apiResponse, 'data.Channels', []));
  return contacts;
};

export default {
  getContactDetails,
};
