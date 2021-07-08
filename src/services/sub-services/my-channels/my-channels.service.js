import _ from 'lodash';

import { constructMyChannelsModels } from '../../../models/app/my-channels/my-channels.model';
import globalUrl from '../global/global.service.urls';
import {
  apiFunctionWithUniqName,
  apiFunctionWithUniqNameChannels,
} from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';
import { flashService } from '../../index';

const getMyChannels = async () => {
  const url = globalUrl.globalFunctionUrl();
  const data = await apiFunctionWithUniqName('get_subscribed_channels');
  const apiResponse = await authNetworkService.post(url, data);
  const myChannels = _.get(apiResponse.data, 'Channels', []);
  if (!myChannels) {
    throw Error('Could not load your channels.');
  }
  if (myChannels.length === 0) {
    flashService.info('You Have No Channel Subscriptions.');
  }
  return constructMyChannelsModels(myChannels);
};

const getUnsubscribedChannels = async (longitude, latitude) => {
  const url = globalUrl.globalFunctionUrl();
  const data = await apiFunctionWithUniqNameChannels(
    'get_unsubscribed_channels_by_location',
    longitude,
    latitude,
  );
  const apiResponse = await authNetworkService.post(url, data);
  const myChannels = _.get(apiResponse.data, 'Channels', []);
  const channlesConstruct = constructMyChannelsModels(myChannels);
  return channlesConstruct;
};

export default {
  getMyChannels,
  getUnsubscribedChannels,
};
