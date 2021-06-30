import { subscribeToChannelService } from '../../services';

export const subscribeToChannelsAction = (subscriptionList, user) => async () => {
  await subscribeToChannelService.subscribeToChannels(subscriptionList, user);
};
