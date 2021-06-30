import _ from 'lodash';
import async from 'async';

export const myChannelModel = (apiMyChannels) => ({
  objId: _.get(apiMyChannels, 'obj_id', ''),
  code: _.get(apiMyChannels, 'code', ''),
  name: _.get(apiMyChannels, 'name', ''),
});

export const constructMyChannelsModels = async (apiMyChannels) => {
  return async.map(apiMyChannels, async (Channel, done) => {
    const model = myChannelModel(Channel);
    done(null, model);
  });
};
