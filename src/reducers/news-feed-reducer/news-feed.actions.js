import {
  setIsLoadingNewsFeedsAction,
  setIsLoadingNewsFeedReactionsAction,
  setNewsFeedsAction,
  setNewsFeedReactionsAction,
} from './news-feed.reducer';
import { flashService } from '../../services';
import newsFeedService from '../../services/sub-services/news-feed-service/news-feed.service';

export const getNewsFeedAction = (userId) => async (dispatch) => {
  dispatch(setIsLoadingNewsFeedsAction(true));
  return newsFeedService
    .getNewsFeed(userId)
    .then((newsFeeds) => {
      return dispatch(setNewsFeedsAction(newsFeeds));
    })
    .catch((error) => flashService.error(error.message))
    .finally(() => {
      dispatch(setIsLoadingNewsFeedsAction(false));
    });
};

export const getNewsfeedReactions = (newsfeedRefNr) => async (dispatch) => {
  dispatch(setIsLoadingNewsFeedReactionsAction(true));
  return newsFeedService
    .getNewsfeedReactions(newsfeedRefNr)
    .then((newsfeedReactions) => {
      dispatch(setNewsFeedReactionsAction(newsfeedReactions));
    })
    .catch((error) => flashService.error(error.message))
    .finally(() => {
      dispatch(setIsLoadingNewsFeedReactionsAction(false));
    });
};

export const userHasOpenedNewsFeedAction = async (newsfeedId, userID, action) => () => {
  return newsFeedService.createUserActivityRecord(newsfeedId, userID, action);
};
