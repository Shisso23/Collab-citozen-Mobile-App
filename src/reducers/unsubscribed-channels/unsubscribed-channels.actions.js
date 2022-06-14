import myChannelsService from '../../services/sub-services/my-channels/my-channels.service';
import { setUnsubscribedChannelsAction } from './unsubscribed-channels.reducer';

export const getUnsubscribedChannelsByLocationAction =
  async (longitude, latitude) => async (dispatch) => {
    const unsubscribedChannles = await myChannelsService.getUnsubscribedChannels(
      longitude,
      latitude,
    );
    dispatch(setUnsubscribedChannelsAction(unsubscribedChannles));
  };
