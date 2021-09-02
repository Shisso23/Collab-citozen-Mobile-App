/* eslint-disable no-unused-vars */
import _ from 'lodash';
import contactsUrls from './contacts.urls';
import authNetworkService from '../auth-network-service/auth-network.service';
import { mockApi } from '../../../dummy-data/mock-api';
import { constructContactsModels } from '../../../models/app/contacts/contacts.model';

const getContactDetails = async (location) => {
  const url = contactsUrls.contactsUrl();
  const apiResponse = await mockApi.post(url, location);
  const contacts = constructContactsModels(_.get(apiResponse, 'data.contacts', []));
  return contacts;
};

export default {
  getContactDetails,
};
