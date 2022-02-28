import _ from 'lodash';
import async from 'async';

import srUrls from '../../../services/sub-services/service-request-service/service-request.urls';
import storageService from '../../../services/sub-services/storage-service/storage.service';

const getNewsFeedImageUrl = (_apiServiceRequestModel, token) => {
  const fileId = _.get(_apiServiceRequestModel, 'file_id');
  const objId = _.get(_apiServiceRequestModel, 'obj_id');
  if (!fileId) {
    return null;
  }
  const uri = srUrls.viewSrImageUrl(objId, fileId);

  return {
    uri,
    timeout: 20000,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const newsFeedModel = (_apiNewsFeedModel, accessToken) => ({
  newsFeedId: _.get(_apiNewsFeedModel, 'obj_id', ''),
  fileId: _.get(_apiNewsFeedModel, 'file_id', ''),
  title: _.get(_apiNewsFeedModel, 'title', ''),
  body: _.get(_apiNewsFeedModel, 'body', ''),
  newsFeedImage: getNewsFeedImageUrl(_apiNewsFeedModel, accessToken),
  seen: _.get(_apiNewsFeedModel, 'seen', ''),
  date: _.get(_apiNewsFeedModel, 'date_published', new Date()),
  channelName: _.get(_apiNewsFeedModel, 'channel_name', ''),
});

export const constructNewsFeedModels = async (apiNewsFeed) => {
  const token = await storageService.getAccessToken();
  return async.map(apiNewsFeed, async (newsArticle, done) => {
    const model = newsFeedModel(newsArticle, token);
    done(null, model);
  });
};
