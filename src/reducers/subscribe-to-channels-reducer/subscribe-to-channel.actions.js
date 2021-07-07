import { subscribeToChannelService } from '../../services';

export const subscribeToChannelsAction = (municipalitiyId, subscriptionList, user) => async () => {
  await subscribeToChannelService.subscribeToChannels(municipalitiyId, subscriptionList, user);
};

export const updateUserSubscriptionAction =
  (user, itemSelected, channelId, subscriptiontype) => async () => {
    await subscribeToChannelService.unSubscribeFromInterestType(
      user,
      itemSelected,
      channelId,
      subscriptiontype,
    );
  };
