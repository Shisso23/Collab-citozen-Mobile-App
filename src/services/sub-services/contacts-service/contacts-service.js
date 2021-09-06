import _ from 'lodash';
import authNetworkService from '../auth-network-service/auth-network.service';
import { constructContactsChannelsModel } from '../../../models/app/contacts/contacts.model';
import globalServiceUrls from '../global/global.service.urls';
import { apiFunctionWithUniqNameChannels } from '../../../helpers/api-function-name.helper';

const getChannelsContacts = async (location) => {
  const url = globalServiceUrls.globalFunctionUrl();
  const data = await apiFunctionWithUniqNameChannels(
    'get_channel_contacts_by_location',
    location.longitude,
    location.latitude,
  );
  const apiResponse = await authNetworkService.post(url, data);
  console.log({ apiResponse });
  const channelsContacts = constructContactsChannelsModel(_.get(apiResponse, 'data.Channels', []));
  return channelsContacts;
};

export default {
  getChannelsContacts,
};
