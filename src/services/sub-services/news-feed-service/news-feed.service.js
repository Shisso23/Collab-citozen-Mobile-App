import _ from 'lodash';

import { constructNewsFeedModels } from '../../../models/app/news-feed/news-feed.model';
import globalUrl from '../global/global.service.urls';
import { apiFunctionWithUniqName } from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';
import { flashService } from '../../index';

const getNewsFeed = async () => {
  const url = globalUrl.globalFunctionUrl();
  const data = await apiFunctionWithUniqName('get_user_feed');
  const apiResponse = await authNetworkService.post(url, data);
  const newsfeeds = _.get(apiResponse.data, 'Feed', []);
  if (newsfeeds.length === 0 || !newsfeeds) {
    flashService.info('There is no news currently avaliable for you');
  }
  return constructNewsFeedModels(newsfeeds);
};

export default {
  getNewsFeed,
};
