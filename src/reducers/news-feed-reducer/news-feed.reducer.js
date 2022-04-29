import CreateAction from '../action-utilities/action-creator';

const reducerName = 'newsFeed';

const setNewsFeeds = CreateAction(reducerName, 'SET_NEWS_FEEDS');
export const setNewsFeedsAction = setNewsFeeds.action;

const setIsLoadingNewsFeeds = CreateAction(reducerName, 'SET_IS_LOADING_NEWS_FEEDS');
export const setIsLoadingNewsFeedsAction = setIsLoadingNewsFeeds.action;

const setNewsFeedReactions = CreateAction(reducerName, 'SET_NEWS_FEED_REACTIONS');
export const setNewsFeedReactionsAction = setNewsFeedReactions.action;

const setIsLoadingNewsFeedReactions = CreateAction(
  reducerName,
  'SET_IS_LOADING_NEWS_FEED_REACTIONS',
);
export const setIsLoadingNewsFeedReactionsAction = setIsLoadingNewsFeedReactions.action;

const initialState = {
  newsFeeds: [],
  isLoadingNewsFeeds: false,
  newsFeedReactions: [],
  isLoadingNewsFeedReactions: false,
};

export const newsFeedSelector = (reducers) => reducers.newsFeedsReducer;

export default function newsFeedsReducer(state = initialState, action) {
  switch (action.type) {
    case setNewsFeeds.actionType:
      return {
        ...state,
        newsFeeds: action.payload,
      };
    case setIsLoadingNewsFeeds.actionType:
      return {
        ...state,
        isLoadingNewsFeeds: action.payload,
      };
    case setNewsFeedReactions.actionType:
      return {
        ...state,
        newsFeedsLikesDislikes: action.payload,
      };
    case setIsLoadingNewsFeedReactions.actionType:
      return {
        ...state,
        isLoadingNewsFeedsLikesDislikes: action.payload,
      };
    default:
      return state;
  }
}
