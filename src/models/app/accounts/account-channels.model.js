import _ from 'lodash';
import { constructAccountModels } from './account.model';

const accountChannelsModel = (_apiAccountChannelModel = {}) => {
  const accounts = constructAccountModels(_.get(_apiAccountChannelModel, 'accounts', []));
  return {
    objectId: _.get(_apiAccountChannelModel, 'obj_id', ''),
    name: _.get(_apiAccountChannelModel, 'name', ''),
    accounts,
    accountApplicable: _.get(_apiAccountChannelModel, 'accounts_applicable', false),
    paymentApplicable: _.get(_apiAccountChannelModel, 'payment_applicable', false), // TODO change this once back end is ready
    status: _.get(_apiAccountChannelModel, 'status', ''),
  };
};

export const constructChannelModels = (apiChannels) =>
  apiChannels.map((channel) => accountChannelsModel(channel));
