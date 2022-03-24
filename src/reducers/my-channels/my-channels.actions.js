import { setIsLoadingMyChannelsAction, setMyChannelsAction } from './my-channels.reducer';
import myChannelsService from '../../services/sub-services/my-channels/my-channels.service';
import _ from 'lodash';

export const getMyChannelsAction = async () => async (dispatch) => {
  dispatch(setIsLoadingMyChannelsAction(true));

  return myChannelsService
    .getMyChannels()
    .then((myChannels) => {
      dispatch(setMyChannelsAction(myChannels));
      return myChannels;
    })
    .catch((error) => _.get(error, ''))
    .finally(() => {
      dispatch(setIsLoadingMyChannelsAction(false));
    });
};
