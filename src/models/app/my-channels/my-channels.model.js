import _ from 'lodash';
import async from 'async';

export const myChannelModel = (apiMyChannel) => ({
  objId: _.get(apiMyChannel, 'obj_id', ''),
  code: _.get(apiMyChannel, 'code', ''),
  name: _.get(apiMyChannel, 'name', ''),
  interest_types: _.get(apiMyChannel, 'interest_types', ''),
  accountApplicable: _.get(apiMyChannel, 'accounts_applicable', false),
  userCanCreateNotification: _.get(apiMyChannel, 'broadcast_notification_permission', false),
  bannerImages: _.get(apiMyChannel, 'banner_images', []),
});

export const constructMyChannelsModels = async (apiMyChannels) => {
  return async.map(apiMyChannels, async (Channel, done) => {
    const model = myChannelModel(Channel);
    done(null, model);
  });
};
