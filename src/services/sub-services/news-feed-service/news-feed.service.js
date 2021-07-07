import _ from 'lodash';

import { constructNewsFeedModels } from '../../../models/app/news-feed/news-feed.model';
import globalUrl from '../global/global.service.urls';
import { apiFunctionWithUniqName } from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';
import { flashService } from '../../index';
import newsFeedUrls from './news-feed.urls';

const getNewsFeed = async () => {
  const url = globalUrl.globalFunctionUrl();
  const data = await apiFunctionWithUniqName('get_user_feed');
  const apiResponse = await authNetworkService.post(url, data);
  const newsfeeds = _.get(apiResponse.data, 'Feed', []);
  if (!newsfeeds) {
    throw Error('Could not load news feeds.');
  }
  if (newsfeeds.length === 0) {
    flashService.info('There is no news currently avaliable for you.');
  }
  return constructNewsFeedModels(newsfeeds);
};

const createUserActivityRecord = (newsFeedId, userID) => {
  const url = newsFeedUrls.newsFeedActivityUrl();
  let subscriptionModel = '<Objects> ';
  subscriptionModel += `<User_News_Feed_Item_Activity> <F1>${userID}</F1> <F2>${newsFeedId}</F2> <F3>Opened</F3> </User_News_Feed_Item_Activity> `;
  subscriptionModel += '</Objects>';

  try {
    return authNetworkService.post(url, subscriptionModel);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(JSON.stringify(err, null, 2));
    throw err;
  }
};

export default {
  getNewsFeed,
  createUserActivityRecord,
};
