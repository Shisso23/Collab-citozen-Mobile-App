import { setIsLoadingMyChannelsAction, setMyChannelsAction } from './my-channels.reducer';
import { flashService } from '../../services';
import myChannelsService from '../../services/sub-services/my-channels/my-channels.service';

export const getMyChannelsAction = () => (dispatch) => {
  dispatch(setIsLoadingMyChannelsAction(true));

  return myChannelsService
    .getMyChannels()
    .then((myChannels) => {
      dispatch(setMyChannelsAction(myChannels));
    })
    .catch((error) => flashService.error(error.message))
    .finally(() => {
      dispatch(setIsLoadingMyChannelsAction(false));
    });
};
