import { setIsLoadingNewsFeedsAction, setNewsFeedsAction } from './news-feed.reducer';
import { flashService } from '../../services';
import newsFeedService from '../../services/sub-services/news-feed-service/news-feed.service';

export const getNewsFeedAction = () => (dispatch) => {
  dispatch(setIsLoadingNewsFeedsAction(true));
  return newsFeedService
    .getNewsFeed()
    .then((newsFeeds) => {
      dispatch(setNewsFeedsAction(newsFeeds));
    })
    .catch((error) => flashService.error(error.message))
    .finally(() => {
      dispatch(setIsLoadingNewsFeedsAction(false));
    });
};

export const userHasOpenedNewsFeedAction = (newsFeedId, userID) => async () => {
  await newsFeedService.createUserActivityRecord(newsFeedId, userID);
};
