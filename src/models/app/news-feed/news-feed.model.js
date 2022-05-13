import _ from 'lodash';
import async from 'async';
import RNFetchBlob from 'rn-fetch-blob';
import srUrls from '../../../services/sub-services/service-request-service/service-request.urls';
import storageService from '../../../services/sub-services/storage-service/storage.service';
import newsFeedUrls from '../../../services/sub-services/news-feed-service/news-feed.urls';
import {
  dataNewsfeedReactions,
  dataUserReactionsToNewsfeeds,
} from '../../../helpers/api-function-name.helper';
import { authNetworkService } from '../../../services';

const { config, fs } = RNFetchBlob;
const dirToSave = fs.dirs.DocumentDir;

const getNewsFeedImageUri = async (objId, fileId) => {
  const url = srUrls.viewSrImageUrl(objId, fileId);
  const token = await storageService.getAccessToken();
  return config({ path: `${dirToSave}/collab-${fileId}.png`, fileCache: true })
    .fetch('GET', url, {
      Authorization: `Bearer ${token}`,
    })
    .then((response) => {
      return `file:///${response.path()}`;
    });
};

export const newsFeedModel = async (_apiNewsFeedModel, accessToken, reactions, userReaction) => ({
  newsFeedId: _.get(_apiNewsFeedModel, 'obj_id', ''),
  fileId: _.get(_apiNewsFeedModel, 'file_id', ''),
  title: _.get(_apiNewsFeedModel, 'title', ''),
  body: _.get(_apiNewsFeedModel, 'body', ''),
  newsFeedImage: await getNewsFeedImageUri(_apiNewsFeedModel.obj_id, _apiNewsFeedModel.file_id),
  seen: _.get(_apiNewsFeedModel, 'seen', ''),
  date: _.get(_apiNewsFeedModel, 'date_published', new Date()),
  channelName: _.get(_apiNewsFeedModel, 'channel_name', ''),
  reactions: newsFeedReactionsModel(reactions),
  userReaction: userReactionsToNewsfeedsModel(userReaction),
});

export const constructNewsFeedModels = async (apiNewsFeed, userId) => {
  const token = await storageService.getAccessToken();
  return async.map(apiNewsFeed, async (newsArticle, done) => {
    const reactionsUrl = newsFeedUrls.execFunctionUrl();
    const data = dataNewsfeedReactions(newsArticle.obj_id);
    const reactions = await authNetworkService.post(reactionsUrl, data);
    const reactionsValues = reactions.data.liked_or_disliked_totals[0];
    const userReactionUrl = newsFeedUrls.execFunctionUrl();
    const userData = dataUserReactionsToNewsfeeds(newsArticle.obj_id, userId);
    const userReaction = await authNetworkService.post(userReactionUrl, userData);
    let userReactionValues = '';
    if (userReaction.data !== null) {
      userReactionValues = userReaction.data.user_last_reaction;
    }
    const model = await newsFeedModel(newsArticle, token, reactionsValues, userReactionValues[0]);
    done(null, model);
  });
};

export const newsFeedReactionsModel = (_apiNewsFeedReactionsModel) => ({
  newsFeedId: _.get(_apiNewsFeedReactionsModel, 'obj_id', ''),
  channelRef: _.get(_apiNewsFeedReactionsModel, 'channel_ref', ''),
  likes: _.get(_apiNewsFeedReactionsModel, 'total_liked', ''),
  dislikes: _.get(_apiNewsFeedReactionsModel, 'total_disliked', ''),
});

export const constructNewsFeedReactionsModel = async (apiNewsfeedReactions) => {
  return async.map(apiNewsfeedReactions, async (newsfeedReactions, done) => {
    const model = newsFeedReactionsModel(newsfeedReactions);
    done(null, model);
  });
};

export const userReactionsToNewsfeedsModel = (_apiUserReactionsToNewsfeedsModel) => ({
  newsFeedRef: _.get(_apiUserReactionsToNewsfeedsModel, 'newsfeed_ref', ''),
  userId: _.get(_apiUserReactionsToNewsfeedsModel, 'user_id', ''),
  lastReaction: _.get(_apiUserReactionsToNewsfeedsModel, 'last_reaction', ''),
});

export const constructUserReactionsToNewsfeedsModel = async (apiUserReactionsToNewsfeeds) => {
  return async.map(apiUserReactionsToNewsfeeds, async (userReactionsToNewsfeeds, done) => {
    const model = userReactionsToNewsfeedsModel(userReactionsToNewsfeeds);
    done(null, model);
  });
};
