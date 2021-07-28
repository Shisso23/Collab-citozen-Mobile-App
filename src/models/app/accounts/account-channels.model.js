import _ from 'lodash';
import { constructAccountModels } from './account.model';

const accountChannelsModel = (_apiAccountChannelModel = {}) => {
  const accounts = constructAccountModels(_.get(_apiAccountChannelModel, 'accounts', []));
  return {
    objectId: _.get(_apiAccountChannelModel, 'obj_id', ''),
    name: _.get(_apiAccountChannelModel, 'name', ''),
    accounts,
    accountApplicable: _.get(_apiAccountChannelModel, 'account_applicable', ''),
    status: _.get(_apiAccountChannelModel, 'status', ''),
  };
};

export const constructChannelModels = (apiChannels) =>
  apiChannels.map((channel) => accountChannelsModel(channel));
