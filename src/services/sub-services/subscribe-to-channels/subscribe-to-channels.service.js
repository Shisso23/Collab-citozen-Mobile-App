import stcUrls from './subscribe-to-channels.urls';
import authNetworkService from '../auth-network-service/auth-network.service';

const subscribeToChannels = (subscriptionList, userInfo) => {
  const url = stcUrls.subscribeToChannelsUrl();
  let subscriptionModel = '<Objects> ';
  subscriptionModel += subscriptionList
    .map(
      (obj) =>
        `<Channel_Subscription> <F1>${userInfo.email}</F1> <F2>${obj.ObjId}</F2> </Channel_Subscription> `,
    )
    .join(' ');
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
  subscribeToChannels,
};
